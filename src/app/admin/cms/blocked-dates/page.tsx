"use client";

import { useEffect, useState, FormEvent } from "react";
import { Search, Calendar as CalendarIcon, Trash2, Plus, Ban, AlertCircle } from "lucide-react";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
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

function getTodayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

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
    const [dateError, setDateError] = useState("");

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

    const handleDateChange = (val: string) => {
        setNewDate(val);
        if (!val) {
            setDateError("");
            return;
        }
        const isAlreadyBlocked = blockedDates.some((b) => b.date.split("T")[0] === val);
        if (isAlreadyBlocked) {
            setDateError("Esta fecha ya se encuentra bloqueada para esta sede.");
        } else {
            setDateError("");
        }
    };

    const handleAddBlockedDate = async (e: FormEvent) => {
        e.preventDefault();
        if (!newDate || dateError) return;

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
                setDateError("");
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
        <div className="space-y-6 animate-fadeIn pb-12">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-5">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">Fechas Bloqueadas</h1>
                    <p className="text-stone-500 text-sm mt-1">
                        Días festivos, feriados o no laborables donde no se permitirán reservas
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
                        { value: "", label: "Seleccionar una sede para ver fechas bloqueadas..." },
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
                                <h2 className="text-lg font-bold text-stone-900">Días No Habilitados</h2>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                                    {blockedDates.length} fechas bloqueadas
                                </span>
                            </div>
                            <p className="text-xs text-stone-500 mt-1">
                                En estos días el calendario público de reservas no mostrará turnos
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2.5">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Buscar por fecha o día..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-3.5 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0b3a60]/20 focus:border-[#0b3a60] transition-all"
                                />
                            </div>
                            <Button 
                                onClick={() => {
                                    setNewDate("");
                                    setDateError("");
                                    setShowModal(true);
                                }} 
                                startIcon={<Plus className="w-4 h-4" />}
                                className="whitespace-nowrap"
                            >
                                Bloquear Fecha
                            </Button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0b3a60] border-t-transparent"></div>
                        </div>
                    ) : filteredBlockedDates.length === 0 ? (
                        <div className="py-12 text-center">
                            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3">
                                <CalendarIcon className="w-6 h-6 text-stone-400" />
                            </div>
                            <h3 className="text-sm font-semibold text-stone-900">No hay fechas bloqueadas</h3>
                            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                                {searchTerm
                                    ? "No se encontraron fechas que coincidan con la búsqueda."
                                    : "Todos los días hábiles se encuentran disponibles para reserva."}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {filteredBlockedDates.map((blocked) => {
                                const dateStr = blocked.date.split("T")[0];
                                const [year, month, day] = dateStr.split("-");
                                const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                                return (
                                    <div
                                        key={blocked.id}
                                        className="flex items-center justify-between p-3.5 bg-red-50/40 border border-red-200/70 rounded-xl hover:border-red-300 transition-all"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-9 h-9 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                                                <Ban className="w-4 h-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-stone-900">
                                                    {date.toLocaleDateString("es-AR")}
                                                </p>
                                                <p className="text-xs text-stone-500 capitalize">
                                                    {date.toLocaleDateString("es-AR", { weekday: "long" })}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setDeleteId(blocked.id)}
                                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
                                            title="Desbloquear fecha"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            <Dialog
                open={showModal}
                onClose={() => setShowModal(false)}
                title="Bloquear Nueva Fecha"
                maxWidth="sm"
            >
                <form onSubmit={handleAddBlockedDate}>
                    <DialogContent>
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                                    Fecha a Bloquear
                                </label>
                                <input
                                    type="date"
                                    min={getTodayStr()}
                                    value={newDate}
                                    onChange={(e) => handleDateChange(e.target.value)}
                                    required
                                    className="px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0b3a60]/20 focus:border-[#0b3a60] transition-all"
                                />
                            </div>

                            {dateError && (
                                <p className="text-xs text-red-600 flex items-center gap-1.5 font-medium">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                    {dateError}
                                </p>
                            )}

                            <p className="text-xs text-stone-500">
                                Esta fecha quedará deshabilitada inmediatamente y ningún cliente podrá solicitar un turno en este día para la sede seleccionada.
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
                            disabled={loading || !newDate || Boolean(dateError)}
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
                message="¿Estás seguro de que deseás desbloquear esta fecha? Volverá a estar disponible inmediatamente para recibir reservas de clientes."
                confirmText="Desbloquear"
                loading={deleting}
            />
        </div>
    );
}
