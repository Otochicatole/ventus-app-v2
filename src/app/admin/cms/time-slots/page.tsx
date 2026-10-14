"use client";

import { useEffect, useState, FormEvent } from "react";
import { Plus, Clock, X } from "lucide-react";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Dialog, { DialogContent, DialogActions } from "@/components/ui/dialog";
import ConfirmDialog from "@/components/ui/confirm-dialog";

type Location = {
    id: string;
    name: string;
    address: string;
};

type TimeSlot = {
    id: string;
    time: string;
    locationId: string;
};

export default function TimeSlotsPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [selectedLocationId, setSelectedLocationId] = useState("");
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [newTime, setNewTime] = useState("");
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchLocations();
    }, []);

    useEffect(() => {
        if (selectedLocationId) {
            fetchTimeSlots();
        }
    }, [selectedLocationId]);

    useEffect(() => {
        const handleFocus = () => {
            if (selectedLocationId) {
                fetchTimeSlots();
            }
        };

        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, [selectedLocationId]);

    const fetchLocations = async () => {
        try {
            const res = await fetch("/api/locations", {
                cache: "no-store",
            });
            const data = await res.json();
            setLocations(data);
        } catch (error) {
            console.error("Error fetching locations:", error);
        }
    };

    const fetchTimeSlots = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/time-slots?locationId=${selectedLocationId}`, {
                cache: "no-store",
            });
            const data = await res.json();
            setTimeSlots(data);
        } catch (error) {
            console.error("Error fetching time slots:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTimeSlot = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/time-slots", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    time: newTime,
                    locationId: selectedLocationId,
                }),
            });

            if (res.ok) {
                setNewTime("");
                setShowModal(false);
                fetchTimeSlots();
            }
        } catch (error) {
            console.error("Error adding time slot:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        setDeleting(true);
        try {
            const res = await fetch(`/api/time-slots/${deleteId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setTimeSlots(timeSlots.filter((slot) => slot.id !== deleteId));
                setDeleteId(null);
            }
        } catch (error) {
            console.error("Error deleting time slot:", error);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn pb-12">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-5">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">Gestión de Horarios</h1>
                    <p className="text-stone-500 text-sm mt-1">
                        Configuración de franjas horarias disponibles para reserva de turnos por sede
                    </p>
                </div>
            </div>

            {/* Location Selector Card */}
            <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
                <Select
                    label="Seleccionar Sede / Ubicación"
                    value={selectedLocationId}
                    onChange={(e) => setSelectedLocationId(e.target.value)}
                    options={[
                        { value: "", label: "Seleccionar una sede para ver sus horarios..." },
                        ...locations.map((loc) => ({
                            value: loc.id,
                            label: `${loc.name} — ${loc.address}`,
                        })),
                    ]}
                    fullWidth
                />
            </div>

            {selectedLocationId && (
                <div className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <h2 className="text-lg font-bold text-stone-900">Horarios Configurados</h2>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
                                    {timeSlots.length} horarios
                                </span>
                            </div>
                            <p className="text-xs text-stone-500 mt-1">
                                Los clientes podrán reservar únicamente en estos turnos habilitados
                            </p>
                        </div>
                        <Button 
                            onClick={() => setShowModal(true)} 
                            startIcon={<Plus className="w-4 h-4" />}
                            className="w-full sm:w-auto"
                        >
                            Agregar Horario
                        </Button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0b3a60] border-t-transparent"></div>
                        </div>
                    ) : timeSlots.length === 0 ? (
                        <div className="py-12 text-center">
                            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3">
                                <Clock className="w-6 h-6 text-stone-400" />
                            </div>
                            <h3 className="text-sm font-semibold text-stone-900">No hay horarios configurados</h3>
                            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                                Esta ubicación aún no tiene horarios disponibles para que los clientes elijan al reservar.
                            </p>
                            <div className="mt-4">
                                <Button size="small" onClick={() => setShowModal(true)} startIcon={<Plus className="w-4 h-4" />}>
                                    Crear primer horario
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {timeSlots.map((slot) => (
                                <div
                                    key={slot.id}
                                    className="flex items-center justify-between px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg hover:border-stone-300 hover:bg-stone-100/70 transition-all group"
                                >
                                    <span className="text-stone-900 font-semibold text-sm tracking-tight">{slot.time} hs</span>
                                    <button
                                        type="button"
                                        onClick={() => setDeleteId(slot.id)}
                                        className="text-stone-400 hover:text-red-600 transition-colors cursor-pointer p-1 rounded hover:bg-red-50"
                                        title="Eliminar horario"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <Dialog open={showModal} onClose={() => setShowModal(false)} title="Agregar Franja Horaria" maxWidth="sm">
                <form onSubmit={handleAddTimeSlot}>
                    <DialogContent>
                        <div className="space-y-3">
                            <Input
                                label="Horario (formato 24hs)"
                                type="time"
                                value={newTime}
                                onChange={(e) => setNewTime(e.target.value)}
                                required
                                fullWidth
                            />
                            <p className="text-xs text-stone-500">
                                Por ejemplo: 09:00, 10:30, 15:00.
                            </p>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="outlined"
                            onClick={() => setShowModal(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            loading={loading}
                            disabled={loading || !newTime}
                        >
                            Agregar
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <ConfirmDialog
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Eliminar Horario"
                message="¿Estás seguro de que deseás eliminar este horario? No estará más disponible para reservas futuras."
                confirmText="Eliminar"
                loading={deleting}
            />
        </div>
    );
}
