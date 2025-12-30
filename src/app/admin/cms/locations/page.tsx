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
    Box,
    CircularProgress,
} from "@mui/material";
import ConfirmDialog from "../../components/ui/confirm-dialog";

type Location = {
    id: string;
    name: string;
    address: string;
    _count?: {
        shifts: number;
    };
};

export default function LocationsPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchLocations();
    }, []);

    useEffect(() => {
        const handleFocus = () => {
            fetchLocations();
        };

        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, []);

    const fetchLocations = async () => {
        try {
            const res = await fetch("/api/locations", {
                cache: "no-store",
            });
            const data = await res.json();
            setLocations(data);
        } catch (error) {
            console.error("Error fetching locations:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        setDeleting(true);
        try {
            const res = await fetch(`/api/locations/${deleteId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setLocations(locations.filter((loc) => loc.id !== deleteId));
                setDeleteId(null);
            }
        } catch (error) {
            console.error("Error deleting location:", error);
        } finally {
            setDeleting(false);
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
                    Ubicaciones
                </Typography>
                <Button
                    component={Link}
                    href="/admin/cms/locations/new"
                    variant="contained"
                >
                    + Nueva Ubicación
                </Button>
            </Box>

            <Card>
                <CardContent>
                    <Typography variant="h6" component="h2" gutterBottom>
                        Todas las Ubicaciones
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nombre</TableCell>
                                    <TableCell>Dirección</TableCell>
                                    <TableCell align="right">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {locations.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                                            <Typography color="text.secondary">
                                                No hay ubicaciones registradas
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    locations.map((location) => (
                                        <TableRow key={location.id} hover>
                                            <TableCell>{location.name}</TableCell>
                                            <TableCell>{location.address}</TableCell>
                                            <TableCell align="right">
                                                <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                                                    <Button
                                                        component={Link}
                                                        href={`/admin/cms/locations/${location.id}/edit`}
                                                        variant="outlined"
                                                        size="small"
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        onClick={() => setDeleteId(location.id)}
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
                title="Eliminar Ubicación"
                message="¿Estás seguro de eliminar esta ubicación? Esto también eliminará todos los turnos, horarios y fechas bloqueadas asociadas. Esta acción no se puede deshacer."
                confirmText="Eliminar"
                loading={deleting}
            />
        </Box>
    );
}

