import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";

export async function GET(request: Request) {
    try {
        await requireAuth();

        const { searchParams } = new URL(request.url);
        const locationId = searchParams.get("locationId");

        const where = locationId ? { locationId } : {};

        const timeSlots = await prisma.timeSlot.findMany({
            where,
            include: {
                location: true,
            },
            orderBy: { time: "asc" },
        });

        return NextResponse.json(timeSlots);
    } catch (error) {
        if (error instanceof Error && error.message.includes("autenticado")) {
            return NextResponse.json(
                { error: "No autorizado. Se requiere autenticación de admin." },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: "Error al obtener horarios" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await requireAuth();

        const body = await request.json();
        const { time, locationId } = body;

        const timeSlot = await prisma.timeSlot.create({
            data: {
                time,
                locationId,
            },
        });

        return NextResponse.json(timeSlot, { status: 201 });
    } catch (error) {
        if (error instanceof Error && error.message.includes("autenticado")) {
            return NextResponse.json(
                { error: "No autorizado. Se requiere autenticación de admin." },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: "Error al crear horario" },
            { status: 500 }
        );
    }
}

