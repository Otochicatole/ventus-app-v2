"use client";

import Link from "next/link";

export default function Home() {
    return (
        <div>
            <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_50%,rgba(255,215,0,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,165,0,0.1)_0%,transparent_50%)]" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div>
                                <p className="text-[#FFD700] text-base font-semibold tracking-widest uppercase mb-3">
                                    VENTUS BARBERÍA
                                </p>
                                <h1 className="text-5xl md:text-7xl font-black leading-tight mb-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                                    Tu Estilo,
                                    <br />
                                    Nuestra Pasión
                                </h1>
                            </div>

                            <p className="text-neutral-300 text-xl md:text-2xl font-light max-w-xl">
                                Experimentá el arte del barbering moderno. Cortes precisos,
                                estilo único y atención personalizada.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link
                                    href="/shifts"
                                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black text-lg font-bold rounded-lg hover:from-[#FFA500] hover:to-[#FF8C00] transition-all hover:-translate-y-1 shadow-lg"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                                    </svg>
                                    Reservá tu Turno
                                </Link>
                                <button className="px-8 py-4 border-2 border-[#FFD700] text-[#FFD700] text-lg font-bold rounded-lg hover:bg-[rgba(255,215,0,0.1)] transition-all">
                                    Ver Servicios
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-center h-[300px] md:h-[500px]">
                            <svg className="w-48 h-48 md:w-80 md:h-80 text-[#FFD700] opacity-20 animate-[float_3s_ease-in-out_infinite]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            <section id="servicios" className="py-20 bg-[#0a0a0a]">
                <div className="container mx-auto px-4">
                    <h2 className="text-5xl font-black text-center mb-4 text-[#FFD700]">
                        Nuestros Servicios
                    </h2>
                    <p className="text-center text-neutral-500 mb-12 max-w-2xl mx-auto">
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
                                className="group h-full bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-neutral-800 rounded-lg p-8 transition-all hover:-translate-y-3 hover:border-[#FFD700] hover:shadow-[0_20px_40px_rgba(255,215,0,0.2)]"
                            >
                                <div className="flex justify-center mb-6">
                                    <svg className="w-16 h-16 text-[#FFD700]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-center mb-3 text-white">
                                    {service.title}
                                </h3>
                                <p className="text-center text-neutral-500 mb-4">
                                    {service.description}
                                </p>
                                <p className="text-4xl font-black text-center text-[#FFD700]">
                                    {service.price}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="nosotros" className="py-20 bg-black">
                <div className="container mx-auto px-4">
                    <h2 className="text-5xl font-black text-center mb-4 text-[#FFD700]">
                        ¿Por Qué Elegirnos?
                    </h2>
                    <p className="text-center text-neutral-500 mb-12 max-w-2xl mx-auto">
                        Más que un corte, una experiencia completa
                    </p>

                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            {
                                icon: (
                                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                ),
                                title: "Barberos Profesionales",
                                description: "Equipo especializado con años de experiencia",
                            },
                            {
                                icon: (
                                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                    </svg>
                                ),
                                title: "Sistema de Turnos Online",
                                description: "Reservá cómodamente desde tu celular",
                            },
                            {
                                icon: (
                                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                    </svg>
                                ),
                                title: "Múltiples Ubicaciones",
                                description: "Encontrá la sucursal más cercana",
                            },
                            {
                                icon: (
                                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                    </svg>
                                ),
                                title: "Productos Premium",
                                description: "Usamos solo las mejores marcas",
                            },
                        ].map((feature, index) => (
                            <div key={index} className="text-center p-6">
                                <div className="flex justify-center text-[#FFD700] mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-white">
                                    {feature.title}
                                </h3>
                                <p className="text-neutral-500">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-gradient-to-r from-[#FFD700] to-[#FFA500]">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <h2 className="text-5xl font-black text-black">
                            ¿Listo para tu Nuevo Look?
                        </h2>
                        <p className="text-2xl text-[#1a1a1a] max-w-2xl mx-auto">
                            Reservá tu turno ahora y descubrí por qué somos la barbería preferida
                        </p>
                        <Link
                            href="/shifts"
                            className="inline-flex items-center gap-3 px-10 py-4 bg-black text-[#FFD700] text-xl font-bold rounded-lg hover:bg-[#1a1a1a] transition-all hover:-translate-y-1 shadow-xl"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                            </svg>
                            Reservar Turno Ahora
                        </Link>
                    </div>
                </div>
            </section>

            <footer className="py-12 bg-[#0a0a0a] border-t border-neutral-800">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-xl font-black text-[#FFD700] mb-4">
                                VENTUS BARBERÍA
                            </h3>
                            <p className="text-neutral-500">
                                Tu estilo, nuestra pasión. Llevamos años perfeccionando el arte
                                del barbering moderno.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-white mb-4">
                                Horarios
                            </h4>
                            <p className="text-neutral-500 mb-2">Lunes a Viernes: 9:00 - 20:00</p>
                            <p className="text-neutral-500 mb-2">Sábados: 9:00 - 18:00</p>
                            <p className="text-neutral-500">Domingos: Cerrado</p>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-white mb-4">
                                Contacto
                            </h4>
                            <p className="text-neutral-500 mb-2">📞 +54 11 1234-5678</p>
                            <p className="text-neutral-500 mb-2">✉️ info@ventusbarberia.com</p>
                            <p className="text-neutral-500">📍 Buenos Aires, Argentina</p>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-neutral-800 text-center">
                        <p className="text-neutral-600">
                            © {new Date().getFullYear()} Ventus Barbería. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
