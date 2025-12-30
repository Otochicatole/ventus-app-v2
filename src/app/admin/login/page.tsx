import { redirect } from "next/navigation";
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
        <div className="min-h-screen flex items-center justify-center px-4 bg-black">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-xl mb-6">
                        <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-3">
                        Ventus Admin
                    </h1>
                    <p className="text-neutral-400 text-lg">
                        Ingresá tus credenciales para continuar
                    </p>
                </div>

                <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-8 shadow-2xl">
                    <LoginForm />

                    <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
                        <p className="text-xs text-neutral-500">
                            Credenciales de prueba: <span className="text-neutral-400 font-medium">admin@ventus.com</span> / <span className="text-neutral-400 font-medium">admin123</span>
                        </p>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-neutral-600 text-sm">
                        © {new Date().getFullYear()} Ventus. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
}
