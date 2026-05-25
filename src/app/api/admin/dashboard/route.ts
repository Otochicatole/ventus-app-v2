import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";

function getRange(period: string): { start: Date; end: Date; label: string } {
    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    switch (period) {
        case "today":
            start.setHours(0, 0, 0, 0);
            return { start, end, label: "Hoy" };
        case "week": {
            const day = now.getDay();
            start.setDate(now.getDate() - day);
            start.setHours(0, 0, 0, 0);
            end.setDate(start.getDate() + 6);
            end.setHours(23, 59, 59, 999);
            return { start, end, label: "Esta semana" };
        }
        case "month":
            start.setDate(1);
            start.setHours(0, 0, 0, 0);
            end.setMonth(end.getMonth() + 1, 0);
            end.setHours(23, 59, 59, 999);
            return { start, end, label: "Este mes" };
        case "quarter": {
            const q = Math.floor(now.getMonth() / 3);
            start.setMonth(q * 3, 1);
            start.setHours(0, 0, 0, 0);
            end.setMonth(q * 3 + 3, 0);
            end.setHours(23, 59, 59, 999);
            return { start, end, label: "Este trimestre" };
        }
        case "year":
            start.setMonth(0, 1);
            start.setHours(0, 0, 0, 0);
            end.setMonth(11, 31);
            end.setHours(23, 59, 59, 999);
            return { start, end, label: "Este año" };
        default:
            // Last 30 days
            start.setDate(now.getDate() - 29);
            start.setHours(0, 0, 0, 0);
            return { start, end, label: "Últimos 30 días" };
    }
}

/** Returns an array of YYYY-MM-DD strings between start and end inclusive */
function getDaysBetween(start: Date, end: Date): string[] {
    const days: string[] = [];
    const cur = new Date(start);
    cur.setHours(0, 0, 0, 0);
    const endMidnight = new Date(end);
    endMidnight.setHours(0, 0, 0, 0);
    while (cur <= endMidnight) {
        days.push(cur.toISOString().split("T")[0]);
        cur.setDate(cur.getDate() + 1);
    }
    return days;
}

export async function GET(request: Request) {
    try {
        await requireAuth();

        const { searchParams } = new URL(request.url);
        const period = searchParams.get("period") ?? "month";
        const { start, end, label } = getRange(period);

        const [
            // Summary totals
            totalShifts,
            confirmedShifts,
            pendingShifts,
            totalLocations,
            totalServices,
            totalReviews,
            avgRating,

            // Financial
            incomeAgg,
            expenseAgg,

            // Time series: shifts per day in range
            shiftsPerDay,
            // Time series: income per day in range
            incomePerDay,

            // Shifts by location
            shiftsByLocation,

            // Recent reviews
            recentReviews,
        ] = await Promise.all([
            prisma.shift.count({ where: { date: { gte: start, lte: end } } }),
            prisma.shift.count({ where: { confirmed: true, date: { gte: start, lte: end } } }),
            prisma.shift.count({ where: { confirmed: false, date: { gte: start, lte: end } } }),
            prisma.location.count(),
            prisma.service.count({ where: { active: true } }),
            prisma.review.count(),
            prisma.review.aggregate({ _avg: { rating: true } }),

            // Financial
            prisma.clientPaidService.aggregate({
                where: { paidAt: { gte: start, lte: end } },
                _sum: { payment: true },
            }),
            prisma.expense.aggregate({
                where: { spentAt: { gte: start, lte: end } },
                _sum: { amount: true },
            }),

            // Shifts grouped by date
            prisma.shift.findMany({
                where: { date: { gte: start, lte: end } },
                select: { date: true, confirmed: true },
            }),

            // Income grouped by paidAt date
            prisma.clientPaidService.findMany({
                where: { paidAt: { gte: start, lte: end } },
                select: { paidAt: true, payment: true },
            }),

            // Shifts by location
            prisma.shift.groupBy({
                by: ["locationId"],
                where: { date: { gte: start, lte: end } },
                _count: true,
            }),

            // Recent reviews
            prisma.review.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
                select: { author: true, rating: true, comment: true, createdAt: true },
            }),
        ]);

        // Build day-by-day time series for shifts
        const days = getDaysBetween(start, end);
        const shiftsByDayMap: Record<string, { total: number; confirmed: number }> = {};
        for (const d of days) shiftsByDayMap[d] = { total: 0, confirmed: 0 };
        for (const s of shiftsPerDay) {
            const d = s.date.toISOString().split("T")[0];
            if (shiftsByDayMap[d]) {
                shiftsByDayMap[d].total++;
                if (s.confirmed) shiftsByDayMap[d].confirmed++;
            }
        }
        const shiftsChart = days.map((d) => ({
            date: d,
            total: shiftsByDayMap[d].total,
            confirmed: shiftsByDayMap[d].confirmed,
        }));

        // Build day-by-day income series
        const incomeByDayMap: Record<string, number> = {};
        for (const d of days) incomeByDayMap[d] = 0;
        for (const p of incomePerDay) {
            const d = p.paidAt.toISOString().split("T")[0];
            if (incomeByDayMap[d] !== undefined) incomeByDayMap[d] += p.payment;
        }
        const incomeChart = days.map((d) => ({
            date: d,
            income: Math.round(incomeByDayMap[d] * 100) / 100,
        }));

        // Resolve location names
        const locationIds = shiftsByLocation.map((s) => s.locationId);
        const locations = await prisma.location.findMany({
            where: { id: { in: locationIds } },
            select: { id: true, name: true },
        });
        const locationChart = shiftsByLocation
            .map((s) => ({
                name: locations.find((l) => l.id === s.locationId)?.name ?? "Desconocido",
                turnos: s._count,
            }))
            .sort((a, b) => b.turnos - a.turnos);

        const income = incomeAgg._sum.payment ?? 0;
        const expenses = expenseAgg._sum.amount ?? 0;

        return NextResponse.json({
            period: { label, start: start.toISOString(), end: end.toISOString() },
            summary: {
                totalShifts,
                confirmedShifts,
                pendingShifts,
                totalLocations,
                totalServices,
                totalReviews,
                avgRating: Math.round((avgRating._avg.rating ?? 0) * 10) / 10,
                income,
                expenses,
                profit: income - expenses,
            },
            shiftsChart,
            incomeChart,
            locationChart,
            recentReviews,
        });
    } catch (error) {
        if (error instanceof Error && error.message.includes("autenticado")) {
            return NextResponse.json({ error: "No autorizado." }, { status: 401 });
        }
        console.error(error);
        return NextResponse.json({ error: "Error al obtener datos del dashboard" }, { status: 500 });
    }
}
