"use client";

import Link from "next/link";
import { Calendar, Scissors } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedSpheres from "@/components/AnimatedSpheres";
import CustomCursor from "@/components/CustomCursor";

export default function Home() {
    const [showContent, setShowContent] = useState(false);
    const [hideTitle, setHideTitle] = useState(false);

    const handleLoadComplete = () => {
        setShowContent(true);
        setTimeout(() => {
            setHideTitle(true);
        }, 500);
    };

    return (
        <div className="bg-gray-50">
            <AnimatedSpheres onLoadComplete={handleLoadComplete} />
            <CustomCursor />

            <motion.h1
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: hideTitle ? 0 : 1, scale: hideTitle ? 1.2 : 1, y: 0 }}
                transition={{ 
                    duration: 0.8, 
                    ease: [0.6, -0.05, 0.01, 0.99],
                    opacity: { duration: hideTitle ? 0.5 : 0.8 }
                }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[60px] sm:text-[80px] md:text-[120px] lg:text-[160px] xl:text-[200px] font-black uppercase tracking-tighter whitespace-nowrap"
                style={{ zIndex: 0 }}
            >
                VENTUS
            </motion.h1>

            <section
                className={`relative min-h-screen flex items-center overflow-hidden ${
                    showContent ? "opacity-100" : "opacity-0"
                }`}
                style={{ zIndex: 10 }}
            >
                <div className="container mx-auto px-4 relative">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                    transition={{ duration: 0.6, delay: 0.2, ease: [0.6, -0.05, 0.01, 0.99] }}
                                    className="text-blue-600 text-base font-semibold tracking-wide uppercase mb-3"
                                >
                                    VENTUS BARBERÍA
                                </motion.p>
                                <motion.h2
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                    transition={{ duration: 0.7, delay: 0.4, ease: [0.6, -0.05, 0.01, 0.99] }}
                                    className="text-5xl md:text-7xl font-black leading-tight mb-4 bg-gradient-to-r from-blue-800 via-gray-800 to-black bg-clip-text text-transparent"
                                >
                                    Tu Estilo,
                                    <br />
                                    Nuestra Pasión
                                </motion.h2>
                            </div>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.6, delay: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
                                className="text-xl md:text-2xl font-semibold max-w-xl"
                            >
                                Experimentá el arte del barbering moderno. Cortes precisos,
                                estilo único y atención personalizada.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.6, delay: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
                                className="flex flex-col sm:flex-row gap-4 pt-4"
                            >
                                <Link
                                    href="/shifts"
                                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl hover:bg-blue-700 transition-all hover:-translate-y-1 shadow-lg hover:shadow-xl"
                                >
                                    <Calendar className="w-6 h-6" />
                                    Reservá tu Turno
                                </Link>
                                <Link
                                    href="/services"
                                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-xl hover:bg-black/10 border border-black/30 hover:backdrop-blur-3xl transition-all"
                                >
                                    Ver Servicios
                                </Link>
                            </motion.div>
                        </div>

                        <div className="flex items-center justify-center h-[300px] md:h-[500px]">
                        </div>
                    </div>
                </div>
            </section>

            <footer
                className={`py-8 bg-white border-t border-gray-200 relative transition-opacity duration-500 ${
                    showContent ? "opacity-100" : "opacity-0"
                }`}
                style={{ zIndex: 10 }}
            >
                <div className="container mx-auto px-4">
                    <div className="text-center space-y-4">
                        <div className="flex items-center justify-center gap-2">
                            <Scissors className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-bold text-gray-900">
                                VENTUS BARBERÍA
                            </h3>
                        </div>
                        <p className="text-gray-600 text-sm max-w-md mx-auto">
                            Tu estilo, nuestra pasión
                        </p>
                        <div className="pt-4 border-t border-gray-200 max-w-md mx-auto">
                            <p className="text-gray-500 text-sm">
                                © {new Date().getFullYear()} Ventus Barbería. Todos los derechos reservados.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
