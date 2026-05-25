"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Scissors, LogOut, Loader2, Menu, X } from "lucide-react";
import type { AdminSession } from "@/core/domain/admin.types";

type AdminNavbarProps = {
    admin: AdminSession;
    isMenuOpen: boolean;
    onToggleMenu: () => void;
};

export default function AdminNavbar({ admin, isMenuOpen, onToggleMenu }: AdminNavbarProps) {
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
        <nav className="h-16 bg-white border-b border-stone-200 fixed top-0 left-0 right-0 z-50 shadow-sm">
            <div className="h-full px-4 sm:px-6 md:px-8 flex items-center justify-between max-w-full mx-auto">
                
                {/* Lado izquierdo: Hamburguesa + Logo Ventus */}
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* Botón de Hamburguesa en responsive */}
                    <button
                        onClick={onToggleMenu}
                        className="md:hidden p-2 text-stone-600 hover:bg-stone-50 hover:text-stone-900 border border-stone-200 rounded-none transition-colors cursor-pointer"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? (
                            <X className="w-5 h-5" />
                        ) : (
                            <Menu className="w-5 h-5" />
                        )}
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#0b3a60] rounded-none flex items-center justify-center">
                            <Scissors className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-base sm:text-lg font-bold tracking-tight text-stone-900">
                            Ventus <span className="font-light text-[#0b3a60]">CMS</span>
                        </h1>
                    </div>
                </div>

                {/* Lado derecho: Info de administrador + Cerrar Sesión */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-stone-50 rounded-none border border-stone-200">
                        <div className="w-8 h-8 bg-[#0b3a60] rounded-none flex items-center justify-center text-white font-bold text-sm">
                            {(admin.name || admin.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-stone-900">{admin.name || admin.email}</p>
                            <p className="text-[10px] text-stone-500 font-mono">{admin.email}</p>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleLogout}
                        disabled={loading}
                        className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-red-600 text-white font-semibold text-xs uppercase tracking-wider rounded-none hover:bg-red-700 disabled:opacity-50 transition-all cursor-pointer border border-red-600"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <LogOut className="w-4 h-4" />
                        )}
                        <span className="hidden sm:inline">Salir</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
