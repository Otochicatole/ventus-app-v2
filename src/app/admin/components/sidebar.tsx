"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
    LayoutDashboard,
    Calendar,
    MapPin,
    Clock,
    CalendarX,
    Scissors,
    Receipt,
    Wallet,
    ShoppingBag,
    History,
    LogOut,
    Loader2,
    ArrowUpRight,
    X,
} from "lucide-react";
import type { AdminSession } from "@/core/domain/admin.types";

interface NavGroup {
    title: string;
    items: {
        label: string;
        href: string;
        icon: React.ComponentType<{ className?: string }>;
    }[];
}

const navGroups: NavGroup[] = [
    {
        title: "General",
        items: [
            {
                label: "Dashboard",
                href: "/admin/cms",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        title: "Finanzas",
        items: [
            {
                label: "Cobros",
                href: "/admin/cms/payments",
                icon: Receipt,
            },
            {
                label: "Gastos",
                href: "/admin/cms/expenses",
                icon: Wallet,
            },
        ],
    },
    {
        title: "Turnos",
        items: [
            {
                label: "Turnos",
                href: "/admin/cms/shifts",
                icon: Calendar,
            },
            {
                label: "Historial",
                href: "/admin/cms/history",
                icon: History,
            },
        ],
    },
    {
        title: "Catálogo",
        items: [
            {
                label: "Servicios",
                href: "/admin/cms/services",
                icon: Scissors,
            },
            {
                label: "Productos",
                href: "/admin/cms/products",
                icon: ShoppingBag,
            },
        ],
    },
    {
        title: "Sucursales & Agenda",
        items: [
            {
                label: "Ubicaciones",
                href: "/admin/cms/locations",
                icon: MapPin,
            },
            {
                label: "Horarios",
                href: "/admin/cms/time-slots",
                icon: Clock,
            },
            {
                label: "Bloqueados",
                href: "/admin/cms/blocked-dates",
                icon: CalendarX,
            },
        ],
    },
];

type SidebarProps = {
    admin: AdminSession;
    isOpen: boolean;
    onClose: () => void;
};

export default function Sidebar({ admin, isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await fetch("/api/admin/logout", { method: "POST" });
            router.push("/admin/login");
            router.refresh();
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <aside
            className={`w-72 sm:w-64 bg-white border-r border-stone-200 h-dvh fixed top-0 left-0 z-50 md:z-30 transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col ${
                isOpen ? "translate-x-0 shadow-xl md:shadow-none" : "-translate-x-full"
            }`}
        >
            <div className="md:hidden shrink-0 h-14 px-4 border-b border-stone-200 flex items-center justify-between">
                <span className="text-sm font-semibold text-stone-900">Menú</span>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Cerrar menú"
                    className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
                {navGroups.map((group, groupIdx) => {
                    const headingId = `sidebar-group-${groupIdx}`;
                    return (
                        <div key={group.title} className="space-y-1">
                            <p
                                id={headingId}
                                className="px-3 text-[10px] font-bold tracking-widest uppercase text-stone-500 select-none"
                            >
                                {group.title}
                            </p>
                            <nav aria-labelledby={headingId} className="space-y-0.5 pt-1">
                                {group.items.map((item) => {
                                    const isActive =
                                        item.href === "/admin/cms"
                                            ? pathname === item.href
                                            : pathname === item.href ||
                                              pathname.startsWith(`${item.href}/`);
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={onClose}
                                            aria-current={isActive ? "page" : undefined}
                                            className={`group flex items-center gap-3 px-3 py-2.5 transition-colors duration-150 cursor-pointer text-xs sm:text-sm font-medium ${
                                                isActive
                                                    ? "bg-[#0b3a60] text-white font-semibold"
                                                    : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                                            }`}
                                        >
                                            <Icon
                                                className={`w-4 h-4 shrink-0 transition-colors ${
                                                    isActive
                                                        ? "text-white"
                                                        : "text-stone-400 group-hover:text-stone-700"
                                                }`}
                                            />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    );
                })}
            </div>

            <div className="shrink-0 p-3 border-t border-stone-200 bg-stone-50 space-y-2">
                <div className="flex items-center gap-2.5 px-2.5 py-2 bg-white border border-stone-200">
                    <div className="w-7 h-7 bg-[#0b3a60] flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {(admin.name || admin.email).charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 text-left">
                        <p className="text-xs font-semibold text-stone-900 leading-tight truncate">
                            {admin.name || admin.email}
                        </p>
                        <p className="text-[11px] text-stone-600 leading-tight">Admin</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <a
                        href="/"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-stone-700 hover:text-[#0b3a60] bg-white hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
                    >
                        <span>Ver Sitio</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                    </a>

                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        aria-label="Cerrar sesión"
                        className="flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-stone-700 hover:text-red-700 bg-white hover:bg-red-50 border border-stone-200 hover:border-red-200 transition-colors cursor-pointer"
                    >
                        {loggingOut ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-500 shrink-0" />
                        ) : (
                            <LogOut className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                        )}
                        <span>{loggingOut ? "Saliendo" : "Salir"}</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
