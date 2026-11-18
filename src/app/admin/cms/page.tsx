import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, ArrowRight, Calendar, MapPin, Receipt } from "lucide-react";
import Button from "@/components/ui/button";
import Chip from "@/components/ui/chip";
import DashboardCharts from "./DashboardCharts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CMSDashboard() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const recentShifts = await prisma.shift.findMany({
        where: { date: { gte: today } },
        take: 8,
        orderBy: [{ date: "asc" }, { time: "asc" }],
        include: { location: true },
    });

    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-stone-600 text-sm mt-1">
                        Resumen de caja, agenda y catálogo de Ventus
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                    <Button
                        href="/admin/cms/payments"
                        variant="outlined"
                        size="small"
                        startIcon={<Receipt className="w-3.5 h-3.5" />}
                    >
                        Registrar Cobro
                    </Button>
                    <Button
                        href="/admin/cms/shifts/new"
                        size="small"
                        startIcon={<Plus className="w-3.5 h-3.5" />}
                    >
                        Nuevo Turno
                    </Button>
                </div>
            </header>

            {/* Period Analytics & Charts */}
            <DashboardCharts />

            {/* Upcoming Shifts */}
            <section className="space-y-4 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
                            Próximos Turnos
                        </h2>
                        <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
                            Agenda inmediata desde hoy en adelante
                        </p>
                    </div>
                    <Button
                        href="/admin/cms/shifts"
                        variant="outlined"
                        size="small"
                        endIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                        Ver todos los turnos
                    </Button>
                </div>

                {recentShifts.length === 0 ? (
                    <div className="bg-white border border-stone-200 p-10 text-center space-y-3">
                        <Calendar className="w-8 h-8 text-stone-400 mx-auto" />
                        <div>
                            <p className="text-sm font-semibold text-stone-900">
                                No hay turnos próximos en agenda
                            </p>
                            <p className="text-xs text-stone-600 mt-1">
                                Cargá un turno manualmente o esperá nuevas reservas desde el sitio.
                            </p>
                        </div>
                        <div className="pt-1">
                            <Button
                                href="/admin/cms/shifts/new"
                                size="small"
                                startIcon={<Plus className="w-3.5 h-3.5" />}
                            >
                                Nuevo Turno
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white border border-stone-200">
                        {recentShifts.map((shift) => {
                            const dateStr = shift.date.toISOString().split("T")[0];
                            const [year, month, day] = dateStr.split("-");
                            const date = new Date(
                                parseInt(year, 10),
                                parseInt(month, 10) - 1,
                                parseInt(day, 10)
                            );

                            const shiftDate = new Date(date);
                            shiftDate.setHours(0, 0, 0, 0);
                            const isToday = shiftDate.getTime() === today.getTime();

                            return (
                                <Link
                                    key={shift.id}
                                    href={`/admin/cms/shifts/${shift.id}`}
                                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 odd:bg-white even:bg-stone-50/70 hover:bg-stone-100/80 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-9 h-9 bg-[#0b3a60] flex items-center justify-center text-white font-bold text-sm shrink-0">
                                            {shift.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-stone-900 truncate group-hover:text-[#0b3a60] transition-colors">
                                                {shift.name} {shift.lastName}
                                            </p>
                                            <p className="text-xs text-stone-600 truncate">
                                                {shift.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-stone-700">
                                        <span className="inline-flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                                            <span className="font-medium">{shift.location.name}</span>
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 tabular-nums">
                                            <Calendar className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                                            <span>{date.toLocaleDateString("es-AR")}</span>
                                            <span className="font-semibold text-stone-900">
                                                {shift.time} hs
                                            </span>
                                            {isToday && (
                                                <span className="bg-[#0b3a60] text-white text-[11px] font-semibold px-1.5 py-0.5">
                                                    Hoy
                                                </span>
                                            )}
                                        </span>
                                        <Chip
                                            label={shift.confirmed ? "Confirmado" : "Pendiente"}
                                            color={shift.confirmed ? "success" : "warning"}
                                            variant="soft"
                                            size="small"
                                        />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
