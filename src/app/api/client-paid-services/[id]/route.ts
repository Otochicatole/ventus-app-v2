import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAuth();

        const { id } = await params;
        const record = await prisma.clientPaidService.findUnique({
            where: { id },
        });

        if (!record) {
            return NextResponse.json(
                { error: "Cobro no encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json(record);
    } catch (error) {
        if (error instanceof Error && error.message.includes("autenticado")) {
            return NextResponse.json(
                { error: "No autorizado. Se requiere autenticación de admin." },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: "Error al obtener cobro" },
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
        const { fullName, payment, description, servicesPerformed, paidAt } = body;

        const record = await prisma.clientPaidService.update({
            where: { id },
            data: {
                fullName,
                payment: parseFloat(payment),
                description: description || null,
                servicesPerformed: servicesPerformed || [],
                ...(paidAt && { paidAt: new Date(paidAt + "T12:00:00.000Z") }),
            },
        });

        return NextResponse.json(record);
    } catch (error) {
        if (error instanceof Error && error.message.includes("autenticado")) {
            return NextResponse.json(
                { error: "No autorizado. Se requiere autenticación de admin." },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: "Error al actualizar cobro" },
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
        await prisma.clientPaidService.delete({
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
            { error: "Error al eliminar cobro" },
            { status: 500 }
        );
    }
}

