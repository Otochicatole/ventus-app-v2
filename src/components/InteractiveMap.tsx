"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { isValidCoordinates } from "@/lib/coordinates";

// Interface para las ubicaciones obtenidas de la base de datos
interface LocationData {
    id: string;
    name: string;
    address: string;
    latitude: number | null;
    longitude: number | null;
    createdAt: string;
    updatedAt: string;
}

export default function InteractiveMap() {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const markersRef = useRef<{ [id: string]: maplibregl.Marker }>({});

    const [locations, setLocations] = useState<LocationData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const mappableLocations = useMemo(
        () => locations.filter((loc) => isValidCoordinates(loc.latitude, loc.longitude)),
        [locations]
    );

    // 1. Obtener ubicaciones desde la base de datos
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await fetch("/api/locations", { cache: "no-store" });
                if (!res.ok) throw new Error("Error al consultar ubicaciones");
                const data: LocationData[] = await res.json();

                setLocations(data);
                const firstMappable = data.find((loc) =>
                    isValidCoordinates(loc.latitude, loc.longitude)
                );
                if (firstMappable) {
                    setSelectedId(firstMappable.id);
                } else if (data.length > 0) {
                    setSelectedId(data[0].id);
                }
            } catch (err) {
                console.error("Error al cargar ubicaciones del mapa:", err);
                setError("No se pudo cargar la información de las sucursales.");
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, []);

    // 2. Inicializar MapLibre GL con 3D habilitado
    useEffect(() => {
        if (loading || mappableLocations.length === 0 || !mapContainerRef.current) return;

        const container = mapContainerRef.current;
        let disposed = false;
        let map: maplibregl.Map | null = null;
        let resizeObserver: ResizeObserver | null = null;

        // Calcular el centroide promedio de todas las sucursales con coordenadas válidas
        let sumLat = 0;
        let sumLng = 0;
        mappableLocations.forEach((loc) => {
            sumLat += loc.latitude!;
            sumLng += loc.longitude!;
        });
        const defaultLat = sumLat / mappableLocations.length;
        const defaultLng = sumLng / mappableLocations.length;

        if (!isValidCoordinates(defaultLat, defaultLng)) {
            return;
        }

        const initMap = () => {
            if (disposed || map || container.clientWidth === 0 || container.clientHeight === 0) {
                return;
            }

            try {
                map = new maplibregl.Map({
                    container,
                    style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json", // CARTO Positron Light
                    center: [defaultLng, defaultLat],
                    zoom: mappableLocations.length === 1 ? 15.2 : 14.2,
                    pitch: 45, // Inclinación tridimensional inicial
                    bearing: -10 // Orientación/Rotación inicial
                });

                // Controles de navegación nativos (Zoom, Inclinación y Brújula)
                map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true }), "top-right");

                // Agregar capa 3D de edificios (fill-extrusion) de manera dinámica al cargarse el mapa
                map.on("load", () => {
                    if (!map || disposed) return;
                    const style = map.getStyle();
                    const sources = style.sources;

                    // Localizar el ID de la fuente de vector tiles activa en el basemap de CARTO
                    const vectorSourceId = Object.keys(sources).find(
                        (key) => sources[key].type === "vector"
                    );

                    if (vectorSourceId) {
                        // Identificar la primera capa de etiquetas de texto para posicionar la extrusión debajo de ellas
                        const layers = style.layers;
                        let labelLayerId;
                        for (let i = 0; i < layers.length; i++) {
                            const layout = layers[i].layout as Record<string, unknown> | undefined;
                            if (layers[i].type === "symbol" && layout && layout["text-field"]) {
                                labelLayerId = layers[i].id;
                                break;
                            }
                        }

                        // Inyectar capa 3D fill-extrusion para levantar edificios urbanos
                        map.addLayer(
                            {
                                id: "3d-buildings",
                                source: vectorSourceId,
                                "source-layer": "building", // Nombre estándar de OpenMapTiles para edificios
                                type: "fill-extrusion",
                                minzoom: 14,
                                paint: {
                                    // Color claro adaptado al diseño de piedra/stone del proyecto
                                    "fill-extrusion-color": [
                                        "interpolate",
                                        ["linear"],
                                        ["get", "render_height"],
                                        0, "#e7e5e4", // stone-200
                                        50, "#d6d3d1", // stone-300
                                        100, "#a8a29e" // stone-400
                                    ],
                                    // Elevación fluida de edificios a medida que se realiza zoom
                                    "fill-extrusion-height": [
                                        "interpolate",
                                        ["linear"],
                                        ["zoom"],
                                        14, 0,
                                        14.5, ["get", "render_height"]
                                    ],
                                    "fill-extrusion-base": [
                                        "interpolate",
                                        ["linear"],
                                        ["zoom"],
                                        14, 0,
                                        14.5, ["get", "render_base_height"]
                                    ],
                                    "fill-extrusion-opacity": 0.65
                                }
                            },
                            labelLayerId
                        );
                    }
                });

                // Limpiar marcadores antiguos de la referencia
                Object.values(markersRef.current).forEach((marker) => marker.remove());
                markersRef.current = {};

                // 3. Crear marcadores HTML personalizados usando Lucide MapPin SVG
                const newMarkers: { [id: string]: maplibregl.Marker } = {};

                mappableLocations.forEach((loc) => {
                    const el = document.createElement("div");
                    el.className = `custom-marker-${loc.id} cursor-pointer select-none`;

                    el.innerHTML = `
                        <div class="lucide-pin-wrapper relative flex flex-col items-center group transition-transform duration-300 ease-out origin-bottom">
                            <div class="absolute -inset-2 rounded-full bg-[#0b3a60]/10 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-[opacity,transform] duration-300"></div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#78716c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-pin-svg transition-transform duration-300">
                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                        </div>
                    `;

                    // Escuchar el evento clic en el marcador
                    el.addEventListener("click", (e) => {
                        e.stopPropagation();
                        handleSelectLocation(loc);
                    });

                    // Añadir el marcador al mapa
                    const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
                        .setLngLat([loc.longitude!, loc.latitude!])
                        .addTo(map!);

                    newMarkers[loc.id] = marker;
                });

                markersRef.current = newMarkers;
                mapRef.current = map;
            } catch (mapErr) {
                console.warn("No se pudo inicializar el mapa interactivo:", mapErr);
                if (map) {
                    map.remove();
                    map = null;
                }
            }
        };

        if (container.clientWidth > 0 && container.clientHeight > 0) {
            initMap();
        } else {
            resizeObserver = new ResizeObserver(() => {
                if (container.clientWidth > 0 && container.clientHeight > 0) {
                    resizeObserver?.disconnect();
                    initMap();
                }
            });
            resizeObserver.observe(container);
        }

        // Cleanup al desmontar
        return () => {
            disposed = true;
            resizeObserver?.disconnect();
            Object.values(markersRef.current).forEach((marker) => marker.remove());
            markersRef.current = {};
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            } else if (map) {
                map.remove();
                map = null;
            }
        };
    }, [loading, mappableLocations]);

    // 4. Actualizar visualmente los marcadores cuando cambia la selección
    useEffect(() => {
        if (mappableLocations.length === 0 || Object.keys(markersRef.current).length === 0) return;

        Object.entries(markersRef.current).forEach(([id, marker]) => {
            const el = marker.getElement();
            const wrapper = el.querySelector<HTMLElement>(".lucide-pin-wrapper");
            const svg = el.querySelector(".lucide-pin-svg");
            const isSelected = id === selectedId;

            if (isSelected) {
                // Escalar SOLO el contenedor interno para no pisar el transform de posicionamiento de MapLibre
                if (wrapper) {
                    wrapper.style.transform = "scale(1.25) translateY(-2px)";
                }
                el.style.zIndex = "10";
                
                if (svg) {
                    // Poner en Azul Royal Premium de Ventus, rellenar y dotar de brillo
                    svg.setAttribute("stroke", "#0b3a60");
                    svg.setAttribute("fill", "#0b3a60");
                    svg.setAttribute("stroke-width", "2.5");
                    
                    // Colorear el círculo interior de blanco para contraste refinado
                    const circle = svg.querySelector("circle");
                    if (circle) {
                        circle.setAttribute("fill", "#ffffff");
                        circle.setAttribute("stroke", "#0b3a60");
                        circle.setAttribute("stroke-width", "1.5");
                    }
                }
            } else {
                if (wrapper) {
                    wrapper.style.transform = "scale(1) translateY(0)";
                }
                el.style.zIndex = "1";
                
                if (svg) {
                    // Pin gris neutral (stone-400 / #a8a29e)
                    svg.setAttribute("stroke", "#a8a29e");
                    svg.setAttribute("fill", "none");
                    svg.setAttribute("stroke-width", "2");
                    
                    const circle = svg.querySelector("circle");
                    if (circle) {
                        circle.setAttribute("fill", "none");
                        circle.setAttribute("stroke", "#a8a29e");
                        circle.setAttribute("stroke-width", "2");
                    }
                }
            }
        });
    }, [selectedId, mappableLocations]);

    // Función para manejar la selección de una sucursal y la transición de cámara
    const handleSelectLocation = (loc: LocationData) => {
        setSelectedId(loc.id);
        
        if (mapRef.current && isValidCoordinates(loc.latitude, loc.longitude)) {
            // Animación suave de planeo (flyTo) inclinando aún más la cámara para apreciar el relieve 3D
            mapRef.current.flyTo({
                center: [loc.longitude!, loc.latitude!],
                zoom: 16.5,
                pitch: 55, // Inclinación en 3D acentuada al hacer zoom
                bearing: -15, // Ligera rotación para apreciar las fachadas de los edificios
                speed: 1.2,
                curve: 1.4,
                essential: true
            });
        }
    };

    const activeLocation = locations.find((l) => l.id === selectedId);

    return (
        <section id="locales-section" className="bg-stone-100 py-20 sm:py-28 px-6 sm:px-12 md:px-24">
            <div className="max-w-7xl mx-auto space-y-12">
                
                {/* Encabezado del Módulo */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-tight text-stone-900">
                        Nuestros locales
                    </h2>
                    <p className="text-stone-600 max-w-md leading-relaxed text-base">
                        Encontrá la sucursal de Ventus más cercana para tu próximo turno.
                    </p>
                </div>

                {loading ? (
                    <div className="grid lg:grid-cols-12 gap-8 h-[600px]">
                        <div className="lg:col-span-4 bg-white h-full" />
                        <div className="lg:col-span-8 bg-stone-200 h-full" />
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-[350px] bg-white p-8 text-center">
                        <MapPin className="w-10 h-10 text-stone-400 mb-3" />
                        <p className="text-stone-700 text-sm">{error}</p>
                    </div>
                ) : locations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[350px] bg-white p-8 text-center">
                        <MapPin className="w-10 h-10 text-stone-400 mb-3" />
                        <p className="text-stone-700 text-sm">No hay locales registrados en el sistema.</p>
                    </div>
                ) : (
                    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 h-auto lg:h-[580px]">
                        
                        {/* Panel de Sucursales */}
                        <div className="lg:col-span-4 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto w-full lg:h-full pb-2 lg:pb-0 snap-x snap-mandatory">
                            {locations.map((loc) => {
                                const isSelected = loc.id === selectedId;
                                return (
                                    <button
                                        key={loc.id}
                                        type="button"
                                        onClick={() => handleSelectLocation(loc)}
                                        aria-pressed={isSelected}
                                        className={`text-left p-6 transition-colors duration-200 cursor-pointer flex flex-col justify-between min-h-[156px] w-[280px] sm:w-[310px] lg:w-full flex-shrink-0 snap-start ${
                                            isSelected
                                                ? "bg-[#0b3a60] text-white"
                                                : "bg-white text-stone-900 hover:bg-stone-50"
                                        }`}
                                    >
                                        <div className="space-y-2 w-full">
                                            <div className="flex items-start justify-between gap-4">
                                                <h3 className="font-semibold tracking-tight text-base sm:text-lg">
                                                    {loc.name}
                                                </h3>
                                                <MapPin
                                                    className={`w-5 h-5 flex-shrink-0 ${
                                                        isSelected ? "text-blue-200" : "text-stone-500"
                                                    }`}
                                                />
                                            </div>
                                            <p
                                                className={`text-sm line-clamp-2 ${
                                                    isSelected ? "text-blue-100" : "text-stone-600"
                                                }`}
                                            >
                                                {loc.address}
                                            </p>
                                        </div>

                                        <div className="hidden lg:flex items-center justify-between pt-4 w-full">
                                            <span
                                                className={`text-sm font-medium ${
                                                    isSelected ? "text-blue-100" : "text-stone-600"
                                                }`}
                                            >
                                                {isSelected ? "Sucursal seleccionada" : "Ver en mapa"}
                                            </span>
                                            <Navigation
                                                className={`w-4 h-4 ${
                                                    isSelected ? "text-white" : "text-stone-500"
                                                }`}
                                            />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Contenedor del Mapa */}
                        <div className="lg:col-span-8 relative h-[380px] sm:h-[450px] lg:h-full min-h-[380px] bg-white overflow-clip w-full">
                            {mappableLocations.length > 0 ? (
                                <div ref={mapContainerRef} className="w-full h-full min-h-[380px]" />
                            ) : (
                                <div className="w-full h-full min-h-[380px] flex flex-col items-center justify-center p-8 text-center bg-stone-50">
                                    <MapPin className="w-10 h-10 text-stone-400 mb-3" />
                                    <p className="text-stone-700 text-sm max-w-sm">
                                        Las sucursales cargadas no tienen coordenadas válidas para mostrar en el mapa.
                                    </p>
                                </div>
                            )}

                            {activeLocation && (
                                <div className="absolute bottom-6 left-6 bg-white p-6 z-30 max-w-sm hidden lg:block">
                                    <div className="space-y-1">
                                        <h4 className="font-semibold text-stone-900 text-lg">
                                            {activeLocation.name}
                                        </h4>
                                        <p className="text-sm text-stone-600 leading-relaxed">
                                            {activeLocation.address}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                )}
            </div>
        </section>
    );
}
