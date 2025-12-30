"use client";

import { useState, useEffect } from "react";
import { Package, DollarSign, Clock, Scissors } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

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
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await fetch("/api/services", {
                cache: "no-store",
            });
            const data = await res.json();
            const activeServices = data.filter((service: Service) => service.active);
            setServices(activeServices);
        } catch (error) {
            console.error("Error fetching services:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex items-center justify-center gap-3 py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                        <p className="text-gray-600">Cargando servicios...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-12 px-4">
            <div className="container mx-auto max-w-6xl">
                <motion.div 
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Servicios y Precios
                    </h1>
                    <p className="text-lg text-gray-600">
                        Descubrí todos nuestros servicios profesionales
                    </p>
                </motion.div>

                {services.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card>
                            <CardContent>
                                <div className="flex flex-col items-center gap-4 py-12 text-gray-500">
                                    <Package className="w-16 h-16 text-gray-300" />
                                    <p className="text-center">
                                        No hay servicios disponibles en este momento
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                whileHover={{ scale: 1.03, y: -5 }}
                            >
                                <Card className="hover:shadow-xl transition-shadow h-full">
                                    <CardContent className="p-8">
                                        <div className="flex flex-col items-center text-center">
                                            <motion.div 
                                                className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg"
                                                whileHover={{ rotate: 360 }}
                                                transition={{ duration: 0.6 }}
                                            >
                                                <Scissors className="w-8 h-8 text-white" />
                                            </motion.div>

                                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                                {service.name}
                                            </h3>

                                            {service.description && (
                                                <p className="text-gray-600 mb-6 min-h-[48px]">
                                                    {service.description}
                                                </p>
                                            )}

                                            <div className="w-full border-t border-gray-200 pt-6 space-y-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <DollarSign className="w-5 h-5 text-green-600" />
                                                    <span className="text-3xl font-bold text-gray-900">
                                                        ${service.price.toLocaleString('es-AR')}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-center gap-2 text-gray-600">
                                                    <Clock className="w-4 h-4 text-blue-600" />
                                                    <span className="text-sm font-medium">
                                                        {service.duration} minutos
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}

                <motion.div 
                    className="mt-16 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                        <CardContent className="p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                ¿Listo para tu próximo corte?
                            </h2>
                            <p className="text-gray-700 mb-6">
                                Reservá tu turno ahora y experimentá el mejor servicio
                            </p>
                            <motion.a
                                href="/shifts"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Package className="w-5 h-5" />
                                Reservar Turno
                            </motion.a>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}

