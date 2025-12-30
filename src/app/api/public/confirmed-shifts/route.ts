import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const confirmedShifts = await prisma.shift.findMany({
            where: {
                confirmed: true,
                date: {
                    gte: today,
                },
            },
            include: {
                location: {
                    select: {
                        name: true,
                        address: true,
                    },
                },
            },
            orderBy: [
                { date: "asc" },
                { time: "asc" },
            ],
        });

        const publicShifts = confirmedShifts.map((shift) => {
            const emailParts = shift.email.split("@");
            const maskedEmail = `${emailParts[0].slice(0, 2)}***@${emailParts[1]}`;

            return {
                id: shift.id,
                name: shift.name,
                lastName: shift.lastName,
                maskedEmail,
                date: shift.date,
                time: shift.time,
                location: shift.location,
            };
        });

        return NextResponse.json(publicShifts);
    } catch (error) {
        return NextResponse.json(
            { error: "Error al obtener turnos confirmados" },
            { status: 500 }
        );
    }
}

