import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const location = await prisma.location.findUnique({
            where: { id },
            include: {
                timeSlots: true,
            },
        });

        if (!location) {
            return NextResponse.json(
                { error: "Ubicación no encontrada" },
                { status: 404 }
            );
        }

        return NextResponse.json(location);
    } catch (error) {
        return NextResponse.json(
            { error: "Error al obtener ubicación" },
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
        const { name, address, latitude, longitude } = body;

        const location = await prisma.location.update({
            where: { id },
            data: {
                name,
                address,
                latitude,
                longitude,
            },
        });

        return NextResponse.json(location);
    } catch (error) {
        if (error instanceof Error && error.message.includes("autenticado")) {
            return NextResponse.json(
                { error: "No autorizado. Se requiere autenticación de admin." },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: "Error al actualizar ubicación" },
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

        await prisma.$transaction([
            prisma.shift.deleteMany({
                where: { locationId: id },
            }),
            prisma.timeSlot.deleteMany({
                where: { locationId: id },
            }),
            prisma.unavailableDate.deleteMany({
                where: { locationId: id },
            }),
            prisma.location.delete({
                where: { id },
            }),
        ]);

        return NextResponse.json({ success: true });
    } catch (error) {
        if (error instanceof Error && error.message.includes("autenticado")) {
            return NextResponse.json(
                { error: "No autorizado. Se requiere autenticación de admin." },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: "Error al eliminar ubicación" },
            { status: 500 }
        );
    }
}

