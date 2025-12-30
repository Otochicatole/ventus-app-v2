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
        <div className="space-y-8 animate-fadeIn">
            <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">Gestión de Horarios</h1>
                <p className="text-gray-600 text-lg">Configuración de horarios disponibles por ubicación</p>
            </div>

            <Card>
                <CardContent>
                    <Select
                        label="Seleccionar Ubicación"
                        value={selectedLocationId}
                        onChange={(e) => setSelectedLocationId(e.target.value)}
                        options={[
                            { value: "", label: "Seleccionar ubicación" },
                            ...locations.map((loc) => ({
                                value: loc.id,
                                label: `${loc.name} - ${loc.address}`,
                            })),
                        ]}
                        fullWidth
                    />
                </CardContent>
            </Card>

            {selectedLocationId && (
                <Card>
                    <CardHeader className="flex flex-col gap-4">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Horarios Disponibles</h2>
                                <p className="text-gray-600">{timeSlots.length} horario(s) configurado(s)</p>
                            </div>
                            <Button 
                                onClick={() => setShowModal(true)} 
                                startIcon={<Plus className="w-5 h-5" />}
                                className="w-full lg:w-auto"
                            >
                                Agregar Horario
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
                            </div>
                        ) : timeSlots.length === 0 ? (
                            <div className="py-12 text-center">
                                <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <p className="text-gray-500">No hay horarios configurados para esta ubicación</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {timeSlots.map((slot) => (
                                    <div
                                        key={slot.id}
                                        className="flex items-center justify-between px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors group cursor-pointer"
                                    >
                                        <span className="text-gray-900 font-medium text-lg">{slot.time}</span>
                                        <button
                                            onClick={() => setDeleteId(slot.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors md:opacity-0 md:group-hover:opacity-100 cursor-pointer"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            <Dialog open={showModal} onClose={() => setShowModal(false)} title="Agregar Horario" maxWidth="sm">
                <form onSubmit={handleAddTimeSlot}>
                    <DialogContent>
                        <Input
                            label="Horario"
                            type="time"
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                            required
                            fullWidth
                        />
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
                            disabled={loading}
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
                message="¿Estás seguro de eliminar este horario?"
                confirmText="Eliminar"
                loading={deleting}
            />
        </div>
    );
}
