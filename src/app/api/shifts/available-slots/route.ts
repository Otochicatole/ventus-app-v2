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

        const selectedDate = new Date(dateStr + "T12:00:00.000Z");

        const isDateBlocked = await prisma.unavailableDate.findFirst({
            where: {
                locationId,
                date: selectedDate,
            },
        });

        if (isDateBlocked) {
            return NextResponse.json([]);
        }

        const allTimeSlots = await prisma.timeSlot.findMany({
            where: { locationId },
            orderBy: { time: "asc" },
        });

        const bookedShifts = await prisma.shift.findMany({
            where: {
                locationId,
                date: selectedDate,
            },
            select: { time: true },
        });

        const bookedTimes = bookedShifts.map((shift) => shift.time);

        const availableSlots = allTimeSlots.filter(
            (slot) => !bookedTimes.includes(slot.time)
        );

        return NextResponse.json(availableSlots);
    } catch (error) {
        return NextResponse.json(
            { error: "Error al obtener horarios disponibles" },
            { status: 500 }
        );
    }
}

