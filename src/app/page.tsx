"use client";

import Link from "next/link";
import { Calendar, Scissors, Star, Clock, MapPin, CheckCircle2 } from "lucide-react";

export default function Home() {
    return (
        <div className="bg-gray-50">
            <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-blue-50">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.05)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(147,197,253,0.05)_0%,transparent_50%)]" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div>
                                <p className="text-blue-600 text-base font-semibold tracking-wide uppercase mb-3">
                                    VENTUS BARBERÍA
                                </p>
                                <h1 className="text-5xl md:text-7xl font-black leading-tight mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-blue-900 bg-clip-text text-transparent">
                                    Tu Estilo,
                                    <br />
                                    Nuestra Pasión
                                </h1>
                            </div>

                            <p className="text-gray-600 text-xl md:text-2xl font-light max-w-xl">
                                Experimentá el arte del barbering moderno. Cortes precisos,
                                estilo único y atención personalizada.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link
                                    href="/shifts"
                                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl hover:bg-blue-700 transition-all hover:-translate-y-1 shadow-lg hover:shadow-xl"
                                >
                                    <Calendar className="w-6 h-6" />
                                    Reservá tu Turno
                                </Link>
                                <Link
                                    href="/services"
                                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-bold rounded-xl hover:bg-gray-100 transition-all"
                                >
                                    Ver Servicios
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center justify-center h-[300px] md:h-[500px]">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
                                <Scissors className="relative w-48 h-48 md:w-80 md:h-80 text-blue-600 opacity-20 animate-[float_3s_ease-in-out_infinite]" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-8 bg-white border-t border-gray-200">
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
