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
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0b3a60] border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn pb-12">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-stone-900">Editar Ubicación</h1>
                    <p className="text-xs text-stone-500 mt-1">
                        Actualizar información de la sede física
                    </p>
                </div>
                <Button
                    type="button"
                    variant="outlined"
                    size="small"
                    onClick={() => router.back()}
                >
                    ← Volver
                </Button>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <Alert severity="error">
                            {error}
                        </Alert>
                    )}

                    <Input
                        label="Nombre de la Sede"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        fullWidth
                    />

                    <Input
                        label="Dirección física"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                        fullWidth
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
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

                    <div className="flex items-center justify-end gap-3 pt-5 border-t border-stone-200">
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
                            loading={loading}
                            disabled={loading}
                        >
                            {loading ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
