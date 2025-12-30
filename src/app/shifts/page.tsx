"use client";

import { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box, Container, Card, CardContent, Typography, TextField, Button, Alert, MenuItem, Grid, Chip, CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/es";

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
        <Box sx={{ minHeight: "100vh", py: 8, px: 2 }}>
            <Container maxWidth="md">
                <Card>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Reservar Turno
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                            Completá el formulario para reservar tu turno
                        </Typography>

                        {message && (
                            <Alert severity={message.type} sx={{ mb: 3 }}>
                                {message.text}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <TextField
                                select
                                label="Ubicación"
                                value={selectedLocationId}
                                onChange={(e) => {
                                    setSelectedLocationId(e.target.value);
                                    setSelectedDate(null);
                                    setAvailableSlots([]);
                                    setFormData({ ...formData, time: "" });
                                }}
                                required
                                fullWidth
                            >
                                <MenuItem value="">Seleccionar ubicación</MenuItem>
                                {locations.map((location) => (
                                    <MenuItem key={location.id} value={location.id}>
                                        {location.name} - {location.address}
                                    </MenuItem>
                                ))}
                            </TextField>

                            {selectedLocationId && (
                                <Box>
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
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    required: true,
                                                },
                                                day: {
                                                    sx: {
                                                        "&.Mui-disabled": {
                                                            color: "#525252 !important",
                                                            backgroundColor: "#262626",
                                                            textDecoration: "line-through",
                                                        },
                                                    },
                                                },
                                            }}
                                        />
                                    </LocalizationProvider>
                                    {unavailableDates.length > 0 && (
                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                                            Las fechas en gris no están disponibles
                                        </Typography>
                                    )}
                                </Box>
                            )}

                            {selectedDate && (
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Horario
                                    </Typography>
                                    {loadingSlots ? (
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 2 }}>
                                            <CircularProgress size={24} />
                                            <Typography variant="body2">Cargando horarios disponibles...</Typography>
                                        </Box>
                                    ) : availableSlots.length > 0 ? (
                                        <Grid container spacing={1.5}>
                                            {availableSlots.map((slot) => (
                                                <Grid item xs={4} key={slot.id}>
                                                    <Chip
                                                        label={slot.time}
                                                        onClick={() => setFormData({ ...formData, time: slot.time })}
                                                        color={formData.time === slot.time ? "primary" : "default"}
                                                        sx={{
                                                            width: "100%",
                                                            py: 2.5,
                                                            fontSize: "0.95rem",
                                                            fontWeight: formData.time === slot.time ? 600 : 400,
                                                        }}
                                                    />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    ) : (
                                        <Alert severity="info">
                                            No hay horarios disponibles para esta fecha
                                        </Alert>
                                    )}
                                </Box>
                            )}

                            {formData.time && (
                                <Box sx={{ borderTop: 1, borderColor: "divider", pt: 3 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Datos Personales
                                    </Typography>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Nombre"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Apellido"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                required
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Teléfono"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                required
                                                fullWidth
                                            />
                                        </Grid>
                                    </Grid>

                                    <Box sx={{ mt: 4 }}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            disabled={!isFormValid || loading}
                                            fullWidth
                                            size="large"
                                            startIcon={loading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
                                        >
                                            {loading ? "Reservando..." : "Reservar Turno"}
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}

