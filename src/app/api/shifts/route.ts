import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";

export async function GET(request: Request) {
    try {
        await requireAuth();

        const { searchParams } = new URL(request.url);
        const locationId = searchParams.get("locationId");
        const email = searchParams.get("email");

        const where: any = {};
        if (locationId) where.locationId = locationId;
        if (email) where.email = email;

        const shifts = await prisma.shift.findMany({
            where,
            include: {
                location: true,
            },
            orderBy: [{ date: "asc" }, { time: "asc" }],
        });

        return NextResponse.json(shifts);
    } catch (error) {
        if (error instanceof Error && error.message.includes("autenticado")) {
            return NextResponse.json(
                { error: "No autorizado. Se requiere autenticación de admin." },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: "Error al obtener turnos" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, lastName, email, phone, date, time, locationId } = body;

        const [year, month, day] = date.split("-").map(Number);
        const dateObj = new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));
        const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
        const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

        const isDateBlocked = await prisma.unavailableDate.findFirst({
            where: {
                locationId,
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
        });

        if (isDateBlocked) {
            return NextResponse.json(
                { error: "La fecha seleccionada no está disponible" },
                { status: 400 }
            );
        }

        const confirmedShift = await prisma.shift.findFirst({
            where: {
                locationId,
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
                time,
                confirmed: true,
            },
        });

        if (confirmedShift) {
            return NextResponse.json(
                { error: "El horario seleccionado ya está ocupado por un turno confirmado" },
                { status: 400 }
            );
        }

        const shift = await prisma.shift.create({
            data: {
                name,
                lastName,
                email,
                phone,
                date: dateObj,
                time,
                locationId,
            },
            include: {
                location: true,
            },
        });

        return NextResponse.json(shift, { status: 201 });
    } catch (error: any) {
        if (error.code === "P2002") {
            return NextResponse.json(
                { error: "El horario seleccionado ya está ocupado" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Error al crear turno" },
            { status: 500 }
        );
    }
}

