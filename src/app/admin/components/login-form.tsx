"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Alert from "@/components/ui/alert";

export default function LoginForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Error al iniciar sesión");
            }

            router.push("/admin/cms");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <Alert severity="error">
                    {error}
                </Alert>
            )}

            <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                fullWidth
                autoFocus
                placeholder="admin@ventus.com"
            />

            <Input
                label="Contraseña"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                fullWidth
                placeholder="••••••••"
            />

            <Button
                type="submit"
                size="large"
                fullWidth
                loading={loading}
                disabled={loading}
                startIcon={!loading && <Lock className="w-5 h-5" />}
            >
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
        </form>
    );
}
