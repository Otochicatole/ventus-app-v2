import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";

export async function GET() {
    try {
        await requireAuth();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);

        const [
            totalLocations,
            totalShifts,
            totalTimeSlots,
            totalUnavailableDates,
            confirmedShifts,
            pendingShifts,
            todayShifts,
            weekShifts,
        ] = await Promise.all([
            prisma.location.count(),
            prisma.shift.count(),
            prisma.timeSlot.count(),
            prisma.unavailableDate.count(),
            prisma.shift.count({ where: { confirmed: true } }),
            prisma.shift.count({ where: { confirmed: false } }),
            prisma.shift.count({
                where: {
                    date: {
                        gte: today,
                        lt: tomorrow,
                    },
                },
            }),
            prisma.shift.count({
                where: {
                    date: {
                        gte: startOfWeek,
                        lt: endOfWeek,
                    },
                },
            }),
        ]);

        const shiftsByLocation = await prisma.shift.groupBy({
            by: ["locationId"],
            _count: true,
            orderBy: {
                _count: {
                    locationId: "desc",
                },
            },
            take: 5,
        });

        const locationIds = shiftsByLocation.map((s) => s.locationId);
        const locations = await prisma.location.findMany({
            where: { id: { in: locationIds } },
            select: { id: true, name: true },
        });

        const topLocations = shiftsByLocation.map((s) => ({
            location: locations.find((l) => l.id === s.locationId)?.name || "Unknown",
            count: s._count,
        }));

        return NextResponse.json({
            totals: {
                locations: totalLocations,
                shifts: totalShifts,
                timeSlots: totalTimeSlots,
                unavailableDates: totalUnavailableDates,
                confirmedShifts,
                pendingShifts,
                todayShifts,
                weekShifts,
            },
            topLocations,
        });
    } catch (error) {
        if (error instanceof Error && error.message.includes("autenticado")) {
            return NextResponse.json(
                { error: "No autorizado. Se requiere autenticación de admin." },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: "Error al obtener estadísticas" },
            { status: 500 }
        );
    }
}

