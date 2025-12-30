import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/password";
import { signToken } from "@/lib/jwt";
import { setAuthCookie } from "@/lib/cookies";
import { loginSchema } from "@/core/schemas/auth.schema";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const validation = loginSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: "Datos inválidos", details: validation.error.issues },
                { status: 400 }
            );
        }

        const { email, password } = validation.data;

        const admin = await prisma.admin.findUnique({
            where: { email },
        });

        if (!admin) {
            return NextResponse.json(
                { error: "Credenciales inválidas" },
                { status: 401 }
            );
        }

        const isValidPassword = await comparePassword(password, admin.password);

        if (!isValidPassword) {
            return NextResponse.json(
                { error: "Credenciales inválidas" },
                { status: 401 }
            );
        }

        const token = await signToken({
            adminId: admin.id,
            email: admin.email,
        });

        await setAuthCookie(token);

        return NextResponse.json({
            success: true,
            admin: {
                id: admin.id,
                email: admin.email,
                name: admin.name,
            },
        });
    } catch (error) {
        console.error("Error en login:", error);
        return NextResponse.json(
            { error: "Error al iniciar sesión" },
            { status: 500 }
        );
    }
}

