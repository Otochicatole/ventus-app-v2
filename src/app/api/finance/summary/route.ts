import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";
import { getDateRange, getFixedExpenseOccurrences, getPeriodRange, isBudgetPeriod } from "@/features/expenses/domain/finance";

export async function GET(request: Request) {
    try {
        await requireAuth();

        const { searchParams } = new URL(request.url);
        const periodParam = searchParams.get("period");
        const startDateParam = searchParams.get("startDate");
        const endDateParam = searchParams.get("endDate");

        let range:
            | ReturnType<typeof getDateRange>
            | ReturnType<typeof getPeriodRange>;

        if (startDateParam && endDateParam) {
            const customRange = getDateRange(startDateParam, endDateParam);

            if (!customRange) {
                return NextResponse.json(
                    { error: "El rango de fechas es inválido" },
                    { status: 400 }
                );
            }

            range = customRange;
        } else if (isBudgetPeriod(periodParam)) {
            range = getPeriodRange(periodParam, searchParams.get("date") ?? undefined);
        } else {
            return NextResponse.json(
                { error: "Debés enviar un período válido o un rango startDate/endDate" },
                { status: 400 }
            );
        }

        const [incomeAggregate, expenseAggregate, paymentsCount, expensesCount, fixedExpenses] =
            await Promise.all([
                prisma.clientPaidService.aggregate({
                    where: {
                        paidAt: {
                            gte: range.start,
                            lt: range.end,
                        },
                    },
                    _sum: {
                        payment: true,
                    },
                }),
                prisma.expense.aggregate({
                    where: {
                        spentAt: {
                            gte: range.start,
                            lt: range.end,
                        },
                    },
                    _sum: {
                        amount: true,
                    },
                }),
                prisma.clientPaidService.count({
                    where: {
                        paidAt: {
                            gte: range.start,
                            lt: range.end,
                        },
                    },
                }),
                prisma.expense.count({
                    where: {
                        spentAt: {
                            gte: range.start,
                            lt: range.end,
                        },
                    },
                }),
                prisma.fixedExpense.findMany({
                    where: {
                        startsAt: {
                            lt: range.end,
                        },
                    },
                    orderBy: [{ name: "asc" }, { startsAt: "asc" }],
                }),
            ]);

        const fixedOccurrences = getFixedExpenseOccurrences(fixedExpenses, range);
        const fixedExpenseBreakdown = fixedExpenses.map((fixedExpense) => {
            const occurrences = fixedOccurrences.filter(
                (occurrence) => occurrence.fixedExpenseId === fixedExpense.id
            );

            return {
                id: fixedExpense.id,
                name: fixedExpense.name,
                amount: fixedExpense.amount,
                description: fixedExpense.description,
                startsAt: fixedExpense.startsAt,
                occurrenceCount: occurrences.length,
                totalForPeriod: occurrences.reduce((sum, occurrence) => sum + occurrence.amount, 0),
            };
        });

        const income = incomeAggregate._sum.payment ?? 0;
        const normalExpenses = expenseAggregate._sum.amount ?? 0;
        const fixedExpensesTotal = fixedOccurrences.reduce(
            (sum, occurrence) => sum + occurrence.amount,
            0
        );
        const totalExpenses = normalExpenses + fixedExpensesTotal;

        return NextResponse.json({
            range: {
                label: range.label,
                start: range.start.toISOString(),
                end: range.end.toISOString(),
            },
            income,
            paymentsCount,
            normalExpenses,
            normalExpensesCount: expensesCount,
            fixedExpensesTotal,
            fixedExpenseTemplatesCount: fixedExpenses.length,
            fixedExpenseOccurrencesCount: fixedOccurrences.length,
            totalExpenses,
            budget: income - totalExpenses,
            fixedExpenseBreakdown,
        });
    } catch (error) {
        if (error instanceof Error && error.message.includes("autenticado")) {
            return NextResponse.json(
                { error: "No autorizado. Se requiere autenticación de admin." },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: "Error al obtener el resumen financiero" },
            { status: 500 }
        );
    }
}