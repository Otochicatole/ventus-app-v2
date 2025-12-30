import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthCookie } from "@/lib/cookies";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
    try {
        const token = await getAuthCookie();

        if (!token) {
            return NextResponse.json(
                { error: "No autenticado" },
                { status: 401 }
            );
        }

        const payload = await verifyToken(token);

        if (!payload) {
            return NextResponse.json(
                { error: "Token inválido" },
                { status: 401 }
            );
        }

        const admin = await prisma.admin.findUnique({
            where: { id: payload.adminId },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            },
        });

        if (!admin) {
            return NextResponse.json(
                { error: "Admin no encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json({ admin });
    } catch (error) {
        console.error("Error en /me:", error);
        return NextResponse.json(
            { error: "Error al obtener información del admin" },
            { status: 500 }
        );
    }
}

