"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, MapPin, Clock, CalendarX, Package, Receipt, Wallet, ShoppingBag } from "lucide-react";

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
        label: "Productos",
        href: "/admin/cms/products",
        icon: ShoppingBag,
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

type SidebarProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside 
            className={`w-64 bg-white border-r border-stone-200 h-[calc(100vh-4rem)] fixed top-16 left-0 overflow-y-auto z-40 transition-transform duration-300 ease-in-out md:translate-x-0 ${
                isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
            <nav className="p-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center gap-4 px-4 py-3.5 rounded-none transition-all duration-200 cursor-pointer text-sm tracking-wide ${
                                isActive
                                    ? "bg-[#0b3a60] text-white font-medium shadow-sm"
                                    : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                            }`}
                        >
                            <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                                isActive ? "text-white" : "text-stone-400 group-hover:text-stone-600"
                            }`} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
