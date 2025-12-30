"use client";

import { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/es";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import Alert from "@/components/ui/alert";
import Chip from "@/components/ui/chip";
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

export default function ShiftsPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedLocationId, setSelectedLocationId] = useState("");
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
    const [unavailableDates, setUnavailableDates] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        email: "",
        phone: "",
        time: "",
    });

    const [loading, setLoading] = useState(false);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    useEffect(() => {
        fetchLocations();
    }, []);

    useEffect(() => {
        if (selectedLocationId) {
            fetchUnavailableDates();
        }
    }, [selectedLocationId]);

    useEffect(() => {
        if (selectedLocationId && selectedDate) {
            fetchAvailableSlots();
        }
    }, [selectedLocationId, selectedDate]);

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

    const fetchUnavailableDates = async () => {
        try {
            const res = await fetch(
                `/api/unavailable-dates?locationId=${selectedLocationId}`,
                {
                    cache: "no-store",
                }
            );
            const data = await res.json();
            const dates = data.map((item: { date: string }) =>
                item.date.split("T")[0]
            );
            setUnavailableDates(dates);
        } catch (error) {
            console.error("Error fetching unavailable dates:", error);
        }
    };

    const fetchAvailableSlots = async () => {
        if (!selectedDate) return;
        setLoadingSlots(true);
        try {
            const dateStr = selectedDate.format("YYYY-MM-DD");
            const res = await fetch(
                `/api/shifts/available-slots?locationId=${selectedLocationId}&date=${dateStr}`,
                {
                    cache: "no-store",
                }
            );
            const data = await res.json();
            setAvailableSlots(data);
        } catch (error) {
            console.error("Error fetching available slots:", error);
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDate) return;
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch("/api/shifts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    date: selectedDate.format("YYYY-MM-DD"),
                    locationId: selectedLocationId,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Error al crear turno");
            }

            setMessage({ type: "success", text: "Turno creado exitosamente" });
            setFormData({ name: "", lastName: "", email: "", phone: "", time: "" });
            setSelectedDate(null);
            setSelectedLocationId("");
            setAvailableSlots([]);
        } catch (error) {
            setMessage({
                type: "error",
                text: error instanceof Error ? error.message : "Error al crear turno",
            });
        } finally {
            setLoading(false);
        }
    };

    const shouldDisableDate = (date: Dayjs) => {
        const dateStr = date.format("YYYY-MM-DD");
        const today = dayjs().startOf("day");
        
        if (date.isBefore(today, "day")) return true;
        return unavailableDates.includes(dateStr);
    };

    const isFormValid =
        selectedLocationId &&
        selectedDate &&
        formData.time &&
        formData.name &&
        formData.lastName &&
        formData.email &&
        formData.phone;

    return (
        <div className="min-h-screen py-12 px-4 bg-neutral-950">
            <div className="container mx-auto max-w-3xl">
                <Card>
                    <CardContent className="p-8">
                        <h1 className="text-4xl font-bold text-white mb-2">
                            Reservar Turno
                        </h1>
                        <p className="text-neutral-400 mb-8">
                            Completá el formulario para reservar tu turno
                        </p>

                        {message && (
                            <Alert severity={message.type} className="mb-6">
                                {message.text}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Select
                                label="Ubicación"
                                value={selectedLocationId}
                                onChange={(e) => {
                                    setSelectedLocationId(e.target.value);
                                    setSelectedDate(null);
                                    setAvailableSlots([]);
                                    setFormData({ ...formData, time: "" });
                                }}
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

                            {selectedLocationId && (
                                <div>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                                        <DatePicker
                                            label="Fecha"
                                            value={selectedDate}
                                            onChange={(newValue) => {
                                                setSelectedDate(newValue);
                                                setFormData({ ...formData, time: "" });
                                            }}
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
                                                            color: "#737373 !important",
                                                            backgroundColor: "transparent",
                                                            textDecoration: "line-through",
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
                                    </LocalizationProvider>
                                    {unavailableDates.length > 0 && (
                                        <p className="text-sm text-neutral-500 mt-2">
                                            Las fechas tachadas no están disponibles
                                        </p>
                                    )}
                                </div>
                            )}

                            {selectedDate && (
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-300 mb-3">
                                        Horario
                                    </label>
                                    {loadingSlots ? (
                                        <div className="flex items-center gap-3 py-4">
                                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                                            <p className="text-neutral-400">Cargando horarios disponibles...</p>
                                        </div>
                                    ) : availableSlots.length > 0 ? (
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                            {availableSlots.map((slot) => (
                                                <Chip
                                                    key={slot.id}
                                                    label={slot.time}
                                                    onClick={() =>
                                                        setFormData({ ...formData, time: slot.time })
                                                    }
                                                    color={formData.time === slot.time ? "primary" : "default"}
                                                    variant={formData.time === slot.time ? "filled" : "outlined"}
                                                    className="w-full justify-center cursor-pointer hover:bg-neutral-700 transition-colors"
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <Alert severity="info">
                                            No hay horarios disponibles para esta fecha
                                        </Alert>
                                    )}
                                </div>
                            )}

                            {formData.time && (
                                <div className="space-y-6 pt-6 border-t border-neutral-800">
                                    <h2 className="text-2xl font-bold text-white">
                                        Datos Personales
                                    </h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                                    <Button
                                        type="submit"
                                        disabled={!isFormValid || loading}
                                        loading={loading}
                                        size="large"
                                        fullWidth
                                        startIcon={
                                            !loading && (
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )
                                        }
                                    >
                                        {loading ? "Reservando..." : "Reservar Turno"}
                                    </Button>
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
