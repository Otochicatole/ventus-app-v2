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

        try {
            const res = await fetch(`/api/admin/shifts/${shift.id}/confirm`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ confirmed: !shift.confirmed }),
            });

            if (res.ok) {
                const updated = await res.json();
                setShift(updated);
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
                <p className="text-neutral-500">Turno no encontrado</p>
            </div>
        );
    }

    const dateStr = shift.date.split("T")[0];
    const [year, month, day] = dateStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold text-white">Detalle del Turno</h1>
                <Button onClick={() => router.back()}>← Volver</Button>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">
                                Información del Paciente
                            </h2>
                            <Chip
                                label={shift.confirmed ? "Confirmado" : "Pendiente"}
                                color={shift.confirmed ? "success" : "warning"}
                            />
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-neutral-400 mb-1">Nombre Completo</p>
                                <p className="text-lg font-semibold text-white">
                                    {shift.name} {shift.lastName}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-neutral-400 mb-1">Email</p>
                                <p className="text-lg font-semibold text-white">{shift.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-neutral-400 mb-1">Teléfono</p>
                                <p className="text-lg font-semibold text-white">{shift.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-neutral-400 mb-1">Fecha de Registro</p>
                                <p className="text-lg font-semibold text-white">
                                    {new Date(shift.createdAt).toLocaleString("es-AR")}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-xl font-bold text-white mb-6">
                            Información del Turno
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <p className="text-sm text-neutral-400 mb-1">Ubicación</p>
                                <p className="text-lg font-semibold text-white">{shift.location.name}</p>
                                <p className="text-sm text-neutral-500">{shift.location.address}</p>
                            </div>
                            <div>
                                <p className="text-sm text-neutral-400 mb-1">Fecha y Hora</p>
                                <p className="text-lg font-semibold text-white capitalize">
                                    {date.toLocaleDateString("es-AR", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                                <p className="text-sm text-neutral-500">{shift.time}</p>
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
                        <h2 className="text-xl font-bold text-white mb-4">
                            Notas del Admin
                        </h2>
                        <form onSubmit={handleSaveNotes}>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={4}
                                placeholder="Agregar notas sobre el turno..."
                                className="w-full px-4 py-2.5 mb-4 bg-neutral-900 border border-neutral-700 rounded-md text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
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
