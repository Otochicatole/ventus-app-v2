"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
    {
        label: "Dashboard",
        href: "/admin/cms",
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
        ),
    },
    {
        label: "Turnos",
        href: "/admin/cms/shifts",
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
        ),
    },
    {
        label: "Ubicaciones",
        href: "/admin/cms/locations",
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
        ),
    },
    {
        label: "Horarios",
        href: "/admin/cms/time-slots",
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
        ),
    },
    {
        label: "Fechas Bloqueadas",
        href: "/admin/cms/blocked-dates",
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
            </svg>
        ),
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-20 md:w-64 bg-neutral-950 border-r border-neutral-800 h-screen sticky top-0">
            <nav className="p-4 space-y-3">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
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
                            <span className="flex-shrink-0">
                                {item.icon}
                            </span>
                            <span className="hidden md:block">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
