"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Scissors, Package } from "lucide-react";

const pages = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Servicios", href: "/#services-section", icon: Package },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-3 text-xl font-bold tracking-tight select-none">
                            <div className="w-8 h-8 bg-[#0b3a60] rounded-none flex items-center justify-center">
                                <Scissors className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-stone-900 font-extrabold uppercase tracking-widest text-lg group-hover:text-[#0b3a60] transition-colors">
                                VENTUS
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center gap-8">
                            <Link
                                href="/"
                                className="text-stone-600 text-sm font-semibold tracking-wide hover:text-[#0b3a60] transition-colors uppercase"
                            >
                                Inicio
                            </Link>
                            <Link
                                href="/#services-section"
                                className="text-stone-600 text-sm font-semibold tracking-wide hover:text-[#0b3a60] transition-colors uppercase"
                            >
                                Servicios
                            </Link>
                        </div>

                        <div className="hidden md:flex items-center">
                            <span className="text-xs font-bold uppercase tracking-widest text-[#0b3a60] select-none">
                                Barbería Premium
                            </span>
                        </div>
                    </div>
                </div>
            </nav>

            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-sm">
                <div className="grid grid-cols-2 h-16">
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
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-[#0b3a60] rounded-none" />
                                )}
                                <Icon 
                                    className={`w-5 h-5 transition-colors ${
                                        isActive ? "text-[#0b3a60]" : "text-stone-400 group-hover:text-[#0b3a60]"
                                    }`}
                                />
                                <span 
                                    className={`text-[10px] font-semibold tracking-wider uppercase transition-colors ${
                                        isActive ? "text-[#0b3a60]" : "text-stone-400 group-hover:text-[#0b3a60]"
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
