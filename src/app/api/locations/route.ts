import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { parseAndValidateCoordinates } from "@/lib/coordinates";

export async function GET() {
    try {
        const locations = await prisma.location.findMany({
            orderBy: { name: "asc" },
            include: {
                _count: {
                    select: {
                        timeSlots: true,
                    },
                },
            },
        });

        return NextResponse.json(locations);
    } catch {
        return NextResponse.json(
            { error: "Error al obtener ubicaciones" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await requireAuth();

        const body = await request.json();
        const { name, address, latitude: rawLatitude, longitude: rawLongitude } = body;

        const { latitude, longitude, error: coordError } = parseAndValidateCoordinates(
            rawLatitude,
            rawLongitude
        );
        if (coordError) {
            return NextResponse.json({ error: coordError }, { status: 400 });
        }

        const location = await prisma.location.create({
            data: {
                name,
                address,
                latitude,
                longitude,
            },
        });

        return NextResponse.json(location, { status: 201 });
    } catch (error) {
        if (error instanceof Error && error.message.includes("autenticado")) {
            return NextResponse.json(
                { error: "No autorizado. Se requiere autenticación de admin." },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: "Error al crear ubicación" },
            { status: 500 }
        );
    }
}

