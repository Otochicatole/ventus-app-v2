"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, Clock, MapPin, User, Mail, Phone, MessageSquare, CheckCircle2, Clock3 } from "lucide-react";
import Button from "@/components/ui/button";

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
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0b3a60] border-t-transparent"></div>
            </div>
        );
    }

    if (!shift) {
        return (
            <div className="text-center py-16">
                <p className="text-stone-500 text-sm">Turno no encontrado</p>
                <Button size="small" variant="outlined" onClick={() => router.back()} className="mt-4">
                    ← Volver a turnos
                </Button>
            </div>
        );
    }

    const dateStr = shift.date.split("T")[0];
    const [year, month, day] = dateStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const cleanPhone = shift.phone.replace(/\D/g, "");

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-12">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-5">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">Detalle de Turno</h1>
                        <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                shift.confirmed
                                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                    : "bg-amber-50 text-amber-800 border border-amber-200"
                            }`}
                        >
                            {shift.confirmed ? (
                                <>
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    Confirmado
                                </>
                            ) : (
                                <>
                                    <Clock3 className="w-3 h-3 text-amber-600" />
                                    Pendiente
                                </>
                            )}
                        </span>
                    </div>
                    <p className="text-stone-500 text-sm mt-1">
                        Turno agendado por {shift.name} {shift.lastName}
                    </p>
                </div>
                <Button variant="outlined" size="small" onClick={() => router.back()}>
                    ← Volver
                </Button>
            </div>

            {/* Shift & Time Details */}
            <div className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <h2 className="text-base font-bold text-stone-900">Datos de la Reserva</h2>
                    <span className="text-xs text-stone-400 tabular-nums">
                        Registrado el {new Date(shift.createdAt).toLocaleDateString("es-AR")}
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg space-y-1">
                        <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold uppercase tracking-wider">
                            <Calendar className="w-3.5 h-3.5 text-stone-400" />
                            Fecha y Hora
                        </div>
                        <p className="text-base font-bold text-stone-900 capitalize">
                            {date.toLocaleDateString("es-AR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                        </p>
                        <p className="text-sm font-semibold text-[#0b3a60] flex items-center gap-1.5 pt-0.5 tabular-nums">
                            <Clock className="w-4 h-4" />
                            {shift.time} hs
                        </p>
                    </div>

                    <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg space-y-1">
                        <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold uppercase tracking-wider">
                            <MapPin className="w-3.5 h-3.5 text-stone-400" />
                            Sede y Dirección
                        </div>
                        <p className="text-base font-bold text-stone-900">
                            {shift.location.name}
                        </p>
                        <p className="text-xs text-stone-500">
                            {shift.location.address}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Button
                        variant={shift.confirmed ? "outlined" : "contained"}
                        onClick={toggleConfirmed}
                    >
                        {shift.confirmed ? "Marcar como Pendiente" : "Confirmar Turno y Notificar"}
                    </Button>

                    {cleanPhone && (
                        <a
                            href={`https://wa.me/${cleanPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
                        >
                            <MessageSquare className="w-4 h-4" />
                            <span>Abrir WhatsApp</span>
                        </a>
                    )}
                </div>
            </div>

            {/* Client Information */}
            <div className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
                <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
                    Información del Cliente
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <span className="text-xs text-stone-500 flex items-center gap-1.5 font-medium">
                            <User className="w-3.5 h-3.5 text-stone-400" />
                            Nombre
                        </span>
                        <p className="text-sm font-semibold text-stone-900">
                            {shift.name} {shift.lastName}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <span className="text-xs text-stone-500 flex items-center gap-1.5 font-medium">
                            <Phone className="w-3.5 h-3.5 text-stone-400" />
                            Teléfono
                        </span>
                        <p className="text-sm font-semibold text-stone-900 tabular-nums">
                            {shift.phone}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <span className="text-xs text-stone-500 flex items-center gap-1.5 font-medium">
                            <Mail className="w-3.5 h-3.5 text-stone-400" />
                            Email
                        </span>
                        <p className="text-sm font-semibold text-stone-900 truncate">
                            {shift.email}
                        </p>
                    </div>
                </div>
            </div>

            {/* Internal Admin Notes */}
            <div className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
                <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
                    Notas Internas
                </h2>

                <form onSubmit={handleSaveNotes} className="space-y-3">
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        placeholder="Escribir notas de seguimiento para este cliente o turno..."
                        className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0b3a60]/20 focus:border-[#0b3a60] transition-all resize-none"
                    />
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            size="small"
                            loading={savingNotes}
                            disabled={savingNotes}
                        >
                            {savingNotes ? "Guardando..." : "Guardar Notas"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
