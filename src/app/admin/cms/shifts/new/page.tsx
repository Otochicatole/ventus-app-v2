"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import Alert from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

type Location = {
    id: string;
    name: string;
    address: string;
};

type TimeSlot = {
    id: string;
    time: string;
};

export default function NewShiftPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [locations, setLocations] = useState<Location[]>([]);
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        email: "",
        phone: "",
        locationId: "",
        date: "",
        time: "",
        confirmed: false,
        notes: "",
    });

    useEffect(() => {
        fetchLocations();
    }, []);

    useEffect(() => {
        if (formData.locationId && formData.date) {
            fetchAvailableSlots();
        }
    }, [formData.locationId, formData.date]);

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

    const fetchAvailableSlots = async () => {
        setLoadingSlots(true);
        try {
            const res = await fetch(
                `/api/shifts/available-slots?locationId=${formData.locationId}&date=${formData.date}`,
                {
                    cache: "no-store",
                }
            );
            const data = await res.json();
            setAvailableSlots(data);
        } catch (error) {
            console.error("Error fetching slots:", error);
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/shifts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    locationId: formData.locationId,
                    date: formData.date,
                    time: formData.time,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Error al crear turno");
            }

            const shift = await res.json();

            if (formData.confirmed) {
                await fetch(`/api/admin/shifts/${shift.id}/confirm`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ confirmed: true }),
                });
            }

            if (formData.notes) {
                await fetch(`/api/admin/shifts/${shift.id}/notes`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ notes: formData.notes }),
                });
            }

            router.refresh();
            router.push("/admin/cms/shifts");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al crear turno");
        } finally {
            setLoading(false);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-4xl font-bold text-white">Nuevo Turno</h1>

                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-xl font-bold text-white mb-6">
                            Información del Turno
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <Alert severity="error">
                                    {error}
                                </Alert>
                            )}

                            <Select
                                label="Ubicación"
                                value={formData.locationId}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        locationId: e.target.value,
                                        time: "",
                                    })
                                }
                                options={[
                                    { value: "", label: "Seleccionar ubicación" },
                                    ...locations.map((loc) => ({
                                        value: loc.id,
                                        label: `${loc.name} - ${loc.address}`,
                                    })),
                                ]}
                                required
                                fullWidth
                            />

                            <DatePicker
                                label="Fecha"
                                value={formData.date ? dayjs(formData.date) : null}
                                onChange={(date) =>
                                    setFormData({
                                        ...formData,
                                        date: date ? date.format("YYYY-MM-DD") : "",
                                        time: "",
                                    })
                                }
                                minDate={dayjs()}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        required: true,
                                    },
                                }}
                            />

                            {formData.date && formData.locationId && (
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-3">
                                        Horario <span className="text-red-500">*</span>
                                    </label>
                                    {loadingSlots ? (
                                        <div className="flex justify-center py-4">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                        </div>
                                    ) : availableSlots.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                            {availableSlots.map((slot) => (
                                                <button
                                                    key={slot.id}
                                                    type="button"
                                                    onClick={() =>
                                                        setFormData({ ...formData, time: slot.time })
                                                    }
                                                    className={`px-4 py-2 rounded-md font-semibold transition-all ${
                                                        formData.time === slot.time
                                                            ? "bg-blue-600 text-white"
                                                            : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700 border-2 border-neutral-700"
                                                    }`}
                                                >
                                                    {slot.time}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-neutral-500">No hay horarios disponibles</p>
                                    )}
                                </div>
                            )}

                            <div className="border-t border-neutral-700 pt-6 space-y-4">
                                <h3 className="text-lg font-bold text-white">
                                    Datos del Paciente
                                </h3>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input
                                        label="Nombre"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        required
                                        fullWidth
                                    />
                                    <Input
                                        label="Apellido"
                                        value={formData.lastName}
                                        onChange={(e) =>
                                            setFormData({ ...formData, lastName: e.target.value })
                                        }
                                        required
                                        fullWidth
                                    />
                                </div>

                                <Input
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    required
                                    fullWidth
                                />

                                <Input
                                    label="Teléfono"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phone: e.target.value })
                                    }
                                    required
                                    fullWidth
                                />
                            </div>

                            <div className="border-t border-neutral-700 pt-6 space-y-4">
                                <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.confirmed}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                confirmed: e.target.checked,
                                            })
                                        }
                                        className="w-5 h-5 rounded border-neutral-700 bg-neutral-900 text-blue-600 focus:ring-2 focus:ring-blue-600"
                                    />
                                    <span className="font-medium">Marcar como confirmado</span>
                                </label>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                                        Notas (opcional)
                                    </label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) =>
                                            setFormData({ ...formData, notes: e.target.value })
                                        }
                                        rows={3}
                                        placeholder="Notas adicionales sobre el turno..."
                                        className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-md text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end pt-4">
                                <Button
                                    type="button"
                                    variant="outlined"
                                    onClick={() => router.back()}
                                    disabled={loading}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    loading={loading}
                                    disabled={loading || !formData.time}
                                >
                                    {loading ? "Creando..." : "Crear Turno"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </LocalizationProvider>
    );
}
