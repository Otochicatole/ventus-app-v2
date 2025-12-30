"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

            <Card>
                <CardHeader>
                    <h2 className="text-2xl font-bold text-white mb-2">Todos los Turnos</h2>
                    <p className="text-neutral-400">{shifts.length} registro(s) en total</p>
                </CardHeader>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-neutral-900 border-b border-neutral-800">
                            <tr>
                                <th className="text-left py-5 px-8 text-neutral-400 font-semibold text-sm">Paciente</th>
                                <th className="text-left py-5 px-8 text-neutral-400 font-semibold text-sm">Contacto</th>
                                <th className="text-left py-5 px-8 text-neutral-400 font-semibold text-sm">Ubicación</th>
                                <th className="text-left py-5 px-8 text-neutral-400 font-semibold text-sm">Fecha/Hora</th>
                                <th className="text-left py-5 px-8 text-neutral-400 font-semibold text-sm">Estado</th>
                                <th className="text-right py-5 px-8 text-neutral-400 font-semibold text-sm">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {shifts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-neutral-500">
                                        <div className="flex flex-col items-center gap-4">
                                            <svg className="w-16 h-16 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                            <p>No hay turnos registrados</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                shifts.map((shift) => {
                                    const dateStr = shift.date.split("T")[0];
                                    const [year, month, day] = dateStr.split("-");
                                    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                                    return (
                                        <tr key={shift.id} className="hover:bg-neutral-900/50 transition-colors">
                                            <td className="py-5 px-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-black font-bold">
                                                        {shift.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-white font-medium">{shift.name} {shift.lastName}</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-8">
                                                <div className="space-y-1">
                                                    <p className="text-neutral-300 text-sm">{shift.email}</p>
                                                    <p className="text-neutral-500 text-sm">{shift.phone}</p>
                                                </div>
                                            </td>
                                            <td className="py-5 px-8 text-neutral-300">{shift.location.name}</td>
                                            <td className="py-5 px-8">
                                                <div className="space-y-1">
                                                    <p className="text-white font-medium">{date.toLocaleDateString("es-AR")}</p>
                                                    <p className="text-neutral-400 text-sm">{shift.time}</p>
                                                </div>
                                            </td>
                                            <td className="py-5 px-8">
                                                <Chip
                                                    label={shift.confirmed ? "Confirmado" : "Pendiente"}
                                                    color={shift.confirmed ? "success" : "warning"}
                                                    variant="soft"
                                                />
                                            </td>
                                            <td className="py-5 px-8">
                                                <div className="flex gap-2 justify-end">
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
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

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
