import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAuth();

        const { id } = await params;
        const body = await request.json();
        const { notes } = body;

        const shift = await prisma.shift.update({
            where: { id },
            data: { notes },
            include: {
                location: true,
            },
        });

        return NextResponse.json(shift);
    } catch (error) {
        if (error instanceof Error && error.message.includes("autenticado")) {
            return NextResponse.json(
                { error: "No autorizado. Se requiere autenticación de admin." },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: "Error al actualizar notas del turno" },
            { status: 500 }
        );
    }
}

