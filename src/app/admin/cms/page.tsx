import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, ArrowRight, Package, MapPin, Calendar } from "lucide-react";
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
        prisma.shift.count({
            where: {
                date: {
                    gte: today,
                },
            },
        }),
        prisma.shift.count({
            where: {
                confirmed: true,
                date: {
                    gte: today,
                },
            },
        }),
        prisma.shift.count({
            where: {
                confirmed: false,
                date: {
                    gte: today,
                },
            },
        }),
        prisma.shift.count({
            where: {
                date: {
                    gte: today,
                    lt: tomorrow,
                },
            },
        }),
        prisma.shift.findMany({
            where: {
                date: {
                    gte: today,
                },
            },
            take: 10,
            orderBy: { createdAt: "desc" },
            include: {
                location: true,
            },
        }),
    ]);

    const stats = [
        {
            label: "Turnos Activos",
            value: totalShifts,
            color: "text-gray-900",
        },
        {
            label: "Confirmados",
            value: confirmedShifts,
            color: "text-green-600",
        },
        {
            label: "Pendientes",
            value: pendingShifts,
            color: "text-amber-600",
        },
        {
            label: "Turnos Hoy",
            value: todayShifts,
            color: "text-blue-600",
        },
    ];

    return (
        <div className="space-y-10 animate-fadeIn">
            <div className="flex justify-between items-start flex-wrap gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Dashboard</h1>
                    <p className="text-gray-600 text-lg">Gestión de turnos y estadísticas</p>
                </div>
                <Link href="/admin/cms/shifts/new" className="cursor-pointer">
                    <Button size="large" startIcon={<Plus className="w-5 h-5" />}>
                        Nuevo Turno
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="hover:border-gray-300 transition-colors">
                        <CardContent className="space-y-4">
                            <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                            <p className={`text-5xl font-bold ${stat.color}`}>{stat.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Últimos Turnos Reservados</h2>
                        <p className="text-gray-600 text-sm mt-1">Actividad reciente del sistema</p>
                    </div>
                    <Link href="/admin/cms/shifts" className="cursor-pointer">
                        <Button variant="outlined" endIcon={<ArrowRight className="w-5 h-5" />}>
                            Ver todos
                        </Button>
                    </Link>
                </div>

                {recentShifts.length === 0 ? (
                    <Card>
                        <CardContent>
                            <div className="flex flex-col items-center gap-4 py-12 text-gray-500">
                                <Package className="w-16 h-16 text-gray-300" />
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
                            
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const shiftDate = new Date(date);
                            shiftDate.setHours(0, 0, 0, 0);
                            const isToday = shiftDate.getTime() === today.getTime();
                            
                            return (
                                <Link key={shift.id} href={`/admin/cms/shifts/${shift.id}`} className="cursor-pointer">
                                    <Card className="hover:border-gray-300 transition-colors hover:shadow-md">
                                        <CardContent>
                                            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                                                <div className="flex items-center gap-4 flex-1">
                                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0">
                                            {shift.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-gray-900 font-semibold text-lg">
                                                {shift.name} {shift.lastName}
                                            </h3>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-gray-600 mt-1">
                                                <span className="truncate">{shift.email}</span>
                                                <span className="hidden sm:inline text-gray-400">•</span>
                                                <span>{shift.phone}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 md:gap-6">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-gray-400" />
                                            <span className="text-gray-700 text-sm">{shift.location.name}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-gray-400" />
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-gray-900 font-medium">{date.toLocaleDateString("es-AR")}</span>
                                                <span className="text-gray-500">{shift.time}</span>
                                                {isToday && (
                                                    <Chip
                                                        label="Hoy"
                                                        color="primary"
                                                        variant="filled"
                                                        size="small"
                                                    />
                                                )}
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
