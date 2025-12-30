import { redirect } from "next/navigation";
import { getAuthCookie } from "@/lib/cookies";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import AdminNavbar from "../components/admin-navbar";
import Sidebar from "../components/sidebar";

export default async function CMSLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const token = await getAuthCookie();

    if (!token) {
        redirect("/admin/login");
    }

    const payload = await verifyToken(token);

    if (!payload) {
        redirect("/admin/login");
    }

    const admin = await prisma.admin.findUnique({
        where: { id: payload.adminId },
        select: {
            id: true,
            email: true,
            name: true,
        },
    });

    if (!admin) {
        redirect("/admin/login");
    }

    return (
        <div className="min-h-screen bg-neutral-900">
            <AdminNavbar
                admin={{
                    adminId: admin.id,
                    email: admin.email,
                    name: admin.name,
                }}
            />
            <div style={{ display: "flex" }}>
                <Sidebar />
                <main style={{ flex: 1, minHeight: "calc(100vh - 64px)" }}>
                    {children}
                </main>
            </div>
        </div>
    );
}

