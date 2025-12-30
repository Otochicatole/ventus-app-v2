"use client";

import { useState, useEffect } from "react";
import type { Admin } from "@/core/domain/admin.types";

type UseAdminReturn = {
    admin: Admin | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
};

export function useAdmin(): UseAdminReturn {
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAdmin = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch("/api/admin/me");

            if (!res.ok) {
                throw new Error("No autenticado");
            }

            const data = await res.json();
            setAdmin(data.admin);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cargar admin");
            setAdmin(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmin();
    }, []);

    return {
        admin,
        loading,
        error,
        refetch: fetchAdmin,
    };
}

