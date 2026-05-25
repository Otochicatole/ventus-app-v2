"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, Phone, Clock } from "lucide-react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

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

    // 1. Obtener ubicaciones desde la base de datos
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await fetch("/api/locations");
                if (!res.ok) throw new Error("Error al consultar ubicaciones");
                const data: LocationData[] = await res.json();
                
                // Filtrar solo aquellas sucursales que tengan latitud y longitud válidas
                const validLocations = data.filter(
                    (loc) => loc.latitude !== null && loc.longitude !== null
                );
                
                setLocations(validLocations);
                if (validLocations.length > 0) {
                    setSelectedId(validLocations[0].id);
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

    // 2. Inicializar MapLibre GL
    useEffect(() => {
        if (loading || locations.length === 0 || !mapContainerRef.current) return;

        // Calcular el centroide promedio de todas las sucursales cargadas
        let sumLat = 0;
        let sumLng = 0;
        locations.forEach((loc) => {
            sumLat += loc.latitude!;
            sumLng += loc.longitude!;
        });
        const defaultLat = sumLat / locations.length;
        const defaultLng = sumLng / locations.length;

        // Inicializar instancia nativa de MapLibre GL
        const map = new maplibregl.Map({
            container: mapContainerRef.current,
            style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json", // CARTO Positron Light
            center: [defaultLng, defaultLat],
            zoom: 13,
            pitch: 0,
            bearing: 0,
            antialias: true
        });

        // Controles de navegación nativos
        map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");

        // Limpiar marcadores antiguos de la referencia
        Object.values(markersRef.current).forEach((marker) => marker.remove());
        markersRef.current = {};

        // 3. Crear marcadores HTML personalizados usando Lucide MapPin SVG
        const newMarkers: { [id: string]: maplibregl.Marker } = {};

        locations.forEach((loc) => {
            const el = document.createElement("div");
            // Transición CSS para escala suave al seleccionar
            el.className = `custom-marker-${loc.id} cursor-pointer transition-all duration-300 ease-out origin-bottom transform select-none`;
            
            // Estructura interna del pin con el SVG exacto de Lucide React MapPin y un aro de pulso en hover
            el.innerHTML = `
                <div class="relative flex flex-col items-center group">
                    <!-- Efecto de pulso en hover -->
                    <div class="absolute -inset-2 rounded-full bg-[#0b3a60]/10 blur-sm scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                    <!-- Icono Lucide MapPin SVG -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#78716c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-pin-svg filter drop-shadow-md transition-all duration-300">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <!-- Pequeña sombra de apoyo del pin -->
                    <div class="w-1.5 h-0.5 bg-black/20 rounded-full blur-[0.5px] mt-0.5 transition-transform duration-300 group-hover:scale-x-150"></div>
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
                .addTo(map);

            newMarkers[loc.id] = marker;
        });

        markersRef.current = newMarkers;
        mapRef.current = map;

        // Cleanup al desmontar
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [loading, locations]);

    // 4. Actualizar visualmente los marcadores cuando cambia la selección
    useEffect(() => {
        if (locations.length === 0 || Object.keys(markersRef.current).length === 0) return;

        Object.entries(markersRef.current).forEach(([id, marker]) => {
            const el = marker.getElement();
            const svg = el.querySelector(".lucide-pin-svg");
            const isSelected = id === selectedId;

            if (isSelected) {
                // Agrandar suavemente el pin activo (1.3x) y elevarlo un poco
                el.style.transform = "scale(1.25) translateY(-2px)";
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
                // Retornar a escala natural y z-index neutral
                el.style.transform = "scale(1) translateY(0)";
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
    }, [selectedId, locations]);

    // Función para manejar la selección de una sucursal y la transición de cámara
    const handleSelectLocation = (loc: LocationData) => {
        setSelectedId(loc.id);
        
        if (mapRef.current && loc.longitude !== null && loc.latitude !== null) {
            mapRef.current.flyTo({
                center: [loc.longitude, loc.latitude],
                zoom: 16,
                speed: 1.2,
                curve: 1.4,
                essential: true
            });
        }
    };

    const activeLocation = locations.find((l) => l.id === selectedId);

    return (
        <section id="locales-section" className="bg-white border-t border-stone-200 py-24 px-6 sm:px-12 md:px-24">
            <div className="max-w-7xl mx-auto space-y-12">
                
                {/* Encabezado del Módulo */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-100 pb-8">
                    <div className="space-y-4">
                        <p className="text-xs font-bold tracking-[0.3em] text-[#0b3a60] uppercase">
                            UBICACIONES EXCLUSIVAS
                        </p>
                        <h2 className="text-4xl sm:text-5xl font-light tracking-tight text-stone-900">
                            Nuestros <span className="font-semibold text-[#0b3a60]">Locales</span>
                        </h2>
                    </div>
                    <p className="text-stone-500 font-light max-w-md leading-relaxed text-sm">
                        Encontrá la sucursal de Ventus más cercana y experimentá la excelencia en barbería clásica con una ambientación refinada.
                    </p>
                </div>

                {loading ? (
                    /* Shimmer Loading State */
                    <div className="grid lg:grid-cols-12 gap-8 h-[600px] animate-pulse">
                        <div className="lg:col-span-4 bg-stone-50 border border-stone-100 h-full"></div>
                        <div className="lg:col-span-8 bg-stone-100 h-full"></div>
                    </div>
                ) : error ? (
                    /* Error State */
                    <div className="flex flex-col items-center justify-center h-[350px] border border-dashed border-stone-200 p-8 text-center">
                        <MapPin className="w-12 h-12 text-stone-300 mb-4" />
                        <p className="text-stone-600 font-light">{error}</p>
                    </div>
                ) : locations.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center h-[350px] border border-dashed border-stone-200 p-8 text-center">
                        <MapPin className="w-12 h-12 text-stone-300 mb-4" />
                        <p className="text-stone-600 font-light">No hay locales registrados en el sistema.</p>
                    </div>
                ) : (
                    /* Interactive Grid Map UI */
                    <div className="grid lg:grid-cols-12 gap-8 h-auto lg:h-[600px]">
                        
                        {/* 1. Panel de Barra Lateral (Sucursales Index) */}
                        <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto h-[400px] lg:h-full pr-0 lg:pr-2 scrollbar-thin">
                            {locations.map((loc) => {
                                const isSelected = loc.id === selectedId;
                                return (
                                    <div
                                        key={loc.id}
                                        onClick={() => handleSelectLocation(loc)}
                                        className={`p-6 border transition-all duration-300 cursor-pointer rounded-none flex flex-col justify-between h-[180px] select-none ${
                                            isSelected
                                                ? "border-[#0b3a60] bg-[#0b3a60]/[0.02]"
                                                : "border-stone-200 bg-stone-50 hover:bg-stone-100/50 hover:border-stone-300"
                                        }`}
                                    >
                                        <div className="space-y-2">
                                            <div className="flex items-start justify-between gap-4">
                                                <h3 className="font-semibold text-stone-900 tracking-tight text-lg">
                                                    {loc.name}
                                                </h3>
                                                <MapPin className={`w-5 h-5 flex-shrink-0 ${
                                                    isSelected ? "text-[#0b3a60]" : "text-stone-400"
                                                }`} />
                                            </div>
                                            <p className="text-sm font-light text-stone-500 line-clamp-2">
                                                {loc.address}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-stone-200/50 pt-4">
                                            <span className="text-[10px] tracking-wider font-mono text-stone-400">
                                                {loc.latitude?.toFixed(5)}, {loc.longitude?.toFixed(5)}
                                            </span>
                                            <button
                                                className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors ${
                                                    isSelected
                                                        ? "text-[#0b3a60]"
                                                        : "text-stone-500 hover:text-stone-950"
                                                }`}
                                            >
                                                VER EN MAPA
                                                <Navigation className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* 2. Ventana de Renderizado de Basemap + marcadores */}
                        <div className="lg:col-span-8 relative h-[450px] lg:h-full border border-stone-200 overflow-hidden rounded-none shadow-sm">
                            
                            {/* Canvas del Mapa */}
                            <div ref={mapContainerRef} className="w-full h-full" />

                            {/* Leyenda de la Sucursal Seleccionada flotante inferior */}
                            {activeLocation && (
                                <div className="absolute bottom-6 left-6 right-6 lg:right-auto bg-white/95 backdrop-blur-md p-6 border border-stone-200 rounded-none shadow-2xl z-30 max-w-sm pointer-events-auto space-y-4">
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-bold tracking-[0.2em] text-[#0b3a60] uppercase block">
                                            SUCURSAL SELECCIONADA
                                        </span>
                                        <h4 className="font-semibold text-stone-900 text-lg">
                                            {activeLocation.name}
                                        </h4>
                                        <p className="text-xs font-light text-stone-500 leading-relaxed">
                                            {activeLocation.address}
                                        </p>
                                    </div>
                                    <div className="border-t border-stone-100 pt-3 flex flex-col gap-2 text-xs font-light text-stone-600">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5 text-[#0b3a60]" />
                                            <span>Lunes a Sábados: 09:00 a 20:00 hs</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-3.5 h-3.5 text-[#0b3a60]" />
                                            <span>+54 9 11 2345-6789</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Controles de vista de marca de agua minimalista (Esquina inferior derecha) */}
                            <div className="absolute bottom-3 right-3 bg-stone-900/10 text-[9px] font-mono text-stone-500 py-0.5 px-2 pointer-events-none rounded-none">
                                CARTO Positron / MapLibre GL
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </section>
    );
}
