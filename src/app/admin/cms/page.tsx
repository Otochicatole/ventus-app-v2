import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, ArrowRight, Package, MapPin, Calendar } from "lucide-react";
import Button from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Chip from "@/components/ui/chip";
import DashboardCharts from "./DashboardCharts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CMSDashboard() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalShifts, confirmedShifts, pendingShifts, todayShifts, recentShifts] =
        await Promise.all([
            prisma.shift.count({ where: { date: { gte: today } } }),
            prisma.shift.count({ where: { confirmed: true, date: { gte: today } } }),
            prisma.shift.count({ where: { confirmed: false, date: { gte: today } } }),
            prisma.shift.count({ where: { date: { gte: today, lt: tomorrow } } }),
            prisma.shift.findMany({
                where: { date: { gte: today } },
                take: 8,
                orderBy: { createdAt: "desc" },
                include: { location: true },
            }),
        ]);

    const stats = [
        { label: "Turnos Activos", value: totalShifts, color: "text-gray-900" },
        { label: "Confirmados", value: confirmedShifts, color: "text-green-600" },
        { label: "Pendientes", value: pendingShifts, color: "text-amber-600" },
        { label: "Turnos Hoy", value: todayShifts, color: "text-[#0b3a60]" },
    ];

    return (
        <div className="space-y-6 sm:space-y-10 animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-3">Dashboard</h1>
                    <p className="text-gray-600 text-sm sm:text-lg">Gestión de turnos y estadísticas</p>
                </div>
                <Link href="/admin/cms/shifts/new" className="cursor-pointer shrink-0">
                    <Button size="medium" startIcon={<Plus className="w-4 h-4" />}>
                        Nuevo Turno
                    </Button>
                </Link>
            </div>

            {/* Quick shift stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="hover:border-gray-300 transition-colors">
                        <CardContent className="space-y-2 sm:space-y-4 !p-3 sm:!p-5">
                            <span className="text-xs sm:text-sm font-medium text-gray-600">{stat.label}</span>
                            <p className={`text-3xl sm:text-5xl font-bold ${stat.color}`}>{stat.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* ── Charts & Analytics (client component with period filter) ── */}
            <DashboardCharts />

            {/* Recent shifts table */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Últimos Turnos Reservados</h2>
                        <p className="text-gray-600 text-xs sm:text-sm mt-1">Actividad reciente del sistema</p>
                    </div>
                    <Link href="/admin/cms/shifts" className="cursor-pointer shrink-0">
                        <Button variant="outlined" size="small" endIcon={<ArrowRight className="w-4 h-4" />}>
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

                            const todayCheck = new Date();
                            todayCheck.setHours(0, 0, 0, 0);
                            const shiftDate = new Date(date);
                            shiftDate.setHours(0, 0, 0, 0);
                            const isToday = shiftDate.getTime() === todayCheck.getTime();

                            return (
                                <Link key={shift.id} href={`/admin/cms/shifts/${shift.id}`} className="cursor-pointer">
                                    <Card className="hover:border-gray-300 transition-colors hover:shadow-md">
                                        <CardContent>
                                            <div className="flex flex-col gap-3">
                                                {/* Top row: avatar + name + status chip */}
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 sm:w-11 sm:h-11 bg-[#0b3a60] flex items-center justify-center text-white font-bold text-base shrink-0">
                                                        {shift.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-gray-900 font-semibold text-sm sm:text-base truncate">
                                                            {shift.name} {shift.lastName}
                                                        </h3>
                                                        <p className="text-xs text-gray-500 truncate">{shift.email}</p>
                                                    </div>
                                                    <Chip
                                                        label={shift.confirmed ? "Conf." : "Pend."}
                                                        color={shift.confirmed ? "success" : "warning"}
                                                        variant="soft"
                                                        size="small"
                                                    />
                                                </div>
                                                {/* Bottom row: location + date + phone */}
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pl-12 sm:pl-14">
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                                        <span className="text-gray-600 text-xs">{shift.location.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                                        <span className="text-gray-700 text-xs font-medium">{date.toLocaleDateString("es-AR")}</span>
                                                        <span className="text-gray-400 text-xs">{shift.time}</span>
                                                        {isToday && (
                                                            <Chip label="Hoy" color="primary" variant="filled" size="small" />
                                                        )}
                                                    </div>
                                                    <span className="text-gray-500 text-xs">{shift.phone}</span>
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
