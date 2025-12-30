"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Scissors, LogOut, Loader2 } from "lucide-react";
import type { AdminSession } from "@/core/domain/admin.types";

type AdminNavbarProps = {
    admin: AdminSession;
};

export default function AdminNavbar({ admin }: AdminNavbarProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        try {
            await fetch("/api/admin/logout", {
                method: "POST",
            });
            router.push("/admin/login");
            router.refresh();
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <nav className="h-16 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 shadow-sm">
            <div className="h-full px-6 md:px-8 flex items-center justify-between max-w-full mx-auto">
                <div className="flex items-center gap-4">
                    <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Scissors className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-lg md:text-xl font-bold text-gray-900 hidden sm:block">
                        Ventus CMS
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {admin.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">{admin.name}</p>
                            <p className="text-xs text-gray-500">{admin.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 disabled:opacity-50 transition-all cursor-pointer"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <LogOut className="w-5 h-5" />
                        )}
                        <span className="hidden sm:inline">Salir</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
