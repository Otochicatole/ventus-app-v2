import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { name: "asc" },
        });

        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json(
            { error: "Error al obtener productos" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await requireAuth();

        const body = await request.json();
        const { name, description, price, stock, active } = body;

        if (!name || price === undefined) {
            return NextResponse.json(
                { error: "Nombre y precio son requeridos" },
                { status: 400 }
            );
        }

        const product = await prisma.product.create({
            data: {
                name,
                description: description || null,
                price: parseFloat(price),
                stock: stock !== undefined && stock !== "" ? parseInt(stock) : 0,
                active: active !== undefined ? Boolean(active) : true,
            },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        if (error instanceof Error && error.message.includes("autenticado")) {
            return NextResponse.json(
                { error: "No autorizado. Se requiere autenticación de admin." },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: "Error al crear producto" },
            { status: 500 }
        );
    }
}
