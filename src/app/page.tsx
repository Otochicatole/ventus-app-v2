"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Scissors, Clock, ArrowRight } from "lucide-react";
import AnimatedSpheres from "@/components/AnimatedSpheres";
import CustomCursor from "@/components/CustomCursor";

type Service = {
    id: string;
    name: string;
    description: string | null;
    price: number;
    duration: number;
    active: boolean;
};

export default function Home() {
    const [showContent, setShowContent] = useState(false);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    const handleLoadComplete = useCallback(() => {
        setShowContent(true);
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch("/api/services", { cache: "no-store" });
                if (res.ok) {
                    const data = await res.json();
                    const activeServices = data.filter((s: Service) => s.active);
                    setServices(activeServices);
                }
            } catch (error) {
                console.error("Error fetching services:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    // Definición de curvas de transición cinematográficas de Apple
    const appleEase = [0.16, 1, 0.3, 1]; // Curva de desaceleración ultra-suave

    return (
        <div className="bg-stone-50 text-stone-900 font-sans min-h-screen selection:bg-[#0b3a60] selection:text-white">
            <AnimatedSpheres onLoadComplete={handleLoadComplete} />
            <CustomCursor />

            {/* Pantalla de carga animada de entrada con salida Blur-Scale Cinematográfica */}
            <motion.h1
                initial={{ opacity: 0, scale: 0.8, y: 50, filter: "blur(0px)" }}
                animate={
                    showContent
                        ? { opacity: 0, scale: 1.35, y: -60, filter: "blur(20px)" }
                        : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
                }
                transition={{ 
                    duration: 1.2, 
                    ease: [0.6, -0.05, 0.01, 0.99]
                }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[60px] sm:text-[80px] md:text-[120px] lg:text-[160px] xl:text-[200px] font-black uppercase tracking-tighter whitespace-nowrap text-stone-900 select-none pointer-events-none"
                style={{ zIndex: 0 }}
            >
                VENTUS
            </motion.h1>

            {/* Contenido Principal con Animación y Transiciones Cohesionadas */}
            <div className="relative" style={{ zIndex: 10 }}>
                
                {/* HERO SECTION */}
                <section className="min-h-screen flex items-center justify-start py-20 px-6 sm:px-12 md:px-24">
                    <div className="max-w-4xl space-y-8">
                        <div className="space-y-4">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 1.0, delay: 0.1, ease: appleEase }}
                                className="text-xs font-bold tracking-[0.3em] text-[#0b3a60] uppercase"
                            >
                                BARBERÍA PREMIUM / BUENOS AIRES
                            </motion.p>
                            <motion.h2
                                initial={{ opacity: 0, y: 30 }}
                                animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                transition={{ duration: 1.1, delay: 0.22, ease: appleEase }}
                                className="text-5xl sm:text-7xl md:text-8xl font-light tracking-tight leading-[1.05] text-stone-900"
                            >
                                Tu Estilo. <br />
                                <span className="font-semibold text-[#0b3a60]">Nuestra Precisión.</span>
                            </motion.h2>
                        </div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 1.1, delay: 0.35, ease: appleEase }}
                            className="text-lg md:text-xl font-light text-stone-600 max-w-2xl leading-relaxed"
                        >
                            Experimentá el arte del estilismo clásico con técnicas contemporáneas. Diseñado para quienes aprecian los detalles limpios, la simetría impecable y una atención verdaderamente personalizada.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 1.1, delay: 0.48, ease: appleEase }}
                            className="pt-6"
                        >
                            <a
                                href="#services-section"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-stone-900 text-white text-sm font-semibold uppercase tracking-widest hover:bg-[#0b3a60] transition-colors duration-300 rounded-none shadow-sm group"
                            >
                                Explorar Servicios
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </a>
                        </motion.div>
                    </div>
                </section>

                {/* SERVICES SECTION */}
                <section id="services-section" className="bg-white border-t border-stone-200 py-24 px-6 sm:px-12 md:px-24 scroll-mt-16">
                    <div className="max-w-7xl mx-auto space-y-16">
                        
                        {/* Cabecera de Sección */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-stone-200 pb-10 gap-6">
                            <div className="space-y-3">
                                <span className="text-xs font-bold tracking-[0.25em] text-[#0b3a60] uppercase">
                                    NUESTRO MENÚ
                                </span>
                                <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-stone-950">
                                    Servicios & <span className="font-semibold text-[#0b3a60]">Tarifas</span>
                                </h2>
                            </div>
                            <p className="text-stone-500 max-w-md font-light text-sm leading-relaxed">
                                Un abanico de tratamientos diseñados minuciosamente para cuidar tu aspecto, utilizando insumos de calidad superior en un ambiente privado y sofisticado.
                            </p>
                        </div>

                        {/* Listado de Servicios */}
                        {loading ? (
                            <div className="flex items-center justify-center gap-3 py-16">
                                <div className="animate-spin rounded-none h-6 w-6 border border-stone-900 border-t-transparent"></div>
                                <p className="text-stone-500 text-sm font-medium uppercase tracking-widest">
                                    Cargando catálogo...
                                </p>
                            </div>
                        ) : services.length === 0 ? (
                            <div className="py-20 text-center border border-dashed border-stone-300 rounded-none bg-stone-50/50">
                                <p className="text-stone-400 text-sm uppercase tracking-widest">
                                    No hay servicios disponibles en este momento.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-0 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-stone-200">
                                {services.map((service) => (
                                    <div
                                        key={service.id}
                                        className="border-r border-b border-stone-200 p-8 sm:p-10 flex flex-col justify-between hover:bg-stone-50/50 transition-colors duration-300 group"
                                    >
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-start gap-4">
                                                <h3 className="text-xl font-bold tracking-tight text-stone-900 group-hover:text-[#0b3a60] transition-colors">
                                                    {service.name}
                                                </h3>
                                                <div className="w-8 h-8 border border-stone-200 flex items-center justify-center shrink-0 group-hover:border-[#0b3a60] transition-colors">
                                                    <Scissors className="w-4 h-4 text-stone-400 group-hover:text-[#0b3a60] transition-colors" />
                                                </div>
                                            </div>

                                            {service.description && (
                                                <p className="text-stone-500 text-sm font-light leading-relaxed min-h-[60px]">
                                                    {service.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="pt-10 border-t border-stone-100 mt-6 flex justify-between items-end">
                                            <div className="flex items-center gap-1.5 text-stone-500">
                                                <Clock className="w-4 h-4 text-stone-400" />
                                                <span className="text-xs font-semibold tracking-wider uppercase">
                                                    {service.duration} MIN
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-2xl font-bold text-[#0b3a60] tracking-tight">
                                                    ${service.price.toLocaleString('es-AR')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="bg-stone-950 text-stone-400 border-t border-stone-900 py-16 px-6 sm:px-12 md:px-24">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#0b3a60] flex items-center justify-center">
                                <Scissors className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-stone-100 font-extrabold uppercase tracking-widest text-base">
                                VENTUS BARBERÍA
                            </span>
                        </div>
                        <div className="text-center md:text-right space-y-2">
                            <p className="text-xs font-semibold tracking-widest uppercase text-stone-500">
                                © {new Date().getFullYear()} Ventus. Todos los derechos reservados.
                            </p>
                            <p className="text-xs text-stone-600 font-light">
                                Diseñado con un enfoque minimalista, tonos azul premium y alta precisión.
                            </p>
                        </div>
                    </div>
                </footer>

            </div>
        </div>
    );
}
