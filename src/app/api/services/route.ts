import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";

export async function GET() {
    try {
        const services = await prisma.service.findMany({
            orderBy: { name: "asc" },
        });

        return NextResponse.json(services);
    } catch (error) {
        return NextResponse.json(
            { error: "Error al obtener servicios" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await requireAuth();

        const body = await request.json();
        const { name, description, price, duration, active } = body;

        const service = await prisma.service.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                duration: parseInt(duration),
                active: active !== undefined ? active : true,
            },
        });

        return NextResponse.json(service, { status: 201 });
    } catch (error) {
        if (error instanceof Error && error.message.includes("autenticado")) {
            return NextResponse.json(
                { error: "No autorizado. Se requiere autenticación de admin." },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: "Error al crear servicio" },
            { status: 500 }
        );
    }
}

