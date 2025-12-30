"use client";

import { useState } from "react";
import Link from "next/link";

const pages = [
    { name: "Inicio", href: "/" },
    { name: "Servicios", href: "/#servicios" },
    { name: "Nosotros", href: "/#nosotros" },
];

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(10,10,10,0.95)] backdrop-blur-md border-b border-[rgba(255,215,0,0.1)] shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-2 text-2xl font-black">
                        <svg className="w-8 h-8 text-[#FFD700]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3z" />
                        </svg>
                        <span className="hidden md:block bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                            VENTUS
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6">
                        {pages.map((page) => (
                            <Link
                                key={page.name}
                                href={page.href}
                                className="text-white font-semibold hover:text-[#FFD700] transition-colors"
                            >
                                {page.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/shifts"
                            className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold rounded-md hover:from-[#FFA500] hover:to-[#FF8C00] transition-all shadow-lg"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                            </svg>
                            Reservar
                        </Link>

                        <button
                            type="button"
                            className="md:hidden text-[#FFD700] p-2"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-neutral-800">
                        {pages.map((page) => (
                            <Link
                                key={page.name}
                                href={page.href}
                                className="block py-2 text-white hover:text-[#FFD700] transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {page.name}
                            </Link>
                        ))}
                        <Link
                            href="/shifts"
                            className="block mt-3 px-4 py-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold rounded-md text-center"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Reservar Turno
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
