"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, ArrowRight, Scissors } from "lucide-react";

type Service = {
    id: string;
    name: string;
    description: string | null;
    price: number;
    duration: number;
    active: boolean;
};

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch("/api/services", { cache: "no-store" });
                if (res.ok) {
                    const data = await res.json();
                    setServices(data.filter((service: Service) => service.active));
                }
            } catch (error) {
                console.error("Error fetching services:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    if (loading) {
        return (
            <div className="min-h-dvh bg-stone-50 py-16 px-6 sm:px-12">
                <div className="max-w-6xl mx-auto flex items-center gap-3 py-12">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#0b3a60] border-t-transparent" />
                    <p className="text-stone-700 text-sm font-medium">Cargando servicios...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-dvh bg-stone-50 py-16 px-6 sm:px-12">
            <div className="max-w-6xl mx-auto space-y-14">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-3">
                        <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-stone-950">
                            Servicios y tarifas
                        </h1>
                        <p className="text-base sm:text-lg text-stone-600 max-w-2xl">
                            Descubrí nuestra carta de cortes, afeitado clásico y styling profesional.
                        </p>
                    </div>
                    <Link
                        href="/shifts"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#0b3a60] text-white text-sm font-semibold hover:bg-[#082a46] transition-colors shrink-0 w-fit"
                    >
                        Reservar turno
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </header>

                {services.length === 0 ? (
                    <div className="bg-white p-14 text-center space-y-3">
                        <Scissors className="w-10 h-10 text-stone-400 mx-auto" />
                        <p className="text-stone-700 text-sm font-medium">
                            No hay servicios disponibles en este momento.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {services.map((service) => (
                            <article
                                key={service.id}
                                className="bg-white p-7 sm:p-8 flex flex-col justify-between gap-6"
                            >
                                <div className="flex items-start justify-between gap-6">
                                    <div className="space-y-2 min-w-0">
                                        <h2 className="text-xl font-semibold tracking-tight text-stone-900">
                                            {service.name}
                                        </h2>
                                        {service.description && (
                                            <p className="text-stone-600 text-sm leading-relaxed">
                                                {service.description}
                                            </p>
                                        )}
                                    </div>
                                    <span className="text-2xl font-bold text-[#0b3a60] tabular-nums shrink-0">
                                        ${service.price.toLocaleString("es-AR")}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-xs sm:text-sm text-stone-600">
                                    <span className="inline-flex items-center gap-1.5 tabular-nums">
                                        <Clock className="w-4 h-4 text-[#0b3a60]" />
                                        {service.duration} minutos
                                    </span>
                                    <Link
                                        href="/shifts"
                                        className="font-semibold text-[#0b3a60] hover:underline"
                                    >
                                        Reservar
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                <section className="bg-[#0b3a60] text-white p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-light tracking-tight">
                            ¿Listo para tu próximo corte?
                        </h2>
                        <p className="text-blue-100 text-sm sm:text-base">
                            Elegí sucursal, fecha y horario disponible en segundos.
                        </p>
                    </div>
                    <Link
                        href="/shifts"
                        className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-[#0b3a60] text-sm font-semibold hover:bg-stone-100 transition-colors shrink-0 w-fit"
                    >
                        Reservar turno
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </section>
            </div>
        </div>
    );
}
