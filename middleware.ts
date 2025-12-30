import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("ventus_admin_token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const payload = await verifyToken(token);

    if (!payload) {
        const response = NextResponse.redirect(
            new URL("/admin/login", request.url)
        );
        response.cookies.delete("ventus_admin_token");
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/cms/:path*"],
};

