import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const locationId = searchParams.get("locationId");

        const where = locationId ? { locationId } : {};

        const unavailableDates = await prisma.unavailableDate.findMany({
            where,
            orderBy: { date: "asc" },
        });

        return NextResponse.json(unavailableDates);
    } catch (error) {
        return NextResponse.json(
            { error: "Error al obtener fechas bloqueadas" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await requireAuth();

        const body = await request.json();
        const { date, locationId } = body;

        const dateObj = new Date(date + "T12:00:00.000Z");

        const unavailableDate = await prisma.unavailableDate.create({
            data: {
                date: dateObj,
                locationId,
            },
        });

        return NextResponse.json(unavailableDate, { status: 201 });
    } catch (error) {
        if (error instanceof Error && error.message.includes("autenticado")) {
            return NextResponse.json(
                { error: "No autorizado. Se requiere autenticación de admin." },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: "Error al bloquear fecha" },
            { status: 500 }
        );
    }
}

