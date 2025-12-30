"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
    Grid,
    CircularProgress,
} from "@mui/material";

type Location = {
    id: string;
    name: string;
    address: string;
    latitude: number | null;
    longitude: number | null;
};

export default function EditLocationPage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        latitude: "",
        longitude: "",
    });

    useEffect(() => {
        fetchLocation();
    }, []);

    const fetchLocation = async () => {
        try {
            const res = await fetch(`/api/locations/${params.id}`, {
                cache: "no-store",
            });
            const data: Location = await res.json();

            setFormData({
                name: data.name,
                address: data.address,
                latitude: data.latitude?.toString() || "",
                longitude: data.longitude?.toString() || "",
            });
        } catch (err) {
            setError("Error al cargar ubicación");
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`/api/locations/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    address: formData.address,
                    latitude: formData.latitude ? parseFloat(formData.latitude) : null,
                    longitude: formData.longitude ? parseFloat(formData.longitude) : null,
                }),
            });

            if (!res.ok) {
                throw new Error("Error al actualizar ubicación");
            }

            router.refresh();
            router.push("/admin/cms/locations");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al actualizar ubicación");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", px: { xs: 2, sm: 3, lg: 4 }, py: 4 }}>
            <Typography variant="h3" component="h1" fontWeight="bold" sx={{ mb: 4 }}>
                Editar Ubicación
            </Typography>

            <Card>
                <CardContent>
                    <Typography variant="h6" component="h2" gutterBottom>
                        Información de la Ubicación
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}

                        <TextField
                            label="Nombre"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            fullWidth
                            sx={{ mb: 3 }}
                        />

                        <TextField
                            label="Dirección"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            required
                            fullWidth
                            sx={{ mb: 3 }}
                        />

                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Latitud (opcional)"
                                    type="number"
                                    inputProps={{ step: "any" }}
                                    value={formData.latitude}
                                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Longitud (opcional)"
                                    type="number"
                                    inputProps={{ step: "any" }}
                                    value={formData.longitude}
                                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                            <Button onClick={() => router.back()} disabled={loading}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading} variant="contained">
                                {loading ? "Guardando..." : "Guardar Cambios"}
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

