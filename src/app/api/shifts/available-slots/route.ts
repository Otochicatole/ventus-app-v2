import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const locationId = searchParams.get("locationId");
        const dateStr = searchParams.get("date");

        if (!locationId || !dateStr) {
            return NextResponse.json(
                { error: "locationId y date son requeridos" },
                { status: 400 }
            );
        }

        const [year, month, day] = dateStr.split("-").map(Number);
        const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
        const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

        const isDateBlocked = await prisma.unavailableDate.findFirst({
            where: {
                locationId,
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
        });

        if (isDateBlocked) {
            return NextResponse.json([]);
        }

        const allTimeSlots = await prisma.timeSlot.findMany({
            where: { locationId },
            orderBy: { time: "asc" },
        });

        const confirmedShifts = await prisma.shift.findMany({
            where: {
                locationId,
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
                confirmed: true,
            },
            select: { time: true },
        });

        const pendingShifts = await prisma.shift.findMany({
            where: {
                locationId,
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
                confirmed: false,
            },
            select: { time: true },
        });

        const confirmedTimes = confirmedShifts.map((shift) => shift.time);
        
        const pendingCountByTime = pendingShifts.reduce((acc, shift) => {
            acc[shift.time] = (acc[shift.time] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const availableSlots = allTimeSlots
            .filter((slot) => !confirmedTimes.includes(slot.time))
            .map((slot) => ({
                ...slot,
                pendingCount: pendingCountByTime[slot.time] || 0,
                isHighDemand: (pendingCountByTime[slot.time] || 0) >= 2,
            }));

        return NextResponse.json(availableSlots);
    } catch (error) {
        return NextResponse.json(
            { error: "Error al obtener horarios disponibles" },
            { status: 500 }
        );
    }
}

