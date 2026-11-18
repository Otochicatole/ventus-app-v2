"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Home, Scissors, ShoppingBag, Calendar } from "lucide-react";

const navLinks = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Servicios", href: "/services", icon: Scissors },
    { name: "Productos", href: "/products", icon: ShoppingBag },
    { name: "Turnos", href: "/shifts", icon: Calendar },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-stone-100">
                <nav
                    aria-label="Navegación principal"
                    className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6"
                >
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-stone-900 select-none"
                    >
                        <Image
                            src="/logo.svg"
                            alt=""
                            width={28}
                            height={28}
                            className="w-7 h-7 block"
                        />
                        <span>Ventus</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-7">
                        {navLinks.slice(0, 3).map((link) => {
                            const isActive =
                                link.href === "/"
                                    ? pathname === "/"
                                    : pathname === link.href || pathname?.startsWith(`${link.href}/`);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    aria-current={isActive ? "page" : undefined}
                                    className={`text-sm font-medium transition-colors ${
                                        isActive
                                            ? "text-[#0b3a60] font-semibold"
                                            : "text-stone-700 hover:text-stone-950"
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                        <Link
                            href="/confirmed-shifts"
                            aria-current={pathname === "/confirmed-shifts" ? "page" : undefined}
                            className={`text-sm font-medium transition-colors ${
                                pathname === "/confirmed-shifts"
                                    ? "text-[#0b3a60] font-semibold"
                                    : "text-stone-700 hover:text-stone-950"
                            }`}
                        >
                            Agenda
                        </Link>
                    </div>

                    <div className="flex items-center">
                        <Link
                            href="/shifts"
                            className="px-4 py-2 bg-[#0b3a60] text-white text-sm font-semibold hover:bg-[#082a46] transition-colors"
                        >
                            Reservar turno
                        </Link>
                    </div>
                </nav>
            </header>

            <nav
                aria-label="Navegación móvil"
                className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-stone-100"
            >
                <div className="grid grid-cols-4 h-16">
                    {navLinks.map((page) => {
                        const isActive =
                            page.href === "/"
                                ? pathname === "/"
                                : pathname === page.href || pathname?.startsWith(`${page.href}/`);
                        const Icon = page.icon;

                        return (
                            <Link
                                key={page.name}
                                href={page.href}
                                aria-current={isActive ? "page" : undefined}
                                className="flex flex-col items-center justify-center gap-1 relative"
                            >
                                {isActive && (
                                    <span
                                        aria-hidden="true"
                                        className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-[#0b3a60]"
                                    />
                                )}
                                <Icon
                                    className={`w-5 h-5 transition-colors ${
                                        isActive ? "text-[#0b3a60]" : "text-stone-500"
                                    }`}
                                />
                                <span
                                    className={`text-xs font-medium transition-colors ${
                                        isActive ? "text-[#0b3a60] font-semibold" : "text-stone-600"
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
