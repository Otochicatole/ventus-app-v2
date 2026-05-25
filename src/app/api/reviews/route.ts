import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

// Zod Schema para la validación estricta de la reseña
const reviewSchema = z.object({
    author: z
        .string()
        .max(40, "El alias no puede superar los 40 caracteres")
        .optional()
        .transform((val) => (!val || val.trim() === "" ? "Anónimo" : val.trim())),
    rating: z
        .number({ message: "La calificación es obligatoria" })
        .int("La calificación debe ser un número entero")
        .min(1, "La calificación mínima es 1 estrella")
        .max(5, "La calificación máxima es 5 estrellas"),
    comment: z
        .string({ message: "El comentario es obligatorio" })
        .min(1, "El comentario no puede estar vacío")
        .max(500, "El comentario no puede superar los 500 caracteres")
        .transform((val) => val.trim()),
});

/**
 * GET /api/reviews
 * Retorna el historial de reseñas anónimas ordenadas cronológicamente de forma descendente.
 */
export async function GET() {
    try {
        const reviews = await prisma.review.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(reviews);
    } catch (error) {
        console.error("Error al obtener reseñas:", error);
        return NextResponse.json(
            { error: "Error interno al obtener el historial de reseñas" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/reviews
 * Registra una opinión anónima en el sistema tras validar sus campos.
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Validación con Zod
        const parsedData = reviewSchema.safeParse(body);
        if (!parsedData.success) {
            const firstError = parsedData.error.issues[0]?.message || "Datos de entrada inválidos";
            return NextResponse.json({ error: firstError }, { status: 400 });
        }

        const { author, rating, comment } = parsedData.data;

        // Inserción en la base de datos
        const newReview = await prisma.review.create({
            data: {
                author,
                rating,
                comment,
            },
        });

        return NextResponse.json(newReview, { status: 201 });
    } catch (error) {
        console.error("Error al registrar reseña:", error);
        return NextResponse.json(
            { error: "Error interno del servidor al publicar la reseña" },
            { status: 500 }
        );
    }
}
