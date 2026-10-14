"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Search, Plus, MapPin, Calendar, X, History, CheckCircle2, Clock, Phone, Mail, Trash2, Eye } from "lucide-react";
import Button from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Chip from "@/components/ui/chip";
import ConfirmDialog from "@/components/ui/confirm-dialog";

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
    };
};

function getTodayDateStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function ShiftsPage() {
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [confirmingId, setConfirmingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "pending">("all");
    const [dateFilter, setDateFilter] = useState<string>("");

    useEffect(() => {
        fetchShifts();
    }, []);

    useEffect(() => {
        const handleFocus = () => {
            fetchShifts();
        };

        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, []);

    const fetchShifts = async () => {
        try {
            const res = await fetch("/api/shifts", {
                cache: "no-store",
            });
            const data = await res.json();
            setShifts(data);
        } catch (error) {
            console.error("Error fetching shifts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        setDeleting(true);
        try {
            const shiftToDelete = shifts.find(s => s.id === deleteId);
            const res = await fetch(`/api/shifts/${deleteId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                if (shiftToDelete) {
                    const dateStr = shiftToDelete.date.split("T")[0];
                    const [year, month, day] = dateStr.split("-");
                    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                    const formattedDate = date.toLocaleDateString("es-AR");
                    const phone = shiftToDelete.phone.replace(/\D/g, '');
                    const message = `Hola ${shiftToDelete.name}!

Lamentamos informarte que tu turno ha sido *cancelado*.

*Fecha:* ${formattedDate}
*Hora:* ${shiftToDelete.time}
*Ubicacion:* ${shiftToDelete.location.name}

Disculpa las molestias. Podes reservar un nuevo turno cuando gustes.

_Ventus Barberia_`;
                    
                    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                }
                
                setShifts(shifts.filter((shift) => shift.id !== deleteId));
                setDeleteId(null);
            }
        } catch (error) {
            console.error("Error deleting shift:", error);
        } finally {
            setDeleting(false);
        }
    };

    const toggleConfirmed = async (shiftId: string, currentStatus: boolean) => {
        setConfirmingId(shiftId);
        try {
            const res = await fetch(`/api/admin/shifts/${shiftId}/confirm`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ confirmed: !currentStatus }),
            });

            if (res.ok) {
                const updatedShift = shifts.find(s => s.id === shiftId);
                
                setShifts(
                    shifts.map((shift) =>
                        shift.id === shiftId
                            ? { ...shift, confirmed: !currentStatus }
                            : shift
                    )
                );

                if (!currentStatus && updatedShift) {
                    const dateStr = updatedShift.date.split("T")[0];
                    const [year, month, day] = dateStr.split("-");
                    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                    const formattedDate = date.toLocaleDateString("es-AR");
                    
                    const phone = updatedShift.phone.replace(/\D/g, '');
                    const message = `Hola ${updatedShift.name}!

Tu turno ha sido *confirmado con exito*

*Fecha:* ${formattedDate}
*Hora:* ${updatedShift.time}
*Ubicacion:* ${updatedShift.location.name}

Te esperamos!

_Ventus Barberia_`;
                    
                    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                }
            }
        } catch (error) {
            console.error("Error toggling confirmed:", error);
        } finally {
            setConfirmingId(null);
        }
    };

    const filteredShifts = useMemo(() => {
        return shifts.filter((shift) => {
            if (statusFilter === "confirmed" && !shift.confirmed) return false;
            if (statusFilter === "pending" && shift.confirmed) return false;
            
            if (dateFilter) {
                const shiftDateStr = shift.date.split("T")[0];
                if (dateFilter !== shiftDateStr) return false;
            }
            
            if (!searchTerm) return true;
            
            const search = searchTerm.toLowerCase();
            const fullName = `${shift.name} ${shift.lastName}`.toLowerCase();
            const email = shift.email.toLowerCase();
            const phone = shift.phone.toLowerCase();
            const location = shift.location.name.toLowerCase();
            const dateStr = shift.date.split("T")[0];
            const [year, month, day] = dateStr.split("-");
            const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            const formattedDate = date.toLocaleDateString("es-AR").toLowerCase();
            
            return (
                fullName.includes(search) ||
                email.includes(search) ||
                phone.includes(search) ||
                location.includes(search) ||
                formattedDate.includes(search) ||
                shift.time.includes(search)
            );
        });
    }, [shifts, statusFilter, dateFilter, searchTerm]);

    const hasActiveFilters = statusFilter !== "all" || dateFilter !== "";

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0b3a60] border-t-transparent"></div>
                <p className="text-xs uppercase tracking-widest text-stone-500 font-semibold">Cargando agenda de turnos...</p>
            </div>
        );
    }

    const todayStr = getTodayDateStr();

    return (
        <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">Turnos</h1>
                    <p className="text-stone-500 text-xs sm:text-sm mt-0.5">Gestión de reservas, confirmaciones y avisos por WhatsApp</p>
                </div>
                <div className="flex items-center gap-2.5">
                    <Button
                        href="/admin/cms/history"
                        size="small"
                        variant="outlined"
                        startIcon={<History className="w-3.5 h-3.5" />}
                    >
                        Historial
                    </Button>
                    <Button
                        href="/admin/cms/shifts/new"
                        size="small"
                        startIcon={<Plus className="w-3.5 h-3.5" />}
                    >
                        Nuevo Turno
                    </Button>
                </div>
            </div>

            {/* Filter controls */}
            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Buscar por cliente, teléfono, hora o sucursal..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0b3a60] focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Status segmented control */}
                    <div className="inline-flex p-1 bg-stone-100 rounded-lg border border-stone-200 gap-1 self-start sm:self-auto">
                        <button
                            type="button"
                            onClick={() => setStatusFilter("all")}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                                statusFilter === "all"
                                    ? "bg-[#0b3a60] text-white shadow-xs"
                                    : "text-stone-600 hover:text-stone-900 hover:bg-white/60"
                            }`}
                        >
                            Todos ({shifts.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatusFilter("confirmed")}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                                statusFilter === "confirmed"
                                    ? "bg-emerald-700 text-white shadow-xs"
                                    : "text-stone-600 hover:text-stone-900 hover:bg-white/60"
                            }`}
                        >
                            Confirmados
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatusFilter("pending")}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                                statusFilter === "pending"
                                    ? "bg-amber-700 text-white shadow-xs"
                                    : "text-stone-600 hover:text-stone-900 hover:bg-white/60"
                            }`}
                        >
                            Pendientes
                        </button>
                    </div>
                </div>

                {/* Date quick filter bar */}
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mr-1">Fecha:</span>
                    <button
                        type="button"
                        onClick={() => setDateFilter(todayStr)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            dateFilter === todayStr
                                ? "bg-[#0b3a60] text-white border-[#0b3a60]"
                                : "bg-white text-stone-700 border-stone-300 hover:bg-stone-50"
                        }`}
                    >
                        Hoy
                    </button>
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0b3a60]"
                    />
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={() => {
                                setStatusFilter("all");
                                setDateFilter("");
                                setSearchTerm("");
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
                        >
                            <X className="w-3.5 h-3.5" />
                            Limpiar filtros
                        </button>
                    )}
                    <span className="ml-auto text-xs text-stone-500 font-medium tabular-nums">
                        {filteredShifts.length} {filteredShifts.length === 1 ? "turno" : "turnos"}
                    </span>
                </div>
            </div>

            {/* Shift cards list */}
            {filteredShifts.length === 0 ? (
                <Card>
                    <CardContent>
                        <div className="flex flex-col items-center gap-3 py-16 text-stone-400">
                            <Calendar className="w-12 h-12 text-stone-300" />
                            <p className="text-xs uppercase tracking-wider font-semibold">
                                {searchTerm || hasActiveFilters
                                    ? "No se encontraron turnos con ese criterio"
                                    : "No hay turnos registrados en la agenda"}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredShifts.map((shift) => {
                        const dateStr = shift.date.split("T")[0];
                        const [year, month, day] = dateStr.split("-");
                        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                        const isToday = dateStr === todayStr;

                        return (
                            <div
                                key={shift.id}
                                className="bg-white border border-stone-200 rounded-xl p-4.5 flex flex-col justify-between transition-all hover:border-[#0b3a60] hover:shadow-xs space-y-4"
                            >
                                <div className="space-y-3">
                                    {/* Client info & status */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 bg-[#0b3a60] rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">
                                                {shift.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-sm font-bold text-stone-900 truncate">
                                                    {shift.name} {shift.lastName}
                                                </h3>
                                                <div className="flex items-center gap-1.5 text-xs text-stone-500 truncate tabular-nums">
                                                    <Phone className="w-3 h-3 text-stone-400 shrink-0" />
                                                    <span className="truncate">{shift.phone}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span
                                            className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                                                shift.confirmed
                                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                            }`}
                                        >
                                            {shift.confirmed ? (
                                                <>
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    Confirmado
                                                </>
                                            ) : (
                                                <>
                                                    <Clock className="w-3 h-3" />
                                                    Pendiente
                                                </>
                                            )}
                                        </span>
                                    </div>

                                    {/* Schedule & Location */}
                                    <div className="p-2.5 bg-stone-50/80 rounded-lg space-y-1.5 text-xs text-stone-600">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 font-medium text-stone-800 tabular-nums">
                                                <Calendar className="w-3.5 h-3.5 text-[#0b3a60]" />
                                                <span>{date.toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" })}</span>
                                                <span className="font-bold text-stone-900">• {shift.time}</span>
                                            </div>
                                            {isToday && (
                                                <span className="text-[9px] bg-[#0b3a60] text-white font-bold px-1.5 py-0.5 rounded">
                                                    HOY
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-stone-500">
                                            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                                            <span className="truncate">{shift.location.name}</span>
                                        </div>
                                    </div>

                                    {shift.notes && (
                                        <p className="text-xs text-stone-500 italic line-clamp-2 bg-stone-50 p-2 rounded">
                                            &ldquo;{shift.notes}&rdquo;
                                        </p>
                                    )}
                                </div>

                                {/* Action buttons */}
                                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                                    <button
                                        type="button"
                                        onClick={() => toggleConfirmed(shift.id, shift.confirmed)}
                                        disabled={confirmingId === shift.id}
                                        className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border text-center ${
                                            shift.confirmed
                                                ? "border-stone-300 text-stone-600 hover:bg-stone-100"
                                                : "border-emerald-600 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                                        }`}
                                    >
                                        {shift.confirmed ? "Desconfirmar" : "Confirmar (WhatsApp)"}
                                    </button>

                                    <Link
                                        href={`/admin/cms/shifts/${shift.id}`}
                                        className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
                                        title="Ver detalle"
                                        aria-label="Ver detalle"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() => setDeleteId(shift.id)}
                                        className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                        title="Cancelar y notificar"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <ConfirmDialog
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Eliminar y Cancelar Turno"
                message="¿Estás seguro de cancelar este turno? Se abrirá WhatsApp para avisar al cliente sobre la cancelación."
                confirmText="Cancelar Turno"
                loading={deleting}
            />
        </div>
    );
}
