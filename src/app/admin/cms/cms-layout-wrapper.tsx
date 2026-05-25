"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AdminNavbar from "../components/admin-navbar";
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Cerrar automáticamente el menú lateral responsive al cambiar de ruta
    useEffect(() => {
        setIsMobileMenuOpen(false);
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="admin-cms-root min-h-screen bg-stone-50 overflow-x-hidden text-stone-900 font-sans">
            {/* Top Navigation Navbar */}
            <AdminNavbar 
                admin={admin} 
                isMenuOpen={isMobileMenuOpen} 
                onToggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            />
            
            <div className="pt-16">
                {/* Responsive Slide-Out Sidebar Drawer */}
                <Sidebar 
                    isOpen={isMobileMenuOpen} 
                    onClose={() => setIsMobileMenuOpen(false)} 
                />
                
                {/* Backdrop oscurecido para pantallas móviles cuando el menú está abierto */}
                {isMobileMenuOpen && (
                    <div 
                        className="fixed inset-0 bg-black/25 backdrop-blur-xs z-30 md:hidden transition-all duration-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                {/* Área de Contenido Principal */}
                <main className="md:ml-64 px-4 py-6 pb-20 md:px-6 md:py-8 lg:px-10 lg:py-10 md:pb-10 lg:pb-12 min-h-[calc(100vh-4rem)]">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
