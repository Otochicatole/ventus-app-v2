"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Calendar, Info, Scissors, Users } from "lucide-react";

const pages = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Reservar", href: "/shifts", icon: Calendar },
    { name: "Turnos", href: "/confirmed-shifts", icon: Users },
    { name: "Nosotros", href: "/#nosotros", icon: Info },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-2 text-2xl font-black">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Scissors className="w-5 h-5 text-white" />
                            </div>
                            <span className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                                VENTUS
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center gap-6">
                            <Link
                                href="/"
                                className="text-gray-700 font-semibold hover:text-blue-600 transition-colors"
                            >
                                Inicio
                            </Link>
                            <Link
                                href="/#servicios"
                                className="text-gray-700 font-semibold hover:text-blue-600 transition-colors"
                            >
                                Servicios
                            </Link>
                            <Link
                                href="/confirmed-shifts"
                                className="text-gray-700 font-semibold hover:text-blue-600 transition-colors"
                            >
                                Turnos Confirmados
                            </Link>
                            <Link
                                href="/#nosotros"
                                className="text-gray-700 font-semibold hover:text-blue-600 transition-colors"
                            >
                                Nosotros
                            </Link>
                        </div>

                        <Link
                            href="/shifts"
                            className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-sm"
                        >
                            <Calendar className="w-5 h-5" />
                            Reservar
                        </Link>
                    </div>
                </div>
            </nav>

            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
                <div className="grid grid-cols-4 h-16">
                    {pages.map((page) => {
                        const isActive = pathname === page.href || (page.href !== "/" && pathname?.startsWith(page.href));
                        const Icon = page.icon;
                        
                        return (
                            <Link
                                key={page.name}
                                href={page.href}
                                className="flex flex-col items-center justify-center gap-1 relative group"
                            >
                                {isActive && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-b-full" />
                                )}
                                <Icon 
                                    className={`w-6 h-6 transition-colors ${
                                        isActive ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"
                                    }`}
                                />
                                <span 
                                    className={`text-xs font-medium transition-colors ${
                                        isActive ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"
                                    }`}
                                >
                                    {page.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
