"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type LoginCredentials = {
    email: string;
    password: string;
};

type UseAuthReturn = {
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
    error: string | null;
};

export function useAuth(): UseAuthReturn {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (credentials: LoginCredentials) => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Error al iniciar sesión");
            }

            router.push("/admin/cms");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al iniciar sesión");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            setError(null);

            await fetch("/api/admin/logout", {
                method: "POST",
            });

            router.push("/admin/login");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cerrar sesión");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        login,
        logout,
        loading,
        error,
    };
}

