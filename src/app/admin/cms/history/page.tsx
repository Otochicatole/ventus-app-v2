"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Package, MapPin, Calendar } from "lucide-react";
import Button from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Chip from "@/components/ui/chip";

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

export default function HistoryPage() {
    const router = useRouter();
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchShifts();
    }, []);

    const fetchShifts = async () => {
        try {
            const res = await fetch("/api/shifts", {
                cache: "no-store",
            });
            const data = await res.json();
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const pastShifts = data.filter((shift: Shift) => {
                const dateStr = shift.date.split("T")[0];
                const [year, month, day] = dateStr.split("-");
                const shiftDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                shiftDate.setHours(0, 0, 0, 0);
                return shiftDate < today;
            });
            
            setShifts(pastShifts);
        } catch (error) {
            console.error("Error fetching shifts:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredShifts = shifts.filter((shift) => {
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

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0b3a60] border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn pb-12">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-5">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">Historial de Turnos</h1>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                            {shifts.length} pasados
                        </span>
                    </div>
                    <p className="text-stone-500 text-sm mt-1">
                        Archivo de turnos anteriores a la fecha actual y registros completados
                    </p>
                </div>
                <Button size="small" variant="outlined" onClick={() => router.back()}>
                    ← Volver
                </Button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Buscar por cliente, email, teléfono o sede..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0b3a60]/20 focus:border-[#0b3a60] transition-all"
                    />
                </div>
                <p className="text-xs text-stone-500 font-medium shrink-0">
                    Mostrando {filteredShifts.length} de {shifts.length} turno(s) en histórico
                </p>
            </div>

            {filteredShifts.length === 0 ? (
                <div className="bg-white border border-stone-200 rounded-xl p-12 text-center">
                    <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3">
                        <Package className="w-6 h-6 text-stone-400" />
                    </div>
                    <h3 className="text-base font-semibold text-stone-900">Sin turnos en el historial</h3>
                    <p className="text-sm text-stone-500 mt-1 max-w-sm mx-auto">
                        {searchTerm ? "No se encontraron turnos con el criterio de búsqueda." : "No existen registros de turnos pasados."}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredShifts.map((shift) => {
                        const dateStr = shift.date.split("T")[0];
                        const [year, month, day] = dateStr.split("-");
                        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                        
                        return (
                            <div
                                key={shift.id}
                                className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 hover:border-stone-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                            >
                                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                                    <div className="w-10 h-10 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center font-bold text-sm shrink-0 border border-stone-200">
                                        {shift.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-base font-bold text-stone-900 truncate">
                                                {shift.name} {shift.lastName}
                                            </h3>
                                            <span
                                                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                                                    shift.confirmed
                                                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                                        : "bg-stone-100 text-stone-600 border border-stone-200"
                                                }`}
                                            >
                                                {shift.confirmed ? "Completado" : "No confirmado"}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500">
                                            <span>{shift.phone}</span>
                                            <span>•</span>
                                            <span className="truncate">{shift.email}</span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-stone-600">
                                            <div className="flex items-center gap-1.5 tabular-nums">
                                                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                                                <span>{date.toLocaleDateString("es-AR")}</span>
                                                <span className="font-semibold text-stone-900">{shift.time} hs</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                                                <span>{shift.location.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="shrink-0 flex sm:flex-col justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                                    <Button href={`/admin/cms/shifts/${shift.id}`} size="small" variant="outlined">
                                        Ver Detalles
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

