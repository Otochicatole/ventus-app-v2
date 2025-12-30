"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    CircularProgress,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

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
            <Box sx={{ maxWidth: 900, mx: "auto", px: { xs: 2, sm: 3, lg: 4 }, py: 4 }}>
                <Typography variant="h3" component="h1" fontWeight="bold" sx={{ mb: 4 }}>
                    Nuevo Turno
                </Typography>

                <Card>
                    <CardContent>
                        <Typography variant="h6" component="h2" gutterBottom>
                            Información del Turno
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            {error && (
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    {error}
                                </Alert>
                            )}

                            <FormControl fullWidth sx={{ mb: 3 }} required>
                                <InputLabel id="location-select-label">Ubicación</InputLabel>
                                <Select
                                    labelId="location-select-label"
                                    value={formData.locationId}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            locationId: e.target.value,
                                            time: "",
                                        })
                                    }
                                    label="Ubicación"
                                >
                                    <MenuItem value="">Seleccionar ubicación</MenuItem>
                                    {locations.map((loc) => (
                                        <MenuItem key={loc.id} value={loc.id}>
                                            {loc.name} - {loc.address}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

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
                                        sx: { mb: 3 },
                                    },
                                }}
                            />

                            {formData.date && formData.locationId && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Horario *
                                    </Typography>
                                    {loadingSlots ? (
                                        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                                            <CircularProgress size={24} />
                                        </Box>
                                    ) : availableSlots.length > 0 ? (
                                        <Grid container spacing={1}>
                                            {availableSlots.map((slot) => (
                                                <Grid item xs={6} sm={3} key={slot.id}>
                                                    <Button
                                                        fullWidth
                                                        variant={formData.time === slot.time ? "contained" : "outlined"}
                                                        onClick={() =>
                                                            setFormData({ ...formData, time: slot.time })
                                                        }
                                                    >
                                                        {slot.time}
                                                    </Button>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    ) : (
                                        <Typography color="text.secondary">
                                            No hay horarios disponibles
                                        </Typography>
                                    )}
                                </Box>
                            )}

                            <Box sx={{ borderTop: 1, borderColor: "divider", pt: 3, mb: 3 }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Datos del Paciente
                                </Typography>

                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Nombre"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, name: e.target.value })
                                            }
                                            required
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Apellido"
                                            value={formData.lastName}
                                            onChange={(e) =>
                                                setFormData({ ...formData, lastName: e.target.value })
                                            }
                                            required
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>

                                <TextField
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    required
                                    fullWidth
                                    sx={{ mb: 2 }}
                                />

                                <TextField
                                    label="Teléfono"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phone: e.target.value })
                                    }
                                    required
                                    fullWidth
                                />
                            </Box>

                            <Box sx={{ borderTop: 1, borderColor: "divider", pt: 3, mb: 3 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formData.confirmed}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    confirmed: e.target.checked,
                                                })
                                            }
                                        />
                                    }
                                    label="Marcar como confirmado"
                                    sx={{ mb: 2 }}
                                />

                                <TextField
                                    label="Notas (opcional)"
                                    value={formData.notes}
                                    onChange={(e) =>
                                        setFormData({ ...formData, notes: e.target.value })
                                    }
                                    multiline
                                    rows={3}
                                    fullWidth
                                    placeholder="Notas adicionales sobre el turno..."
                                />
                            </Box>

                            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                                <Button onClick={() => router.back()} disabled={loading}>
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading || !formData.time}
                                    variant="contained"
                                >
                                    {loading ? <CircularProgress size={24} /> : "Crear Turno"}
                                </Button>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </LocalizationProvider>
    );
}

