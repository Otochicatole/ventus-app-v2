"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
        <nav className="h-16 bg-neutral-950 border-b border-neutral-800 sticky top-0 z-50">
            <div className="h-full px-6 md:px-8 flex items-center justify-between max-w-screen-2xl mx-auto">
                <div className="flex items-center gap-4">
                    <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                    </div>
                    <h1 className="text-lg md:text-xl font-bold text-white hidden sm:block">
                        Ventus CMS
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-3 px-4 py-2.5 bg-neutral-900 rounded-lg border border-neutral-800">
                        <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center text-black font-bold text-sm">
                            {admin.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">{admin.name}</p>
                            <p className="text-xs text-neutral-500">{admin.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all cursor-pointer"
                    >
                        {loading ? (
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                            </svg>
                        )}
                        <span className="hidden sm:inline">Salir</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
