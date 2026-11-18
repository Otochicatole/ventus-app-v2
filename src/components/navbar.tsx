"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Home, Scissors, ShoppingBag, Calendar } from "lucide-react";

type LocationWithSlots = {
    id: string;
    _count?: {
        timeSlots?: number;
    };
};

const baseLinks = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Servicios", href: "/services", icon: Scissors },
    { name: "Productos", href: "/products", icon: ShoppingBag },
];

export default function Navbar() {
    const pathname = usePathname();
    const [hasBookingTimeSlots, setHasBookingTimeSlots] = useState(false);

    useEffect(() => {
        let active = true;
        const checkTimeSlots = async () => {
            try {
                const res = await fetch("/api/locations", { cache: "no-store" });
                if (!res.ok) return;
                const data: LocationWithSlots[] = await res.json();
                if (active) {
                    setHasBookingTimeSlots(
                        Array.isArray(data) &&
                            data.some((loc) => (loc._count?.timeSlots ?? 0) > 0)
                    );
                }
            } catch {
                // Keep booking CTAs hidden if availability cannot be verified
            }
        };

        checkTimeSlots();
        return () => {
            active = false;
        };
    }, [pathname]);

    const mobileLinks = hasBookingTimeSlots
        ? [...baseLinks, { name: "Turnos", href: "/shifts", icon: Calendar }]
        : baseLinks;

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
                        {baseLinks.map((link) => {
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
                        {hasBookingTimeSlots && (
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
                        )}
                    </div>

                    <div className="flex items-center">
                        {hasBookingTimeSlots ? (
                            <Link
                                href="/shifts"
                                className="px-4 py-2 bg-[#0b3a60] text-white text-sm font-semibold hover:bg-[#082a46] transition-colors"
                            >
                                Reservar turno
                            </Link>
                        ) : (
                            <Link
                                href="/services"
                                className="px-4 py-2 bg-[#0b3a60] text-white text-sm font-semibold hover:bg-[#082a46] transition-colors"
                            >
                                Ver servicios
                            </Link>
                        )}
                    </div>
                </nav>
            </header>

            <nav
                aria-label="Navegación móvil"
                className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-stone-100"
            >
                <div className={`grid ${hasBookingTimeSlots ? "grid-cols-4" : "grid-cols-3"} h-16`}>
                    {mobileLinks.map((page) => {
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
                                    className={`text-[13px] font-medium transition-colors ${
                                        isActive ? "text-[#0b3a60] font-semibold" : "text-stone-700"
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
