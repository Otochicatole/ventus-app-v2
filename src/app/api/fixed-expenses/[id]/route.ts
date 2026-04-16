import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";
import { parseDateInputToUtcMidday, parseMoneyAmount } from "@/features/expenses/domain/finance";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAuth();

        const { id } = await params;
        const body = await request.json();
        const name = typeof body.name === "string" ? body.name.trim() : "";
        const amount = parseMoneyAmount(body.amount);
        const startsAt = parseDateInputToUtcMidday(body.startsAt);

        if (!name) {
            return NextResponse.json(
                { error: "El nombre del gasto fijo es obligatorio" },
                { status: 400 }
            );
        }

        if (amount === null) {
            return NextResponse.json({ error: "El monto del gasto fijo es inválido" }, { status: 400 });
        }

        if (!startsAt) {
            return NextResponse.json(
                { error: "La fecha de inicio del gasto fijo es obligatoria" },
                { status: 400 }
            );
        }

        const fixedExpense = await prisma.fixedExpense.update({
            where: { id },
            data: {
                name,
                amount,
                description:
                    typeof body.description === "string" && body.description.trim().length > 0
                        ? body.description.trim()
                        : null,
                startsAt,
            },
        });

        return NextResponse.json(fixedExpense);
    } catch (error) {
        if (error instanceof Error && error.message.includes("autenticado")) {
            return NextResponse.json(
                { error: "No autorizado. Se requiere autenticación de admin." },
                { status: 401 }
            );
        }

        return NextResponse.json({ error: "Error al actualizar gasto fijo" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAuth();

        const { id } = await params;
        await prisma.fixedExpense.delete({
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

        return NextResponse.json({ error: "Error al eliminar gasto fijo" }, { status: 500 });
    }
}