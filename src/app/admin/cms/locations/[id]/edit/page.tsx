"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Alert from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

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
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl font-bold text-white">Editar Ubicación</h1>

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
                        />

                        <Input
                            label="Dirección"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            required
                            fullWidth
                        />

                        <div className="grid md:grid-cols-2 gap-4">
                            <Input
                                label="Latitud (opcional)"
                                type="number"
                                step="any"
                                value={formData.latitude}
                                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                                fullWidth
                            />
                            <Input
                                label="Longitud (opcional)"
                                type="number"
                                step="any"
                                value={formData.longitude}
                                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                                fullWidth
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
                                {loading ? "Guardando..." : "Guardar Cambios"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
