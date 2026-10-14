import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";

export async function GET(request: Request) {
    try {
        await requireAuth();

        const { searchParams } = new URL(request.url);
        const dateStr = searchParams.get("date");

        const where: Record<string, unknown> = {};

        if (dateStr) {
            const [year, month, day] = dateStr.split("-").map(Number);
            const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
            const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
            where.paidAt = { gte: startOfDay, lte: endOfDay };
        }

        const records = await prisma.clientPaidService.findMany({
            where,
            orderBy: { paidAt: "desc" },
        });

        return NextResponse.json(records);
    } catch (error) {
        if (error instanceof Error && error.message.includes("autenticado")) {
            return NextResponse.json(
                { error: "No autorizado. Se requiere autenticación de admin." },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: "Error al obtener cobros" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await requireAuth();

        const body = await request.json();
        const { fullName, payment, description, servicesPerformed, productsBought, paidAt } = body;

        const record = await prisma.clientPaidService.create({
            data: {
                fullName,
                payment: parseFloat(payment),
                description: description || null,
                servicesPerformed: servicesPerformed || [],
                productsBought: productsBought || [],
                paidAt: paidAt ? new Date(paidAt + "T12:00:00.000Z") : new Date(),
            },
        });

        return NextResponse.json(record, { status: 201 });
    } catch (error) {
        if (error instanceof Error && error.message.includes("autenticado")) {
            return NextResponse.json(
                { error: "No autorizado. Se requiere autenticación de admin." },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: "Error al crear cobro" },
            { status: 500 }
        );
    }
}

