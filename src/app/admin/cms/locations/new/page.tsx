"use client";

import { useState, FormEvent } from "react";
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
} from "@mui/material";

export default function NewLocationPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        latitude: "",
        longitude: "",
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/locations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    address: formData.address,
                    latitude: formData.latitude ? parseFloat(formData.latitude) : null,
                    longitude: formData.longitude ? parseFloat(formData.longitude) : null,
                }),
            });

            if (!res.ok) {
                throw new Error("Error al crear ubicación");
            }

            router.refresh();
            router.push("/admin/cms/locations");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al crear ubicación");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", px: { xs: 2, sm: 3, lg: 4 }, py: 4 }}>
            <Typography variant="h3" component="h1" fontWeight="bold" sx={{ mb: 4 }}>
                Nueva Ubicación
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
                            placeholder="Ej: Hospital Central"
                            sx={{ mb: 3 }}
                        />

                        <TextField
                            label="Dirección"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            required
                            fullWidth
                            placeholder="Ej: Av. Libertador 1234, CABA"
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
                                    placeholder="Ej: -34.603722"
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
                                    placeholder="Ej: -58.381592"
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                            <Button onClick={() => router.back()} disabled={loading}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading} variant="contained">
                                {loading ? "Creando..." : "Crear Ubicación"}
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

