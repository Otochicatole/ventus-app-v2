"use client";

import { useEffect, useState, FormEvent } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Dialog, { DialogContent, DialogActions } from "@/components/ui/dialog";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { TextField } from "@mui/material";

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

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="space-y-8 animate-fadeIn">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-3">Fechas Bloqueadas</h1>
                    <p className="text-neutral-400 text-lg">Gestión de fechas no disponibles para reservas</p>
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
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Fechas Bloqueadas</h2>
                                <p className="text-neutral-400">{blockedDates.length} fecha(s) bloqueada(s)</p>
                            </div>
                            <Button onClick={() => setShowModal(true)} startIcon={
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                            }>
                                Bloquear Fecha
                            </Button>
                        </CardHeader>

                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
                                </div>
                            ) : blockedDates.length > 0 ? (
                                <table className="w-full">
                                    <thead className="bg-neutral-900 border-b border-neutral-800">
                                        <tr>
                                            <th className="text-left py-5 px-8 text-neutral-400 font-semibold text-sm">Fecha</th>
                                            <th className="text-left py-5 px-8 text-neutral-400 font-semibold text-sm">Día de la Semana</th>
                                            <th className="text-right py-5 px-8 text-neutral-400 font-semibold text-sm">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-800">
                                        {blockedDates.map((blocked) => {
                                            const dateStr = blocked.date.split("T")[0];
                                            const [year, month, day] = dateStr.split("-");
                                            const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                                            return (
                                                <tr key={blocked.id} className="hover:bg-neutral-900/50 transition-colors cursor-pointer">
                                                    <td className="py-5 px-8 text-white font-medium">
                                                        {date.toLocaleDateString("es-AR", {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        })}
                                                    </td>
                                                    <td className="py-5 px-8 text-neutral-300 capitalize">
                                                        {date.toLocaleDateString("es-AR", {
                                                            weekday: "long",
                                                        })}
                                                    </td>
                                                    <td className="py-5 px-8 text-right">
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            color="error"
                                                            onClick={() => setDeleteId(blocked.id)}
                                                        >
                                                            Desbloquear
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="py-12 text-center">
                                    <svg className="w-16 h-16 mx-auto mb-4 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-neutral-500">No hay fechas bloqueadas para esta ubicación</p>
                                </div>
                            )}
                        </div>
                    </Card>
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
                                    enableAccessibleFieldDOMStructure={false}
                                    slots={{
                                        textField: (params) => (
                                            <TextField
                                                {...params}
                                                fullWidth
                                                required
                                                InputLabelProps={{
                                                    ...params.InputLabelProps,
                                                    style: { color: '#d4d4d4' },
                                                }}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    style: { color: '#ffffff' },
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        backgroundColor: 'rgba(38, 38, 38, 0.5)',
                                                        borderRadius: '8px',
                                                        '& fieldset': {
                                                            borderColor: 'rgba(64, 64, 64, 0.5)',
                                                            borderWidth: '2px',
                                                        },
                                                        '&:hover fieldset': {
                                                            borderColor: 'rgba(82, 82, 82, 0.5)',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: '#ffffff',
                                                            borderWidth: '2px',
                                                        },
                                                        '& input': {
                                                            color: '#ffffff',
                                                        },
                                                    },
                                                    '& .MuiIconButton-root': {
                                                        color: '#ffffff',
                                                    },
                                                }}
                                            />
                                        ),
                                    }}
                                    slotProps={{
                                        popper: {
                                            placement: 'bottom-start',
                                            modifiers: [
                                                {
                                                    name: 'flip',
                                                    enabled: false,
                                                },
                                                {
                                                    name: 'preventOverflow',
                                                    enabled: false,
                                                },
                                            ],
                                        },
                                        desktopPaper: {
                                            sx: {
                                                backgroundColor: "#171717",
                                                border: "1px solid #262626",
                                                borderRadius: "12px",
                                                transition: 'none !important',
                                                transform: 'none !important',
                                                "& .MuiPickersDay-root": {
                                                    color: "#ffffff",
                                                    fontWeight: 500,
                                                    transition: 'background-color 0.15s',
                                                    "&:hover": {
                                                        backgroundColor: "#262626",
                                                    },
                                                },
                                                "& .MuiPickersDay-root.Mui-disabled": {
                                                    color: "#ef4444 !important",
                                                    backgroundColor: "#7f1d1d",
                                                    textDecoration: "line-through",
                                                    opacity: 0.8,
                                                },
                                                "& .MuiPickersCalendarHeader-label": {
                                                    color: "#ffffff",
                                                    fontWeight: 600,
                                                },
                                                "& .MuiPickersCalendarHeader-switchViewButton": {
                                                    color: "#ffffff",
                                                },
                                                "& .MuiPickersArrowSwitcher-button": {
                                                    color: "#ffffff",
                                                },
                                                "& .MuiDayCalendar-weekDayLabel": {
                                                    color: "#a3a3a3",
                                                    fontWeight: 600,
                                                },
                                                "& .Mui-selected": {
                                                    backgroundColor: "#ffffff !important",
                                                    color: "#000000 !important",
                                                    fontWeight: 700,
                                                    "&:hover": {
                                                        backgroundColor: "#e5e5e5 !important",
                                                    },
                                                },
                                            },
                                        },
                                    }}
                                />
                                <p className="text-sm text-neutral-500">
                                    Esta fecha no estará disponible para reservar turnos en esta ubicación.
                                </p>
                                {blockedDates.length > 0 && (
                                    <p className="text-xs text-red-400 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                                        </svg>
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
