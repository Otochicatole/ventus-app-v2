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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
    CircularProgress,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import ConfirmDialog from "../../components/ui/confirm-dialog";

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

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3, lg: 4 }, py: 4 }}>
                <Typography variant="h3" component="h1" fontWeight="bold" sx={{ mb: 4 }}>
                    Fechas Bloqueadas
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
                                    Fechas Bloqueadas
                                </Typography>
                                <Button variant="contained" onClick={() => setShowModal(true)}>
                                    + Bloquear Fecha
                                </Button>
                            </Box>
                            {loading ? (
                                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                                    <CircularProgress />
                                </Box>
                            ) : blockedDates.length > 0 ? (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Fecha</TableCell>
                                                <TableCell>Día de la Semana</TableCell>
                                                <TableCell align="right">Acciones</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {blockedDates.map((blocked) => {
                                                const dateStr = blocked.date.split("T")[0];
                                                const [year, month, day] = dateStr.split("-");
                                                const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                                                return (
                                                    <TableRow key={blocked.id} hover>
                                                        <TableCell>
                                                            {date.toLocaleDateString("es-AR", {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                            })}
                                                        </TableCell>
                                                        <TableCell>
                                                            {date.toLocaleDateString("es-AR", {
                                                                weekday: "long",
                                                            })}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Button
                                                                onClick={() => setDeleteId(blocked.id)}
                                                                variant="outlined"
                                                                color="error"
                                                                size="small"
                                                            >
                                                                Desbloquear
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Box sx={{ textAlign: "center", py: 4 }}>
                                    <Typography color="text.secondary">
                                        No hay fechas bloqueadas para esta ubicación
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                )}

                <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Bloquear Fecha</DialogTitle>
                    <form onSubmit={handleAddBlockedDate}>
                        <DialogContent>
                            <DatePicker
                                label="Fecha a Bloquear"
                                value={newDate ? dayjs(newDate) : null}
                                onChange={(date) => setNewDate(date ? date.format("YYYY-MM-DD") : "")}
                                minDate={dayjs()}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        required: true,
                                    },
                                }}
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                Esta fecha no estará disponible para reservar turnos en esta ubicación.
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setShowModal(false)} disabled={loading}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading} variant="contained">
                                {loading ? <CircularProgress size={24} /> : "Bloquear"}
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
            </Box>
        </LocalizationProvider>
    );
}

