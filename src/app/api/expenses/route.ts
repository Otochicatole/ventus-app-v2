import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";
import {
    getDateRange,
    getPeriodRange,
    isBudgetPeriod,
    parseDateInputToUtcMidday,
    parseMoneyAmount,
} from "@/features/expenses/domain/finance";

export async function GET(request: Request) {
    try {
        await requireAuth();

        const { searchParams } = new URL(request.url);
        const periodParam = searchParams.get("period");
        const dateParam = searchParams.get("date") ?? undefined;
        const startDateParam = searchParams.get("startDate");
        const endDateParam = searchParams.get("endDate");

        const where: {
            spentAt?: {
                gte: Date;
                lt: Date;
            };
        } = {};

        if (startDateParam && endDateParam) {
            const range = getDateRange(startDateParam, endDateParam);

            if (!range) {
                return NextResponse.json(
                    { error: "El rango de fechas es inválido" },
                    { status: 400 }
                );
            }

            where.spentAt = {
                gte: range.start,
                lt: range.end,
            };
        } else if (periodParam && isBudgetPeriod(periodParam)) {
            const range = getPeriodRange(periodParam, dateParam);
            where.spentAt = {
                gte: range.start,
                lt: range.end,
            };
        }

        const expenses = await prisma.expense.findMany({
            where,
            orderBy: [{ spentAt: "desc" }, { createdAt: "desc" }],
        });

        return NextResponse.json(expenses);
    } catch (error) {
        if (error instanceof Error && error.message.includes("autenticado")) {
            return NextResponse.json(
                { error: "No autorizado. Se requiere autenticación de admin." },
                { status: 401 }
            );
        }

        return NextResponse.json({ error: "Error al obtener gastos" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await requireAuth();

        const body = await request.json();
        const name = typeof body.name === "string" ? body.name.trim() : "";
        const amount = parseMoneyAmount(body.amount);
        const spentAt = parseDateInputToUtcMidday(body.spentAt);

        if (!name) {
            return NextResponse.json({ error: "El nombre del gasto es obligatorio" }, { status: 400 });
        }

        if (amount === null) {
            return NextResponse.json({ error: "El monto del gasto es inválido" }, { status: 400 });
        }

        if (!spentAt) {
            return NextResponse.json({ error: "La fecha del gasto es obligatoria" }, { status: 400 });
        }

        const expense = await prisma.expense.create({
            data: {
                name,
                amount,
                description:
                    typeof body.description === "string" && body.description.trim().length > 0
                        ? body.description.trim()
                        : null,
                spentAt,
            },
        });

        return NextResponse.json(expense, { status: 201 });
    } catch (error) {
        if (error instanceof Error && error.message.includes("autenticado")) {
            return NextResponse.json(
                { error: "No autorizado. Se requiere autenticación de admin." },
                { status: 401 }
            );
        }

        return NextResponse.json({ error: "Error al crear gasto" }, { status: 500 });
    }
}