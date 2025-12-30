import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";

export async function GET() {
    try {
        const locations = await prisma.location.findMany({
            orderBy: { name: "asc" },
        });

        return NextResponse.json(locations);
    } catch (error) {
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
        const { name, address, latitude, longitude } = body;

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

