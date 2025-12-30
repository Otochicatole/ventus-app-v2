import { redirect } from "next/navigation";
import { getAuthCookie } from "@/lib/cookies";
import { verifyToken } from "@/lib/jwt";
import { Scissors } from "lucide-react";
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
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 bg-gradient-to-br from-gray-50 via-white to-blue-50">
            <div className="w-full max-w-md space-y-6 sm:space-y-8">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-2xl mb-4 sm:mb-6 shadow-lg">
                        <Scissors className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                        Ventus Admin
                    </h1>
                    <p className="text-gray-600 text-base sm:text-lg">
                        Ingresá tus credenciales para continuar
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xl">
                    <LoginForm />
                </div>

                <div className="text-center">
                    <p className="text-gray-500 text-xs sm:text-sm">
                        © {new Date().getFullYear()} Ventus. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
}
