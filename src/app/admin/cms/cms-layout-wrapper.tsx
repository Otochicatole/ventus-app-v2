"use client";

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
    return (
        <div className="min-h-screen bg-black">
            <AdminNavbar admin={admin} />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-8 md:p-10 lg:p-12 min-h-[calc(100vh-4rem)] overflow-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
