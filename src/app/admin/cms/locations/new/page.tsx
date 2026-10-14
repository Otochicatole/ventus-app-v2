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
        <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn pb-12">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-stone-900">Nueva Ubicación</h1>
                    <p className="text-xs text-stone-500 mt-1">
                        Cargar una nueva sucursal o sede física para recepción de clientes
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
                        placeholder="Ej: Ventus Central - Recoleta"
                    />

                    <Input
                        label="Dirección física"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                        fullWidth
                        placeholder="Ej: Av. Santa Fe 1234, CABA"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <Input
                            label="Latitud (opcional)"
                            type="number"
                            step="any"
                            value={formData.latitude}
                            onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                            fullWidth
                            placeholder="Ej: -34.6037"
                        />
                        <Input
                            label="Longitud (opcional)"
                            type="number"
                            step="any"
                            value={formData.longitude}
                            onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                            fullWidth
                            placeholder="Ej: -58.3815"
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
                            {loading ? "Creando..." : "Crear Ubicación"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
