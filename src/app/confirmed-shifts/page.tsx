"use client";

import { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, Users, Search } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
        fetchShifts();
    }, []);

    const fetchShifts = async () => {
        try {
            const res = await fetch("/api/public/confirmed-shifts", {
                cache: "no-store",
            });
            const data = await res.json();
            setShifts(data);
        } catch (error) {
            console.error("Error fetching confirmed shifts:", error);
        } finally {
            setLoading(false);
        }
    };

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
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex items-center justify-center gap-3 py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                        <p className="text-gray-600">Cargando turnos confirmados...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-12 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Users className="w-10 h-10 text-blue-600" />
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                            Turnos Confirmados
                        </h1>
                    </div>
                    <p className="text-lg text-gray-600">
                        Consultá los turnos confirmados desde hoy en adelante
                    </p>
                </div>

                <div className="mb-8 max-w-2xl mx-auto">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Buscar por nombre, ubicación u hora..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 h-12 text-base"
                        />
                    </div>
                    {searchTerm && (
                        <p className="mt-3 text-sm text-gray-600 text-center">
                            {filteredShifts.length} resultado{filteredShifts.length !== 1 ? 's' : ''} encontrado{filteredShifts.length !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>

                {filteredShifts.length === 0 ? (
                    <Card>
                        <CardContent>
                            <div className="flex flex-col items-center gap-4 py-12 text-gray-500">
                                <Calendar className="w-16 h-16 text-gray-300" />
                                <p className="text-center">
                                    {searchTerm
                                        ? "No se encontraron turnos con ese criterio"
                                        : "No hay turnos confirmados en este momento"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-8">
                        {sortedDates.map((dateStr) => {
                            const [year, month, day] = dateStr.split("-");
                            const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
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
                                <div key={dateStr}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <Calendar className="w-6 h-6 text-blue-600" />
                                        <h2 className="text-2xl font-bold text-gray-900 capitalize">
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

                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {groupedShifts[dateStr].map((shift) => (
                                            <Card key={shift.id} className="hover:shadow-md transition-shadow">
                                                <CardContent className="p-6">
                                                    <div className="flex items-start gap-4">
                                                        <div className="shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <span className="text-xl font-bold text-blue-600">
                                                                {shift.name.charAt(0)}
                                                                {shift.lastName.charAt(0)}
                                                            </span>
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-semibold text-gray-900 mb-1">
                                                                {shift.name} {shift.lastName}
                                                            </h3>
                                                            <p className="text-sm text-gray-500 mb-3">
                                                                {shift.maskedEmail}
                                                            </p>

                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                    <Clock className="w-4 h-4 shrink-0" />
                                                                    <span className="font-medium">{shift.time}</span>
                                                                </div>

                                                                <div className="flex items-start gap-2 text-sm text-gray-600">
                                                                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                                                                    <div>
                                                                        <div className="font-medium">{shift.location.name}</div>
                                                                        <div className="text-xs text-gray-500">
                                                                            {shift.location.address}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

