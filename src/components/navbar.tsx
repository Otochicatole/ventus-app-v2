"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Calendar, Info, Sparkles } from "lucide-react";

const pages = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Reservar", href: "/shifts", icon: Calendar },
    { name: "Nosotros", href: "/#nosotros", icon: Info },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(10,10,10,0.95)] backdrop-blur-md border-b border-[rgba(255,215,0,0.1)] shadow-lg">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-2 text-2xl font-black">
                            <svg className="w-8 h-8 text-[#FFD700]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3z" />
                            </svg>
                            <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                                VENTUS
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center gap-6">
                            <Link
                                href="/"
                                className="text-white font-semibold hover:text-[#FFD700] transition-colors"
                            >
                                Inicio
                            </Link>
                            <Link
                                href="/#servicios"
                                className="text-white font-semibold hover:text-[#FFD700] transition-colors"
                            >
                                Servicios
                            </Link>
                            <Link
                                href="/#nosotros"
                                className="text-white font-semibold hover:text-[#FFD700] transition-colors"
                            >
                                Nosotros
                            </Link>
                        </div>

                        <Link
                            href="/shifts"
                            className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold rounded-md hover:from-[#FFA500] hover:to-[#FF8C00] transition-all shadow-lg"
                        >
                            <Calendar className="w-5 h-5" />
                            Reservar
                        </Link>
                    </div>
                </div>
            </nav>

            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[rgba(10,10,10,0.98)] backdrop-blur-md border-t border-[rgba(255,215,0,0.1)] shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
                <div className="grid grid-cols-3 h-16">
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
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-b-full" />
                                )}
                                <Icon 
                                    className={`w-6 h-6 transition-colors ${
                                        isActive ? "text-[#FFD700]" : "text-neutral-400 group-hover:text-[#FFD700]"
                                    }`}
                                />
                                <span 
                                    className={`text-xs font-medium transition-colors ${
                                        isActive ? "text-[#FFD700]" : "text-neutral-400 group-hover:text-[#FFD700]"
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
