"use client";

import { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, Search } from "lucide-react";
import Chip from "@/components/ui/chip";
import Input from "@/components/ui/input";

type ConfirmedShift = {
    id: string;
    name: string;
    lastName: string;
    maskedEmail: string;
    date: string;
    time: string;
    location: {
        name: string;
        address: string;
    };
};

export default function ConfirmedShiftsPage() {
    const [shifts, setShifts] = useState<ConfirmedShift[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchShifts = async () => {
            try {
                const res = await fetch("/api/public/confirmed-shifts", {
                    cache: "no-store",
                });
                if (res.ok) {
                    const data = await res.json();
                    setShifts(data);
                }
            } catch (error) {
                console.error("Error fetching confirmed shifts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchShifts();
    }, []);

    const filteredShifts = shifts.filter((shift) => {
        const searchLower = searchTerm.toLowerCase();
        const fullName = `${shift.name} ${shift.lastName}`.toLowerCase();
        const location = shift.location.name.toLowerCase();
        const address = shift.location.address.toLowerCase();

        return (
            fullName.includes(searchLower) ||
            location.includes(searchLower) ||
            address.includes(searchLower) ||
            shift.time.includes(searchLower)
        );
    });

    const groupedShifts = filteredShifts.reduce((acc, shift) => {
        const dateStr = shift.date.split("T")[0];
        if (!acc[dateStr]) {
            acc[dateStr] = [];
        }
        acc[dateStr].push(shift);
        return acc;
    }, {} as Record<string, ConfirmedShift[]>);

    const sortedDates = Object.keys(groupedShifts).sort();

    if (loading) {
        return (
            <div className="min-h-dvh bg-stone-50 py-16 px-6 sm:px-12">
                <div className="max-w-6xl mx-auto flex items-center gap-3 py-12">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#0b3a60] border-t-transparent" />
                    <p className="text-stone-700 text-sm font-medium">Cargando turnos confirmados...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-dvh bg-stone-50 py-16 px-6 sm:px-12">
            <div className="max-w-6xl mx-auto space-y-10">
                <header className="space-y-3">
                    <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-stone-950">
                        Turnos confirmados
                    </h1>
                    <p className="text-base sm:text-lg text-stone-600 max-w-2xl">
                        Consultá la agenda confirmada desde hoy en adelante.
                    </p>
                </header>

                <div className="max-w-xl space-y-2">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none" />
                        <Input
                            type="text"
                            placeholder="Buscar por nombre, sucursal u horario..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                            fullWidth
                        />
                    </div>
                    {searchTerm && (
                        <p className="text-xs text-stone-600 tabular-nums">
                            {filteredShifts.length} resultado{filteredShifts.length !== 1 ? "s" : ""} encontrado{filteredShifts.length !== 1 ? "s" : ""}
                        </p>
                    )}
                </div>

                {filteredShifts.length === 0 ? (
                    <div className="bg-white p-14 text-center space-y-3">
                        <Calendar className="w-10 h-10 text-stone-400 mx-auto" />
                        <p className="text-stone-700 text-sm font-medium">
                            {searchTerm
                                ? "No se encontraron turnos con ese criterio."
                                : "No hay turnos confirmados en este momento."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {sortedDates.map((dateStr) => {
                            const [year, month, day] = dateStr.split("-");
                            const date = new Date(
                                parseInt(year, 10),
                                parseInt(month, 10) - 1,
                                parseInt(day, 10)
                            );
                            const formattedDate = date.toLocaleDateString("es-AR", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            });

                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const shiftDate = new Date(date);
                            shiftDate.setHours(0, 0, 0, 0);
                            const isToday = shiftDate.getTime() === today.getTime();

                            return (
                                <section key={dateStr} className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-[#0b3a60] shrink-0" />
                                        <h2 className="text-xl sm:text-2xl font-semibold text-stone-900 capitalize">
                                            {formattedDate}
                                        </h2>
                                        {isToday && (
                                            <Chip
                                                label="Hoy"
                                                color="primary"
                                                variant="soft"
                                                size="small"
                                            />
                                        )}
                                    </div>

                                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                        {groupedShifts[dateStr].map((shift) => (
                                            <article
                                                key={shift.id}
                                                className="bg-white p-5 space-y-3"
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <h3 className="font-semibold text-stone-900 truncate">
                                                            {shift.name} {shift.lastName}
                                                        </h3>
                                                        <p className="text-xs text-stone-600 truncate">
                                                            {shift.maskedEmail}
                                                        </p>
                                                    </div>
                                                    <span className="inline-flex items-center gap-1 text-sm font-bold text-[#0b3a60] tabular-nums shrink-0">
                                                        <Clock className="w-4 h-4" />
                                                        {shift.time}
                                                    </span>
                                                </div>

                                                <div className="bg-stone-50 p-3 flex items-start gap-2 text-xs text-stone-700">
                                                    <MapPin className="w-4 h-4 text-[#0b3a60] shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="font-semibold text-stone-900">
                                                            {shift.location.name}
                                                        </p>
                                                        <p className="text-stone-600">
                                                            {shift.location.address}
                                                        </p>
                                                    </div>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
