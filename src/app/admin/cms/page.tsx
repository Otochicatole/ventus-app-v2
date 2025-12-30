import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Button from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Chip from "@/components/ui/chip";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CMSDashboard() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
        totalLocations,
        totalShifts,
        confirmedShifts,
        pendingShifts,
        todayShifts,
        recentShifts,
    ] = await Promise.all([
        prisma.location.count(),
        prisma.shift.count(),
        prisma.shift.count({ where: { confirmed: true } }),
        prisma.shift.count({ where: { confirmed: false } }),
        prisma.shift.count({
            where: {
                date: {
                    gte: today,
                    lt: tomorrow,
                },
            },
        }),
        prisma.shift.findMany({
            take: 10,
            orderBy: { createdAt: "desc" },
            include: {
                location: true,
            },
        }),
    ]);

    const stats = [
        {
            label: "Total Turnos",
            value: totalShifts,
            subtitle: "Todos los registrados",
            color: "text-white",
        },
        {
            label: "Confirmados",
            value: confirmedShifts,
            subtitle: "Turnos confirmados",
            color: "text-green-400",
        },
        {
            label: "Pendientes",
            value: pendingShifts,
            subtitle: "Por confirmar",
            color: "text-amber-400",
        },
        {
            label: "Turnos Hoy",
            value: todayShifts,
            subtitle: "Programados hoy",
            color: "text-white",
        },
    ];

    return (
        <div className="space-y-10 animate-fadeIn">
            <div className="flex justify-between items-start flex-wrap gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-3">Dashboard</h1>
                    <p className="text-neutral-400 text-lg">Gestión de turnos y estadísticas</p>
                </div>
                <Link href="/admin/cms/shifts/new" className="cursor-pointer">
                    <Button size="large" startIcon={
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                    }>
                        Nuevo Turno
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="hover:border-neutral-700 transition-colors">
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-neutral-400">{stat.label}</span>
                                <span className="text-xs px-3 py-1 bg-neutral-800 rounded-full text-neutral-400">
                                    {stat.subtitle}
                                </span>
                            </div>
                            <p className={`text-5xl font-bold ${stat.color}`}>{stat.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Últimos Turnos Reservados</h2>
                        <p className="text-neutral-400">Actividad reciente del sistema</p>
                    </div>
                    <Link href="/admin/cms/shifts" className="cursor-pointer">
                        <Button variant="outlined" endIcon={
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        }>
                            Ver todos
                        </Button>
                    </Link>
                </CardHeader>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-neutral-900 border-b border-neutral-800">
                            <tr>
                                <th className="text-left py-5 px-8 text-neutral-400 font-semibold text-sm">Paciente</th>
                                <th className="text-left py-5 px-8 text-neutral-400 font-semibold text-sm">Ubicación</th>
                                <th className="text-left py-5 px-8 text-neutral-400 font-semibold text-sm">Fecha y Hora</th>
                                <th className="text-left py-5 px-8 text-neutral-400 font-semibold text-sm">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {recentShifts.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-12 text-neutral-500">
                                        No hay turnos recientes
                                    </td>
                                </tr>
                            ) : (
                                recentShifts.map((shift) => {
                                    const dateStr = shift.date.toISOString().split("T")[0];
                                    const [year, month, day] = dateStr.split("-");
                                    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                                    return (
                                        <tr key={shift.id} className="hover:bg-neutral-900/50 transition-colors cursor-pointer">
                                            <td className="py-5 px-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-black font-bold">
                                                        {shift.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-white font-medium">{shift.name} {shift.lastName}</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-8 text-neutral-300">{shift.location.name}</td>
                                            <td className="py-5 px-8">
                                                <div className="space-y-1">
                                                    <p className="text-white font-medium">{date.toLocaleDateString("es-AR")}</p>
                                                    <p className="text-neutral-400 text-sm">{shift.time}</p>
                                                </div>
                                            </td>
                                            <td className="py-5 px-8">
                                                <Chip
                                                    label={shift.confirmed ? "Confirmado" : "Pendiente"}
                                                    color={shift.confirmed ? "success" : "warning"}
                                                    variant="soft"
                                                />
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
