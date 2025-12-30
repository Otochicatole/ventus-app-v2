"use client";

import { useEffect, useState, FormEvent } from "react";
import {
    Card,
    CardContent,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    Grid,
    IconButton,
    CircularProgress,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import ConfirmDialog from "../../components/ui/confirm-dialog";

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
        <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3, lg: 4 }, py: 4 }}>
            <Typography variant="h3" component="h1" fontWeight="bold" sx={{ mb: 4 }}>
                Gestión de Horarios
            </Typography>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <FormControl fullWidth>
                        <InputLabel id="location-select-label">Seleccionar Ubicación</InputLabel>
                        <Select
                            labelId="location-select-label"
                            value={selectedLocationId}
                            onChange={(e) => setSelectedLocationId(e.target.value)}
                            label="Seleccionar Ubicación"
                        >
                            <MenuItem value="">Seleccionar ubicación</MenuItem>
                            {locations.map((loc) => (
                                <MenuItem key={loc.id} value={loc.id}>
                                    {loc.name} - {loc.address}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </CardContent>
            </Card>

            {selectedLocationId && (
                <Card>
                    <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                            <Typography variant="h6" component="h2">
                                Horarios Disponibles
                            </Typography>
                            <Button variant="contained" onClick={() => setShowModal(true)}>
                                + Agregar Horario
                            </Button>
                        </Box>
                        {loading ? (
                            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : timeSlots.length > 0 ? (
                            <Grid container spacing={2}>
                                {timeSlots.map((slot) => (
                                    <Grid item xs={12} sm={6} md={3} key={slot.id}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                p: 2,
                                                border: 1,
                                                borderColor: "divider",
                                                borderRadius: 1,
                                                bgcolor: "background.paper",
                                            }}
                                        >
                                            <Typography fontWeight="medium">{slot.time}</Typography>
                                            <IconButton
                                                onClick={() => setDeleteId(slot.id)}
                                                color="error"
                                                size="small"
                                            >
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Box sx={{ textAlign: "center", py: 4 }}>
                                <Typography color="text.secondary">
                                    No hay horarios configurados para esta ubicación
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            )}

            <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Agregar Horario</DialogTitle>
                <form onSubmit={handleAddTimeSlot}>
                    <DialogContent>
                        <TextField
                            label="Horario (formato HH:MM)"
                            type="time"
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                            required
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowModal(false)} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading} variant="contained">
                            {loading ? <CircularProgress size={24} /> : "Agregar"}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <ConfirmDialog
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Eliminar Horario"
                message="¿Estás seguro de eliminar este horario? Los turnos existentes con este horario no se verán afectados."
                confirmText="Eliminar"
                loading={deleting}
            />
        </Box>
    );
}

