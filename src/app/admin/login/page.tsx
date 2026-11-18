import { redirect } from "next/navigation";
import Image from "next/image";
import { getAuthCookie } from "@/lib/cookies";
import { verifyToken } from "@/lib/jwt";
import LoginForm from "../components/login-form";

export default async function LoginPage() {
    const token = await getAuthCookie();

    if (token) {
        const payload = await verifyToken(token);
        if (payload) {
            redirect("/admin/cms");
        }
    }

    return (
        <div className="admin-login-root min-h-dvh flex items-center justify-center px-4 sm:px-6 py-8 bg-stone-50">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center space-y-3">
                    <Image
                        src="/logo.svg"
                        alt="Ventus Barbería"
                        width={48}
                        height={48}
                        className="w-12 h-12 mx-auto block"
                    />
                    <h1 className="text-3xl font-bold tracking-tight text-stone-900">
                        Ventus Admin
                    </h1>
                    <p className="text-stone-600 text-sm sm:text-base">
                        Ingresá tus credenciales para continuar
                    </p>
                </div>

                <div className="bg-white border border-stone-200 p-6 sm:p-8">
                    <LoginForm />
                </div>

                <p className="text-center text-stone-500 text-xs sm:text-sm">
                    © {new Date().getFullYear()} Ventus. Todos los derechos reservados.
                </p>
            </div>
        </div>
    );
}
