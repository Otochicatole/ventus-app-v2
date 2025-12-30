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

            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Últimos Turnos Reservados</h2>
                        <p className="text-neutral-400 text-sm mt-1">Actividad reciente del sistema</p>
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
                </div>

                {recentShifts.length === 0 ? (
                    <Card>
                        <CardContent>
                            <div className="flex flex-col items-center gap-4 py-12 text-neutral-500">
                                <svg className="w-16 h-16 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <p>No hay turnos recientes</p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {recentShifts.map((shift) => {
                            const dateStr = shift.date.toISOString().split("T")[0];
                            const [year, month, day] = dateStr.split("-");
                            const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                            return (
                                <Link key={shift.id} href={`/admin/cms/shifts/${shift.id}`} className="cursor-pointer">
                                    <Card className="hover:border-neutral-600 transition-colors">
                                        <CardContent>
                                            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-black font-bold text-lg flex-shrink-0">
                                                        {shift.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-white font-semibold text-lg">
                                                            {shift.name} {shift.lastName}
                                                        </h3>
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-neutral-400 mt-1">
                                                            <span className="truncate">{shift.email}</span>
                                                            <span className="hidden sm:inline text-neutral-600">•</span>
                                                            <span>{shift.phone}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-4 md:gap-6">
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-5 h-5 text-neutral-500" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="text-neutral-300 text-sm">{shift.location.name}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-5 h-5 text-neutral-500" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                        </svg>
                                                        <div className="text-sm">
                                                            <span className="text-white font-medium">{date.toLocaleDateString("es-AR")}</span>
                                                            <span className="text-neutral-500 ml-2">{shift.time}</span>
                                                        </div>
                                                    </div>

                                                    <Chip
                                                        label={shift.confirmed ? "Confirmado" : "Pendiente"}
                                                        color={shift.confirmed ? "success" : "warning"}
                                                        variant="soft"
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
