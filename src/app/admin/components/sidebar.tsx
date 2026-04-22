"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, MapPin, Clock, CalendarX, Package, Receipt, Wallet } from "lucide-react";

const menuItems = [
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
        label: "Servicios",
        href: "/admin/cms/services",
        icon: Package,
    },
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
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <>
            <aside className="hidden md:block w-64 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] fixed top-16 left-0 overflow-y-auto">
                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 cursor-pointer ${isActive
                                        ? "bg-blue-600 text-white font-semibold shadow-sm"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                    }`}
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                <div className="flex h-16 overflow-x-auto scrollbar-none">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex min-w-17 flex-1 flex-col items-center justify-center gap-1 relative group"
                            >
                                {isActive && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-blue-600 rounded-b-full" />
                                )}
                                <Icon
                                    className={`w-5 h-5 transition-colors ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                                        }`}
                                />
                                <span
                                    className={`text-[10px] font-medium whitespace-nowrap transition-colors ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                                        }`}
                                >
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
