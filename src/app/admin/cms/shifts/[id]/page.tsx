"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Chip from "@/components/ui/chip";
import { Card, CardContent } from "@/components/ui/card";

type Shift = {
    id: string;
    name: string;
    lastName: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    confirmed: boolean;
    notes: string | null;
    location: {
        id: string;
        name: string;
        address: string;
    };
    createdAt: string;
};

export default function ShiftDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [shift, setShift] = useState<Shift | null>(null);
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState("");
    const [savingNotes, setSavingNotes] = useState(false);

    useEffect(() => {
        fetchShift();
    }, []);

    const fetchShift = async () => {
        try {
            const res = await fetch(`/api/shifts/${params.id}`, {
                cache: "no-store",
            });
            const data = await res.json();
            setShift(data);
            setNotes(data.notes || "");
        } catch (error) {
            console.error("Error fetching shift:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleConfirmed = async () => {
        if (!shift) return;
        
        const wasConfirmed = shift.confirmed;

        try {
            const res = await fetch(`/api/admin/shifts/${shift.id}/confirm`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ confirmed: !shift.confirmed }),
            });

            if (res.ok) {
                const updated = await res.json();
                setShift(updated);
                
                if (!wasConfirmed && updated.confirmed) {
                    const dateStr = updated.date.split("T")[0];
                    const [year, month, day] = dateStr.split("-");
                    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                    const formattedDate = date.toLocaleDateString("es-AR");
                    
                    const phone = updated.phone.replace(/\D/g, '');
                    const message = `Hola ${updated.name}!

Tu turno ha sido *confirmado con exito*

*Fecha:* ${formattedDate}
*Hora:* ${updated.time}
*Ubicacion:* ${updated.location.name}

Te esperamos!

_Ventus Barberia_`;
                    
                    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                }
            }
        } catch (error) {
            console.error("Error toggling confirmed:", error);
        }
    };

    const handleSaveNotes = async (e: FormEvent) => {
        e.preventDefault();
        if (!shift) return;

        setSavingNotes(true);
        try {
            const res = await fetch(`/api/admin/shifts/${shift.id}/notes`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notes }),
            });

            if (res.ok) {
                const updated = await res.json();
                setShift(updated);
            }
        } catch (error) {
            console.error("Error saving notes:", error);
        } finally {
            setSavingNotes(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!shift) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Turno no encontrado</p>
            </div>
        );
    }

    const dateStr = shift.date.split("T")[0];
    const [year, month, day] = dateStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold text-gray-900">Detalles</h1>
                <Button onClick={() => router.back()}>← Volver</Button>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">
                            Información del Cliente
                        </h2>
                        <div className="flex gap-6 items-start mb-6">
                            <p className="text-gray-700">Estado del turno:</p>
                            <Chip
                                label={shift.confirmed ? "Confirmado" : "Pendiente"}
                                color={shift.confirmed ? "success" : "warning"}
                                variant="soft"
                                size="small"
                            />
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Nombre Completo</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {shift.name} {shift.lastName}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Email</p>
                                <p className="text-lg font-semibold text-gray-900">{shift.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Teléfono</p>
                                <p className="text-lg font-semibold text-gray-900">{shift.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Fecha de Registro</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {new Date(shift.createdAt).toLocaleString("es-AR")}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">
                            Información del Turno
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Ubicación</p>
                                <p className="text-lg font-semibold text-gray-900">{shift.location.name}</p>
                                <p className="text-sm text-gray-500">{shift.location.address}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Fecha y Hora</p>
                                <p className="text-lg font-semibold text-gray-900 capitalize">
                                    {date.toLocaleDateString("es-AR", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                                <p className="text-sm text-gray-500">{shift.time}</p>
                            </div>
                        </div>
                        <Button variant="contained" onClick={toggleConfirmed}>
                            {shift.confirmed
                                ? "Marcar como Pendiente"
                                : "Marcar como Confirmado"}
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Notas del Admin
                        </h2>
                        <form onSubmit={handleSaveNotes}>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={4}
                                placeholder="Agregar notas sobre el turno..."
                                className="w-full px-4 py-2.5 mb-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                loading={savingNotes}
                                disabled={savingNotes}
                            >
                                {savingNotes ? "Guardando..." : "Guardar Notas"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
