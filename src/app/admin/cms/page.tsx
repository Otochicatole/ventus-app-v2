import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, ArrowRight, Package, MapPin, Calendar, Receipt } from "lucide-react";
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
        { label: "Turnos Activos", value: totalShifts, color: "text-stone-900", badge: "En agenda" },
        { label: "Confirmados", value: confirmedShifts, color: "text-emerald-700", badge: "Verificados" },
        { label: "Pendientes", value: pendingShifts, color: "text-amber-700", badge: "Por confirmar" },
        { label: "Turnos Hoy", value: todayShifts, color: "text-[#0b3a60]", badge: "Día actual" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">Dashboard</h1>
                    <p className="text-stone-500 text-xs sm:text-sm mt-0.5">Control de turnos, ingresos y catálogo de Ventus</p>
                </div>
                <div className="flex items-center gap-2.5">
                    <Button
                        href="/admin/cms/payments"
                        variant="outlined"
                        size="small"
                        startIcon={<Receipt className="w-3.5 h-3.5" />}
                    >
                        Cobros
                    </Button>
                    <Button
                        href="/admin/cms/shifts/new"
                        size="small"
                        startIcon={<Plus className="w-3.5 h-3.5" />}
                    >
                        Nuevo Turno
                    </Button>
                </div>
            </div>

            {/* Quick shift stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="hover:border-stone-300 transition-colors">
                        <CardContent className="space-y-1.5 p-3.5 sm:p-5">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-stone-500">{stat.label}</span>
                                <span className="text-[10px] text-stone-400 font-medium hidden sm:inline">{stat.badge}</span>
                            </div>
                            <p className={`text-2xl sm:text-4xl font-extrabold tracking-tight tabular-nums ${stat.color}`}>{stat.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* ── Charts & Analytics (client component with period filter) ── */}
            <DashboardCharts />

            {/* Recent shifts table */}
            <div className="space-y-4 pt-4 border-t border-stone-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">Últimos Turnos Reservados</h2>
                        <p className="text-stone-500 text-xs mt-0.5">Actividad reciente registrada en el sistema</p>
                    </div>
                    <Button
                        href="/admin/cms/shifts"
                        variant="outlined"
                        size="small"
                        endIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                        Ver todos
                    </Button>
                </div>

                {recentShifts.length === 0 ? (
                    <Card>
                        <CardContent>
                            <div className="flex flex-col items-center gap-3 py-12 text-stone-400">
                                <Package className="w-12 h-12 text-stone-300" />
                                <p className="text-xs uppercase tracking-wider font-semibold">No hay turnos recientes para mostrar</p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
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
                                <Link key={shift.id} href={`/admin/cms/shifts/${shift.id}`} className="cursor-pointer group">
                                    <div className="bg-white border border-stone-200 rounded-xl p-4 transition-all hover:border-[#0b3a60] hover:shadow-xs space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-[#0b3a60] rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">
                                                {shift.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-stone-900 font-bold text-sm truncate group-hover:text-[#0b3a60] transition-colors">
                                                    {shift.name} {shift.lastName}
                                                </h3>
                                                <p className="text-xs text-stone-500 truncate">{shift.email}</p>
                                            </div>
                                            <Chip
                                                label={shift.confirmed ? "Confirmado" : "Pendiente"}
                                                color={shift.confirmed ? "success" : "warning"}
                                                variant="soft"
                                                size="small"
                                            />
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600 pt-2 border-t border-stone-100">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                                                <span className="font-medium">{shift.location.name}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                                                <span>{date.toLocaleDateString("es-AR")}</span>
                                                <span className="text-stone-400 font-mono">•</span>
                                                <span className="font-semibold text-stone-800">{shift.time}</span>
                                                {isToday && (
                                                    <span className="bg-[#0b3a60] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                                        HOY
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
