"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, MapPin, Clock, CalendarX } from "lucide-react";

const menuItems = [
    {
        label: "Dashboard",
        href: "/admin/cms",
        icon: LayoutDashboard,
    },
    {
        label: "Turnos",
        href: "/admin/cms/shifts",
        icon: Calendar,
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
            <aside className="hidden md:block w-64 bg-neutral-950 border-r border-neutral-800 h-screen sticky top-0">
                <nav className="p-4 space-y-3">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-lg transition-all duration-200 cursor-pointer ${
                                    isActive
                                        ? "bg-white text-black font-semibold"
                                        : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                                }`}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[rgba(10,10,10,0.98)] backdrop-blur-md border-t border-neutral-800 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
                <div className="grid grid-cols-5 h-16">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex flex-col items-center justify-center gap-1 relative group"
                            >
                                {isActive && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-white rounded-b-full" />
                                )}
                                <Icon 
                                    className={`w-5 h-5 transition-colors ${
                                        isActive ? "text-white" : "text-neutral-500 group-hover:text-white"
                                    }`}
                                />
                                <span 
                                    className={`text-[10px] font-medium transition-colors ${
                                        isActive ? "text-white" : "text-neutral-500 group-hover:text-white"
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
