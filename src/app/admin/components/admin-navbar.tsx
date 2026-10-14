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
                        className="md:hidden p-2 text-stone-600 hover:bg-stone-50 hover:text-stone-900 border border-stone-200 rounded-lg transition-colors cursor-pointer"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? (
                            <X className="w-5 h-5" />
                        ) : (
                            <Menu className="w-5 h-5" />
                        )}
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#0b3a60] rounded-lg flex items-center justify-center text-white shadow-xs">
                            <Scissors className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-base sm:text-lg font-extrabold tracking-tight text-stone-900">
                                    VENTUS
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-widest bg-stone-100 text-[#0b3a60] px-1.5 py-0.5 rounded border border-stone-200">
                                    CMS
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lado derecho: Enlace a sitio + Info admin + Salir */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <a
                        href="/"
                        target="_blank"
                        rel="noreferrer"
                        className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-[#0b3a60] hover:bg-stone-50 rounded-lg border border-stone-200 transition-colors cursor-pointer"
                        title="Abrir sitio web público en una nueva pestaña"
                    >
                        <span>Ver Sitio</span>
                        <span className="text-[10px] text-stone-400">↗</span>
                    </a>

                    <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-stone-50/80 rounded-lg border border-stone-200">
                        <div className="w-7 h-7 bg-[#0b3a60] rounded-md flex items-center justify-center text-white font-bold text-xs">
                            {(admin.name || admin.email).charAt(0).toUpperCase()}
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-semibold text-stone-900 leading-tight truncate max-w-[140px]">
                                {admin.name || admin.email}
                            </p>
                            <p className="text-[10px] text-stone-400 leading-tight">Admin</p>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleLogout}
                        disabled={loading}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-stone-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200 font-semibold text-xs rounded-lg transition-all cursor-pointer border border-stone-200"
                        title="Cerrar sesión"
                    >
                        {loading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-500" />
                        ) : (
                            <LogOut className="w-3.5 h-3.5 text-stone-500 group-hover:text-red-600" />
                        )}
                        <span className="hidden sm:inline">Cerrar Sesión</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
