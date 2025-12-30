"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Chip,
    TextField,
    Grid,
    CircularProgress,
} from "@mui/material";

type Shift = {
    id: string;
    name: string;
    lastName: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    confirmed: boolean;
    notes: string | null;
    location: {
        id: string;
        name: string;
        address: string;
    };
    createdAt: string;
};

export default function ShiftDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [shift, setShift] = useState<Shift | null>(null);
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState("");
    const [savingNotes, setSavingNotes] = useState(false);

    useEffect(() => {
        fetchShift();
    }, []);

    const fetchShift = async () => {
        try {
            const res = await fetch(`/api/shifts/${params.id}`, {
                cache: "no-store",
            });
            const data = await res.json();
            setShift(data);
            setNotes(data.notes || "");
        } catch (error) {
            console.error("Error fetching shift:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleConfirmed = async () => {
        if (!shift) return;

        try {
            const res = await fetch(`/api/admin/shifts/${shift.id}/confirm`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ confirmed: !shift.confirmed }),
            });

            if (res.ok) {
                const updated = await res.json();
                setShift(updated);
            }
        } catch (error) {
            console.error("Error toggling confirmed:", error);
        }
    };

    const handleSaveNotes = async (e: FormEvent) => {
        e.preventDefault();
        if (!shift) return;

        setSavingNotes(true);
        try {
            const res = await fetch(`/api/admin/shifts/${shift.id}/notes`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notes }),
            });

            if (res.ok) {
                const updated = await res.json();
                setShift(updated);
            }
        } catch (error) {
            console.error("Error saving notes:", error);
        } finally {
            setSavingNotes(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!shift) {
        return (
            <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography color="text.secondary">Turno no encontrado</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1000, mx: "auto", px: { xs: 2, sm: 3, lg: 4 }, py: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Typography variant="h3" component="h1" fontWeight="bold">
                    Detalle del Turno
                </Typography>
                <Button onClick={() => router.back()}>← Volver</Button>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Card>
                    <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                            <Typography variant="h6" component="h2">
                                Información del Paciente
                            </Typography>
                            <Chip
                                label={shift.confirmed ? "Confirmado" : "Pendiente"}
                                color={shift.confirmed ? "success" : "warning"}
                            />
                        </Box>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">
                                    Nombre Completo
                                </Typography>
                                <Typography variant="h6">
                                    {shift.name} {shift.lastName}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">
                                    Email
                                </Typography>
                                <Typography variant="h6">{shift.email}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">
                                    Teléfono
                                </Typography>
                                <Typography variant="h6">{shift.phone}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">
                                    Fecha de Registro
                                </Typography>
                                <Typography variant="h6">
                                    {new Date(shift.createdAt).toLocaleString("es-AR")}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
                            Información del Turno
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">
                                    Ubicación
                                </Typography>
                                <Typography variant="h6">{shift.location.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {shift.location.address}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">
                                    Fecha y Hora
                                </Typography>
                                <Typography variant="h6">
                                    {(() => {
                                        const dateStr = shift.date.split("T")[0];
                                        const [year, month, day] = dateStr.split("-");
                                        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                                        return date.toLocaleDateString("es-AR", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        });
                                    })()}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {shift.time}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 3 }}>
                            <Button variant="contained" onClick={toggleConfirmed}>
                                {shift.confirmed
                                    ? "Marcar como Pendiente"
                                    : "Marcar como Confirmado"}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                            Notas del Admin
                        </Typography>
                        <Box component="form" onSubmit={handleSaveNotes}>
                            <TextField
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                multiline
                                rows={4}
                                fullWidth
                                placeholder="Agregar notas sobre el turno..."
                                sx={{ mb: 2 }}
                            />
                            <Button
                                type="submit"
                                disabled={savingNotes}
                                variant="contained"
                            >
                                {savingNotes ? <CircularProgress size={24} /> : "Guardar Notas"}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}

