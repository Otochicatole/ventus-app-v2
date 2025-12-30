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
                                <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-bold rounded-xl hover:bg-gray-100 transition-all">
                                    Ver Servicios
                                </button>
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

            <section id="servicios" className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-5xl font-black text-center mb-4 text-gray-900">
                        Nuestros Servicios
                    </h2>
                    <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                        Cada servicio es una experiencia única diseñada para resaltar tu estilo
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Corte Clásico",
                                description: "Técnicas tradicionales con un toque moderno",
                                price: "$8.000",
                            },
                            {
                                title: "Barba & Afeitado",
                                description: "Cuidado premium para tu barba",
                                price: "$6.000",
                            },
                            {
                                title: "Peinado & Styling",
                                description: "El acabado perfecto para tu look",
                                price: "$4.000",
                            },
                        ].map((service, index) => (
                            <div
                                key={index}
                                className="group h-full bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-8 transition-all hover:-translate-y-3 hover:border-blue-300 hover:shadow-xl"
                            >
                                <div className="flex justify-center mb-6">
                                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                                        <Scissors className="w-8 h-8 text-blue-600" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-center mb-3 text-gray-900">
                                    {service.title}
                                </h3>
                                <p className="text-center text-gray-600 mb-4">
                                    {service.description}
                                </p>
                                <p className="text-4xl font-black text-center text-blue-600">
                                    {service.price}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="nosotros" className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-5xl font-black text-center mb-4 text-gray-900">
                        ¿Por Qué Elegirnos?
                    </h2>
                    <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                        Más que un corte, una experiencia completa
                    </p>

                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <Star className="w-12 h-12" />,
                                title: "Barberos Profesionales",
                                description: "Equipo especializado con años de experiencia",
                            },
                            {
                                icon: <Clock className="w-12 h-12" />,
                                title: "Sistema de Turnos Online",
                                description: "Reservá cómodamente desde tu celular",
                            },
                            {
                                icon: <MapPin className="w-12 h-12" />,
                                title: "Múltiples Ubicaciones",
                                description: "Encontrá la sucursal más cercana",
                            },
                            {
                                icon: <CheckCircle2 className="w-12 h-12" />,
                                title: "Productos Premium",
                                description: "Usamos solo las mejores marcas",
                            },
                        ].map((feature, index) => (
                            <div key={index} className="text-center p-6">
                                <div className="flex justify-center mb-4">
                                    <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                                        {feature.icon}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-gray-900">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <h2 className="text-5xl font-black text-white">
                            ¿Listo para tu Nuevo Look?
                        </h2>
                        <p className="text-2xl text-blue-100 max-w-2xl mx-auto">
                            Reservá tu turno ahora y descubrí por qué somos la barbería preferida
                        </p>
                        <Link
                            href="/shifts"
                            className="inline-flex items-center gap-3 px-10 py-4 bg-white text-blue-600 text-xl font-bold rounded-xl hover:bg-gray-50 transition-all hover:-translate-y-1 shadow-xl"
                        >
                            <Calendar className="w-6 h-6" />
                            Reservar Turno Ahora
                        </Link>
                    </div>
                </div>
            </section>

            <footer className="py-12 bg-white border-t border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 mb-4">
                                VENTUS BARBERÍA
                            </h3>
                            <p className="text-gray-600">
                                Tu estilo, nuestra pasión. Llevamos años perfeccionando el arte
                                del barbering moderno.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-gray-900 mb-4">
                                Horarios
                            </h4>
                            <p className="text-gray-600 mb-2">Lunes a Viernes: 9:00 - 20:00</p>
                            <p className="text-gray-600 mb-2">Sábados: 9:00 - 18:00</p>
                            <p className="text-gray-600">Domingos: Cerrado</p>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-gray-900 mb-4">
                                Contacto
                            </h4>
                            <p className="text-gray-600 mb-2">📞 +54 11 1234-5678</p>
                            <p className="text-gray-600 mb-2">✉️ info@ventusbarberia.com</p>
                            <p className="text-gray-600">📍 Buenos Aires, Argentina</p>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-gray-200 text-center">
                        <p className="text-gray-500">
                            © {new Date().getFullYear()} Ventus Barbería. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
