"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import AdminNavbar from "../components/admin-navbar";
import Sidebar from "../components/sidebar";

type Admin = {
    adminId: string;
    email: string;
    name: string;
};

export default function CMSLayoutWrapper({
    admin,
    children,
}: {
    admin: Admin;
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return (
        <div className="min-h-screen bg-gray-50 overflow-x-hidden">
            <AdminNavbar admin={admin} />
            <div className="pt-16">
                <Sidebar />
                <main className="md:ml-64 px-4 py-6 pb-20 md:px-6 md:py-8 lg:px-10 lg:py-10 md:pb-10 lg:pb-12 min-h-[calc(100vh-4rem)]">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
