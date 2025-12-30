import { getAuthCookie } from "./cookies";
import { verifyToken } from "./jwt";
import type { JWTPayload } from "./jwt";

export async function requireAuth(): Promise<JWTPayload> {
    const token = await getAuthCookie();

    if (!token) {
        throw new Error("No autenticado");
    }

    const payload = await verifyToken(token);

    if (!payload) {
        throw new Error("Token inválido o expirado");
    }

    return payload;
}

