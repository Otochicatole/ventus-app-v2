import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const service = await prisma.service.findUnique({
            where: { id },
        });

        if (!service) {
            return NextResponse.json(
                { error: "Servicio no encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json(service);
    } catch (error) {
        return NextResponse.json(
            { error: "Error al obtener servicio" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAuth();

        const { id } = await params;
        const body = await request.json();
        const { name, description, price, duration, active } = body;

        const service = await prisma.service.update({
            where: { id },
            data: {
                name,
                description,
                price: parseFloat(price),
                duration: parseInt(duration),
                active,
            },
        });

        return NextResponse.json(service);
    } catch (error) {
        if (error instanceof Error && error.message.includes("autenticado")) {
            return NextResponse.json(
                { error: "No autorizado. Se requiere autenticación de admin." },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: "Error al actualizar servicio" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAuth();

        const { id } = await params;

        await prisma.service.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        if (error instanceof Error && error.message.includes("autenticado")) {
            return NextResponse.json(
                { error: "No autorizado. Se requiere autenticación de admin." },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: "Error al eliminar servicio" },
            { status: 500 }
        );
    }
}

