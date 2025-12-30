"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import Button from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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

export default function ShiftsPage() {
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [confirmingId, setConfirmingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

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
            const res = await fetch(`/api/shifts/${deleteId}`, {
                method: "DELETE",
            });

            if (res.ok) {
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
                setShifts(
                    shifts.map((shift) =>
                        shift.id === shiftId
                            ? { ...shift, confirmed: !currentStatus }
                            : shift
                    )
                );
            }
        } catch (error) {
            console.error("Error toggling confirmed:", error);
        } finally {
            setConfirmingId(null);
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
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex justify-between items-start flex-wrap gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-3">Turnos</h1>
                    <p className="text-neutral-400 text-lg">Gestión de reservas y confirmaciones</p>
                </div>
                <Link href="/admin/cms/shifts/new">
                    <Button size="large" startIcon={
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                    }>
                        Nuevo Turno
                    </Button>
                </Link>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Todos los Turnos</h2>
                        <p className="text-neutral-400 text-sm mt-1">
                            {filteredShifts.length} de {shifts.length} registro(s)
                        </p>
                    </div>
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, email, teléfono..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {filteredShifts.length === 0 ? (
                    <Card>
                        <CardContent>
                            <div className="flex flex-col items-center gap-4 py-12 text-neutral-500">
                                <svg className="w-16 h-16 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <p>{searchTerm ? "No se encontraron turnos con ese criterio" : "No hay turnos registrados"}</p>
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
                                        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-black font-bold text-lg flex-shrink-0">
                                                    {shift.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-white font-semibold text-lg">
                                                        {shift.name} {shift.lastName}
                                                    </h3>
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-neutral-400 mt-1">
                                                        <span className="truncate">{shift.email}</span>
                                                        <span className="hidden sm:inline text-neutral-600">•</span>
                                                        <span>{shift.phone}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 md:gap-6">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-5 h-5 text-neutral-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-neutral-300 text-sm">{shift.location.name}</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <svg className="w-5 h-5 text-neutral-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                    </svg>
                                                    <div className="text-sm">
                                                        <span className="text-white font-medium">{date.toLocaleDateString("es-AR")}</span>
                                                        <span className="text-neutral-500 ml-2">{shift.time}</span>
                                                    </div>
                                                </div>

                                                <Chip
                                                    label={shift.confirmed ? "Confirmado" : "Pendiente"}
                                                    color={shift.confirmed ? "success" : "warning"}
                                                    variant="soft"
                                                />
                                            </div>

                                            <div className="flex gap-2 flex-wrap md:flex-nowrap">
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => toggleConfirmed(shift.id, shift.confirmed)}
                                                    disabled={confirmingId === shift.id}
                                                >
                                                    {shift.confirmed ? "Desconfirmar" : "Confirmar"}
                                                </Button>
                                                <Link href={`/admin/cms/shifts/${shift.id}`}>
                                                    <Button size="small" variant="outlined" color="default">
                                                        Ver
                                                    </Button>
                                                </Link>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={() => setDeleteId(shift.id)}
                                                >
                                                    Eliminar
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>

            <ConfirmDialog
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Eliminar Turno"
                message="¿Estás seguro de eliminar este turno? Esta acción no se puede deshacer."
                confirmText="Eliminar"
                loading={deleting}
            />
        </div>
    );
}
