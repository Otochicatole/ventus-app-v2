"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

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
        title: "Operaciones",
        items: [
            {
                label: "Dashboard",
                href: "/admin/cms",
                icon: LayoutDashboard,
            },
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
    isOpen: boolean;
    onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside 
            className={`w-64 bg-white border-r border-stone-200 h-[calc(100vh-4rem)] fixed top-16 left-0 overflow-y-auto z-40 transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col justify-between ${
                isOpen ? "translate-x-0 shadow-xl md:shadow-none" : "-translate-x-full"
            }`}
        >
            <div className="p-3.5 space-y-6">
                {navGroups.map((group, groupIdx) => (
                    <div key={groupIdx} className="space-y-1">
                        <span className="px-3 text-[10px] font-bold tracking-widest uppercase text-stone-400 select-none">
                            {group.title}
                        </span>
                        <nav className="space-y-0.5 pt-1">
                            {group.items.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={onClose}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 cursor-pointer text-xs sm:text-sm font-medium ${
                                            isActive
                                                ? "bg-[#0b3a60] text-white shadow-xs font-semibold"
                                                : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                                        }`}
                                    >
                                        <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                                            isActive ? "text-white" : "text-stone-400 group-hover:text-stone-700"
                                        }`} />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-stone-100 bg-stone-50/50">
                <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span className="font-semibold text-stone-700">Ventus Barbershop</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                        En línea
                    </span>
                </div>
            </div>
        </aside>
    );
}
