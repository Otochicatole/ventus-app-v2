"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    Box,
    CircularProgress,
} from "@mui/material";
import ConfirmDialog from "../../components/ui/confirm-dialog";

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
    };
};

export default function ShiftsPage() {
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [confirmingId, setConfirmingId] = useState<string | null>(null);

    useEffect(() => {
        fetchShifts();
    }, []);

    useEffect(() => {
        const handleFocus = () => {
            fetchShifts();
        };

        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, []);

    const fetchShifts = async () => {
        try {
            const res = await fetch("/api/shifts", {
                cache: "no-store",
            });
            const data = await res.json();
            setShifts(data);
        } catch (error) {
            console.error("Error fetching shifts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        setDeleting(true);
        try {
            const res = await fetch(`/api/shifts/${deleteId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setShifts(shifts.filter((shift) => shift.id !== deleteId));
                setDeleteId(null);
            }
        } catch (error) {
            console.error("Error deleting shift:", error);
        } finally {
            setDeleting(false);
        }
    };

    const toggleConfirmed = async (shiftId: string, currentStatus: boolean) => {
        setConfirmingId(shiftId);
        try {
            const res = await fetch(`/api/admin/shifts/${shiftId}/confirm`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ confirmed: !currentStatus }),
            });

            if (res.ok) {
                setShifts(
                    shifts.map((shift) =>
                        shift.id === shiftId
                            ? { ...shift, confirmed: !currentStatus }
                            : shift
                    )
                );
            }
        } catch (error) {
            console.error("Error toggling confirmed:", error);
        } finally {
            setConfirmingId(null);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, sm: 3, lg: 4 }, py: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Typography variant="h3" component="h1" fontWeight="bold">
                    Turnos
                </Typography>
                <Button
                    component={Link}
                    href="/admin/cms/shifts/new"
                    variant="contained"
                >
                    + Nuevo Turno
                </Button>
            </Box>

            <Card>
                <CardContent>
                    <Typography variant="h6" component="h2" gutterBottom>
                        Todos los Turnos
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Paciente</TableCell>
                                    <TableCell>Contacto</TableCell>
                                    <TableCell>Ubicación</TableCell>
                                    <TableCell>Fecha/Hora</TableCell>
                                    <TableCell>Estado</TableCell>
                                    <TableCell align="right">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {shifts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                            <Typography color="text.secondary">
                                                No hay turnos registrados
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    shifts.map((shift) => (
                                        <TableRow key={shift.id} hover>
                                            <TableCell>
                                                {shift.name} {shift.lastName}
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{shift.email}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {shift.phone}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{shift.location.name}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {(() => {
                                                        const dateStr = shift.date.split("T")[0];
                                                        const [year, month, day] = dateStr.split("-");
                                                        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                                                        return date.toLocaleDateString("es-AR");
                                                    })()}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {shift.time}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={shift.confirmed ? "Confirmado" : "Pendiente"}
                                                    color={shift.confirmed ? "success" : "warning"}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                                                    <Button
                                                        onClick={() => toggleConfirmed(shift.id, shift.confirmed)}
                                                        disabled={confirmingId === shift.id}
                                                        variant="outlined"
                                                        size="small"
                                                    >
                                                        {shift.confirmed ? "Desconfirmar" : "Confirmar"}
                                                    </Button>
                                                    <Button
                                                        component={Link}
                                                        href={`/admin/cms/shifts/${shift.id}`}
                                                        variant="outlined"
                                                        size="small"
                                                    >
                                                        Ver
                                                    </Button>
                                                    <Button
                                                        onClick={() => setDeleteId(shift.id)}
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            <ConfirmDialog
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Eliminar Turno"
                message="¿Estás seguro de eliminar este turno? Esta acción no se puede deshacer."
                confirmText="Eliminar"
                loading={deleting}
            />
        </Box>
    );
}

