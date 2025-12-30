"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">Historial de Turnos</h1>
                <p className="text-gray-600 text-lg">Turnos pasados y completados</p>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Turnos Anteriores</h2>
                        <p className="text-gray-600 text-sm mt-1">
                            {filteredShifts.length} de {shifts.length} registro(s)
                        </p>
                    </div>
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, email, teléfono..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {filteredShifts.length === 0 ? (
                    <Card>
                        <CardContent>
                            <div className="flex flex-col items-center gap-4 py-12 text-gray-500">
                                <Package className="w-16 h-16 text-gray-300" />
                                <p>{searchTerm ? "No se encontraron turnos con ese criterio" : "No hay turnos en el historial"}</p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {filteredShifts.map((shift) => {
                            const dateStr = shift.date.split("T")[0];
                            const [year, month, day] = dateStr.split("-");
                            const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                            
                            return (
                                <Card key={shift.id}>
                                    <CardContent>
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center gap-3 sm:gap-4">
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-400 rounded-lg flex items-center justify-center text-white font-bold text-base sm:text-lg shrink-0">
                                                    {shift.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-gray-900 font-semibold text-base sm:text-lg truncate">
                                                        {shift.name} {shift.lastName}
                                                    </h3>
                                                    <div className="flex flex-col text-xs sm:text-sm text-gray-600 mt-1 gap-0.5">
                                                        <span className="truncate">{shift.email}</span>
                                                        <span>{shift.phone}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0" />
                                                    <span className="text-gray-700 truncate">{shift.location.name}</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0" />
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-900 font-medium">{date.toLocaleDateString("es-AR")}</span>
                                                        <span className="text-gray-500">{shift.time}</span>
                                                    </div>
                                                </div>

                                                <Chip
                                                    label={shift.confirmed ? "Completado" : "No confirmado"}
                                                    color={shift.confirmed ? "success" : "default"}
                                                    variant="soft"
                                                    size="small"
                                                />
                                            </div>

                                            <div className="flex gap-2 pt-2 border-t border-gray-200">
                                                <Link href={`/admin/cms/shifts/${shift.id}`} className="flex-1">
                                                    <Button size="small" variant="outlined" color="default" fullWidth>
                                                        Ver Detalles
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

