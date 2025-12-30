"use client";

import { useEffect, useState, FormEvent } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { Search, Calendar as CalendarIcon, Trash2, Plus, Ban } from "lucide-react";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Dialog, { DialogContent, DialogActions } from "@/components/ui/dialog";
import ConfirmDialog from "@/components/ui/confirm-dialog";

type Location = {
    id: string;
    name: string;
    address: string;
};

type UnavailableDate = {
    id: string;
    date: string;
    locationId: string;
};

export default function BlockedDatesPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [blockedDates, setBlockedDates] = useState<UnavailableDate[]>([]);
    const [selectedLocationId, setSelectedLocationId] = useState("");
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [newDate, setNewDate] = useState("");
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchLocations();
    }, []);

    useEffect(() => {
        if (selectedLocationId) {
            fetchBlockedDates();
        }
    }, [selectedLocationId]);

    useEffect(() => {
        const handleFocus = () => {
            if (selectedLocationId) {
                fetchBlockedDates();
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

    const fetchBlockedDates = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/unavailable-dates?locationId=${selectedLocationId}`, {
                cache: "no-store",
            });
            const data = await res.json();
            setBlockedDates(data);
        } catch (error) {
            console.error("Error fetching blocked dates:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddBlockedDate = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/unavailable-dates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    date: newDate,
                    locationId: selectedLocationId,
                }),
            });

            if (res.ok) {
                setNewDate("");
                setShowModal(false);
                fetchBlockedDates();
            }
        } catch (error) {
            console.error("Error adding blocked date:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        setDeleting(true);
        try {
            const res = await fetch(`/api/unavailable-dates/${deleteId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setBlockedDates(blockedDates.filter((date) => date.id !== deleteId));
                setDeleteId(null);
            }
        } catch (error) {
            console.error("Error deleting blocked date:", error);
        } finally {
            setDeleting(false);
        }
    };

    const shouldDisableDate = (date: Dayjs) => {
        const dateStr = date.format("YYYY-MM-DD");
        return blockedDates.some((blocked) => {
            const blockedDateStr = blocked.date.split("T")[0];
            return blockedDateStr === dateStr;
        });
    };

    const filteredBlockedDates = blockedDates.filter((blocked) => {
        if (!searchTerm) return true;
        
        const search = searchTerm.toLowerCase();
        const dateStr = blocked.date.split("T")[0];
        const [year, month, day] = dateStr.split("-");
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        const formattedDate = date.toLocaleDateString("es-AR").toLowerCase();
        const weekday = date.toLocaleDateString("es-AR", { weekday: "long" }).toLowerCase();
        
        return formattedDate.includes(search) || weekday.includes(search);
    });

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="space-y-8 animate-fadeIn">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Fechas Bloqueadas</h1>
                    <p className="text-gray-600 text-lg">Gestión de fechas no disponibles para reservas</p>
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
                    <div className="space-y-4">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Fechas Bloqueadas</h2>
                                <p className="text-gray-600 text-sm">
                                    {filteredBlockedDates.length} de {blockedDates.length} fecha(s) bloqueada(s)
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                                <div className="relative flex-1 sm:w-80">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar por fecha o día..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <Button 
                                    onClick={() => setShowModal(true)} 
                                    startIcon={<Plus className="w-5 h-5" />}
                                    className="w-full sm:w-auto whitespace-nowrap"
                                >
                                    Bloquear Fecha
                                </Button>
                            </div>
                        </div>

                        {loading ? (
                            <Card>
                                <CardContent>
                                    <div className="flex justify-center py-12">
                                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : filteredBlockedDates.length === 0 ? (
                            <Card>
                                <CardContent>
                                    <div className="flex flex-col items-center gap-4 py-12 text-gray-500">
                                        <CalendarIcon className="w-16 h-16 text-gray-300" />
                                        <p>{searchTerm ? "No se encontraron fechas con ese criterio" : "No hay fechas bloqueadas para esta ubicación"}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {filteredBlockedDates.map((blocked) => {
                                    const dateStr = blocked.date.split("T")[0];
                                    const [year, month, day] = dateStr.split("-");
                                    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                                    return (
                                        <Card key={blocked.id}>
                                            <CardContent>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center shrink-0">
                                                        <CalendarIcon className="w-6 h-6 text-red-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-gray-900 font-semibold text-lg mb-1">
                                                            {date.toLocaleDateString("es-AR")}
                                                        </h3>
                                                        <p className="text-gray-600 text-sm capitalize">
                                                            {date.toLocaleDateString("es-AR", {
                                                                weekday: "long",
                                                            })}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => setDeleteId(blocked.id)}
                                                        className="w-10 h-10 rounded-lg border border-red-300 bg-red-50 hover:bg-red-100 hover:border-red-400 text-red-600 transition-all flex items-center justify-center group shrink-0"
                                                    >
                                                        <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                    </button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                <Dialog open={showModal} onClose={() => setShowModal(false)} title="Bloquear Fecha" maxWidth="sm">
                    <form onSubmit={handleAddBlockedDate}>
                        <DialogContent>
                            <div className="space-y-4">
                                <DatePicker
                                    label="Fecha a Bloquear"
                                    value={newDate ? dayjs(newDate) : null}
                                    onChange={(date) => setNewDate(date ? date.format("YYYY-MM-DD") : "")}
                                    shouldDisableDate={shouldDisableDate}
                                    minDate={dayjs()}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            required: true,
                                        }
                                    }}
                                />
                                <p className="text-sm text-neutral-500">
                                    Esta fecha no estará disponible para reservar turnos en esta ubicación.
                                </p>
                                {blockedDates.length > 0 && (
                                    <p className="text-xs text-red-400 flex items-center gap-2">
                                        <Ban className="w-4 h-4" />
                                        Las fechas bloqueadas aparecen tachadas en rojo
                                    </p>
                                )}
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
                                disabled={loading}
                            >
                                Bloquear
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>

                <ConfirmDialog
                    isOpen={deleteId !== null}
                    onClose={() => setDeleteId(null)}
                    onConfirm={handleDelete}
                    title="Desbloquear Fecha"
                    message="¿Estás seguro de desbloquear esta fecha? Volverá a estar disponible para reservas."
                    confirmText="Desbloquear"
                    loading={deleting}
                />
            </div>
        </LocalizationProvider>
    );
}
