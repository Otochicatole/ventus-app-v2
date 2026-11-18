"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu } from "lucide-react";
import Sidebar from "../components/sidebar";
import type { AdminSession } from "@/core/domain/admin.types";

export default function CMSLayoutWrapper({
    admin,
    children,
}: {
    admin: AdminSession;
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [openPathname, setOpenPathname] = useState<string | null>(null);
    const isMobileMenuOpen = openPathname === pathname;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const toggleMobileMenu = () => {
        setOpenPathname((prev) => (prev === pathname ? null : pathname));
    };

    const closeMobileMenu = () => {
        setOpenPathname(null);
    };

    return (
        <div className="admin-cms-root min-h-dvh bg-stone-50 overflow-x-hidden text-stone-900 font-sans">
            {/* Barra móvil únicamente para abrir la navegación lateral */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-stone-200 z-20 px-4 flex items-center justify-between">
                <button
                    type="button"
                    onClick={toggleMobileMenu}
                    aria-expanded={isMobileMenuOpen}
                    aria-label="Abrir menú de navegación"
                    className="p-2 text-stone-700 hover:bg-stone-50 hover:text-stone-900 border border-stone-200 transition-colors cursor-pointer"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                    <Image src="/logo.svg" alt="" width={20} height={20} className="w-5 h-5 block" />
                    <span className="text-sm font-bold text-stone-900">Ventus</span>
                </div>
            </div>

            <div className="pt-14 md:pt-0">
                <Sidebar
                    admin={admin}
                    isOpen={isMobileMenuOpen}
                    onClose={closeMobileMenu}
                />

                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/30 z-40 md:hidden transition-opacity duration-200"
                        onClick={closeMobileMenu}
                    />
                )}

                <main className="md:ml-64 px-3 py-4 pb-8 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-10 lg:py-10 md:pb-10 lg:pb-12 min-h-[calc(100dvh-3.5rem)] md:min-h-dvh">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
