"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Alert from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

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
        <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl font-bold text-white">Nueva Ubicación</h1>

            <Card>
                <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-white mb-6">
                        Información de la Ubicación
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <Alert severity="error">
                                {error}
                            </Alert>
                        )}

                        <Input
                            label="Nombre"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            fullWidth
                            placeholder="Ej: Hospital Central"
                        />

                        <Input
                            label="Dirección"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            required
                            fullWidth
                            placeholder="Ej: Av. Libertador 1234, CABA"
                        />

                        <div className="grid md:grid-cols-2 gap-4">
                            <Input
                                label="Latitud (opcional)"
                                type="number"
                                step="any"
                                value={formData.latitude}
                                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                                fullWidth
                                placeholder="Ej: -34.603722"
                            />
                            <Input
                                label="Longitud (opcional)"
                                type="number"
                                step="any"
                                value={formData.longitude}
                                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                                fullWidth
                                placeholder="Ej: -58.381592"
                            />
                        </div>

                        <div className="flex gap-3 justify-end pt-4">
                            <Button
                                type="button"
                                variant="outlined"
                                onClick={() => router.back()}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                loading={loading}
                                disabled={loading}
                            >
                                {loading ? "Creando..." : "Crear Ubicación"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
