import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            return NextResponse.json(
                { error: "Producto no encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json(
            { error: "Error al obtener producto" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAuth();

        const { id } = await params;
        const body = await request.json();
        const { name, description, price, stock, active } = body;

        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                description: description !== undefined ? (description || null) : undefined,
                price: price !== undefined ? parseFloat(price) : undefined,
                stock: stock !== undefined && stock !== "" ? parseInt(stock) : undefined,
                active: active !== undefined ? Boolean(active) : undefined,
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        if (error instanceof Error && error.message.includes("autenticado")) {
            return NextResponse.json(
                { error: "No autorizado. Se requiere autenticación de admin." },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: "Error al actualizar producto" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAuth();

        const { id } = await params;

        await prisma.product.delete({
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
        return NextResponse.json(
            { error: "Error al eliminar producto" },
            { status: 500 }
        );
    }
}
