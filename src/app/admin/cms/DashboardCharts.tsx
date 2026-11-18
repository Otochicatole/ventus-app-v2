"use client";

import { useState, useEffect, useCallback } from "react";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { Star, RefreshCw, AlertCircle } from "lucide-react";

interface DashboardData {
    period: { label: string; start: string; end: string };
    summary: {
        totalShifts: number;
        confirmedShifts: number;
        pendingShifts: number;
        todayShifts: number;
        totalLocations: number;
        totalServices: number;
        totalProducts: number;
        totalReviews: number;
        avgRating: number;
        income: number;
        paymentsCount: number;
        expenses: number;
        normalExpenses: number;
        expensesCount: number;
        fixedExpensesTotal: number;
        fixedOccurrencesCount: number;
        productsSoldCount: number;
        productsSoldTotal: number;
        profit: number;
    };
    shiftsChart: { date: string; total: number; confirmed: number }[];
    incomeChart: { date: string; income: number }[];
    locationChart: { name: string; turnos: number }[];
    recentReviews: { author: string; rating: number; comment: string; createdAt: string }[];
}

const PERIODS = [
    { value: "today", label: "Hoy" },
    { value: "week", label: "Semana" },
    { value: "month", label: "Mes" },
    { value: "quarter", label: "Trimestre" },
    { value: "year", label: "Año" },
];

const BRAND = "#0b3a60";
const CONFIRMED_GREEN = "#15803d";

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    }).format(amount);
}

function formatAxisCurrency(value: number) {
    if (Math.abs(value) >= 1_000_000) {
        return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1_000) {
        return `$${Math.round(value / 1_000)}k`;
    }
    return `$${value}`;
}

function formatShortDate(dateStr: string) {
    const [, m, d] = dateStr.split("-");
    return `${d}/${m}`;
}

function formatDisplayDate(isoStr: string) {
    return new Intl.DateTimeFormat("es-AR", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(isoStr));
}

function ChartPanel({
    title,
    meta,
    children,
}: {
    title: string;
    meta?: string;
    children: React.ReactNode;
}) {
    return (
        <section className="bg-white border border-stone-200 p-5 sm:p-6">
            <div className="flex items-baseline justify-between gap-3 mb-4">
                <h2 className="text-sm font-semibold text-stone-900">{title}</h2>
                {meta && (
                    <span className="text-xs font-medium text-stone-600 tabular-nums">
                        {meta}
                    </span>
                )}
            </div>
            {children}
        </section>
    );
}

function CustomTooltip({
    active,
    payload,
    label,
    currency = false,
}: {
    active?: boolean;
    payload?: { name: string; value: number; color: string }[];
    label?: string;
    currency?: boolean;
}) {
    if (!active || !payload?.length) return null;
    const formattedLabel = label && /^\d{4}-\d{2}-\d{2}$/.test(label) ? formatShortDate(label) : label;
    return (
        <div className="bg-white border border-stone-300 px-3 py-2 text-xs tabular-nums">
            <p className="font-semibold text-stone-900 mb-1">{formattedLabel}</p>
            {payload.map((entry, idx) => (
                <p key={idx} style={{ color: entry.color }} className="font-medium">
                    {entry.name}: {currency ? formatCurrency(entry.value) : entry.value}
                </p>
            ))}
        </div>
    );
}

function Stars({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5" aria-label={`${rating} de 5 estrellas`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                        star <= rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-stone-200 fill-stone-200"
                    }`}
                />
            ))}
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-6" aria-busy="true" aria-label="Cargando métricas del dashboard">
            <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
                <div className="h-56 bg-stone-200/70" />
                <div className="h-56 bg-stone-100 border border-stone-200" />
            </div>
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                <div className="h-64 bg-stone-100 border border-stone-200" />
                <div className="h-64 bg-stone-100 border border-stone-200" />
            </div>
        </div>
    );
}

export default function DashboardCharts() {
    const [period, setPeriod] = useState("month");
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/admin/dashboard?period=${period}`, {
                cache: "no-store",
            });
            if (!res.ok) {
                throw new Error("No se pudieron cargar las métricas del dashboard.");
            }
            setData(await res.json());
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Ocurrió un error al obtener los datos."
            );
        } finally {
            setLoading(false);
        }
    }, [period]);

    useEffect(() => {
        load();
    }, [load]);

    const s = data?.summary;
    const confirmedPercent =
        s && s.totalShifts > 0 ? Math.round((s.confirmedShifts / s.totalShifts) * 100) : 0;

    return (
        <div className="space-y-6">
            {/* Period Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div
                    role="group"
                    aria-label="Seleccionar período"
                    className="inline-flex flex-wrap gap-1 p-1 bg-stone-100 border border-stone-200"
                >
                    {PERIODS.map((p) => {
                        const selected = period === p.value;
                        return (
                            <button
                                key={p.value}
                                type="button"
                                onClick={() => setPeriod(p.value)}
                                aria-pressed={selected}
                                className={`py-1.5 px-3 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                                    selected
                                        ? "bg-[#0b3a60] text-white"
                                        : "text-stone-700 hover:text-stone-900 hover:bg-white"
                                }`}
                            >
                                {p.label}
                            </button>
                        );
                    })}
                </div>

                {data && (
                    <p className="text-xs sm:text-sm text-stone-600 tabular-nums">
                        {data.period.label} · {formatDisplayDate(data.period.start)} –{" "}
                        {formatDisplayDate(data.period.end)}
                    </p>
                )}
            </div>

            {loading && <DashboardSkeleton />}

            {!loading && error && (
                <div
                    role="alert"
                    className="bg-white border border-red-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-stone-900">
                                Error al cargar el resumen
                            </p>
                            <p className="text-xs text-stone-600 mt-0.5">{error}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={load}
                        className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-[#0b3a60] text-white hover:bg-[#082a46] transition-colors cursor-pointer shrink-0"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Reintentar
                    </button>
                </div>
            )}

            {!loading && !error && s && (
                <>
                    {/* Asymmetric Hero Band: Financial Balance + Operational Summary */}
                    <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
                        <section className="bg-[#0b3a60] text-white p-5 sm:p-6 flex flex-col justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-100">
                                    Balance neto · {data.period.label}
                                </p>
                                <p
                                    className={`mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight tabular-nums ${
                                        s.profit >= 0 ? "text-white" : "text-rose-200"
                                    }`}
                                >
                                    {formatCurrency(s.profit)}
                                </p>
                                <p className="mt-1.5 text-xs sm:text-sm text-blue-100/85">
                                    Ingresos cobrados menos gastos del día y gastos fijos del período
                                </p>
                            </div>

                            <div className="mt-6 bg-[#082a46] p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="min-w-0">
                                    <p className="text-xs text-blue-100/85">Ingresos</p>
                                    <p className="mt-1 text-lg sm:text-xl font-bold text-white tabular-nums truncate">
                                        {formatCurrency(s.income)}
                                    </p>
                                    <p className="mt-0.5 text-xs text-blue-100/75 tabular-nums">
                                        {s.paymentsCount} {s.paymentsCount === 1 ? "cobro" : "cobros"}
                                    </p>
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs text-blue-100/85">Gastos totales</p>
                                    <p className="mt-1 text-lg sm:text-xl font-bold text-white tabular-nums truncate">
                                        {formatCurrency(s.expenses)}
                                    </p>
                                    <p className="mt-0.5 text-xs text-blue-100/75 tabular-nums">
                                        {s.expensesCount} del día · {s.fixedOccurrencesCount} fijos
                                    </p>
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs text-blue-100/85">Productos vendidos</p>
                                    <p className="mt-1 text-lg sm:text-xl font-bold text-white tabular-nums truncate">
                                        {formatCurrency(s.productsSoldTotal)}
                                    </p>
                                    <p className="mt-0.5 text-xs text-blue-100/75 tabular-nums">
                                        {s.productsSoldCount}{" "}
                                        {s.productsSoldCount === 1 ? "unidad" : "unidades"}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white border border-stone-200 p-5 sm:p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-sm font-medium text-stone-600">
                                        Agenda del período
                                    </p>
                                    <span className="text-xs font-semibold bg-[#0b3a60]/10 text-[#0b3a60] px-2.5 py-1 tabular-nums">
                                        Hoy: {s.todayShifts}
                                    </span>
                                </div>
                                <div className="mt-2 flex items-baseline gap-2.5">
                                    <p className="text-3xl sm:text-4xl font-bold text-stone-900 tabular-nums">
                                        {s.totalShifts}
                                    </p>
                                    <span className="text-sm text-stone-600">
                                        {s.totalShifts === 1 ? "turno" : "turnos"} ({confirmedPercent}% confirmados)
                                    </span>
                                </div>

                                <div
                                    className="mt-4 h-2 w-full bg-stone-100"
                                    aria-hidden="true"
                                >
                                    <div
                                        className="h-full bg-emerald-700 transition-[width] duration-300"
                                        style={{ width: `${confirmedPercent}%` }}
                                    />
                                </div>

                                <div className="mt-3 flex items-center justify-between text-xs sm:text-sm tabular-nums">
                                    <span className="inline-flex items-center gap-1.5 text-stone-700">
                                        <span className="w-2 h-2 bg-emerald-700 inline-block" />
                                        Confirmados: <strong className="text-stone-900">{s.confirmedShifts}</strong>
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 text-stone-700">
                                        <span className="w-2 h-2 bg-amber-500 inline-block" />
                                        Pendientes: <strong className="text-stone-900">{s.pendingShifts}</strong>
                                    </span>
                                </div>
                            </div>

                            <div className="mt-5 bg-stone-50 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
                                <div className="flex items-center gap-1.5 tabular-nums">
                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                                    <span className="font-bold text-stone-900">{s.avgRating}</span>
                                    <span className="text-stone-600">
                                        ({s.totalReviews} {s.totalReviews === 1 ? "reseña" : "reseñas"})
                                    </span>
                                </div>
                                <p className="text-xs text-stone-600 tabular-nums">
                                    {s.totalServices} servicios · {s.totalProducts} productos · {s.totalLocations} sucursales
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Charts Row 1 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <ChartPanel title="Ingresos por día" meta={formatCurrency(s.income)}>
                            <ResponsiveContainer width="100%" height={200}>
                                <AreaChart
                                    data={data.incomeChart}
                                    margin={{ top: 6, right: 4, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={formatShortDate}
                                        tick={{ fontSize: 11, fill: "#57534e" }}
                                        axisLine={false}
                                        tickLine={false}
                                        interval="preserveStartEnd"
                                    />
                                    <YAxis
                                        tick={{ fontSize: 11, fill: "#57534e" }}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={formatAxisCurrency}
                                        width={44}
                                    />
                                    <Tooltip content={<CustomTooltip currency />} />
                                    <Area
                                        type="monotone"
                                        dataKey="income"
                                        name="Ingresos"
                                        stroke={BRAND}
                                        strokeWidth={2}
                                        fill={BRAND}
                                        fillOpacity={0.08}
                                        dot={false}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </ChartPanel>

                        <ChartPanel
                            title="Turnos por día"
                            meta={`${s.confirmedShifts} confirmados de ${s.totalShifts}`}
                        >
                            <ResponsiveContainer width="100%" height={200}>
                                <AreaChart
                                    data={data.shiftsChart}
                                    margin={{ top: 6, right: 4, left: -16, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={formatShortDate}
                                        tick={{ fontSize: 11, fill: "#57534e" }}
                                        axisLine={false}
                                        tickLine={false}
                                        interval="preserveStartEnd"
                                    />
                                    <YAxis
                                        tick={{ fontSize: 11, fill: "#57534e" }}
                                        axisLine={false}
                                        tickLine={false}
                                        allowDecimals={false}
                                        width={32}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{ fontSize: 12 }} />
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        name="Total"
                                        stroke={BRAND}
                                        strokeWidth={2}
                                        fill={BRAND}
                                        fillOpacity={0.08}
                                        dot={false}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="confirmed"
                                        name="Confirmados"
                                        stroke={CONFIRMED_GREEN}
                                        strokeWidth={2}
                                        fill={CONFIRMED_GREEN}
                                        fillOpacity={0.08}
                                        dot={false}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </ChartPanel>
                    </div>

                    {/* Charts Row 2: Sucursales & Reseñas */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <ChartPanel
                            title="Turnos por sucursal"
                            meta={`${s.totalLocations} ${s.totalLocations === 1 ? "sede" : "sedes"}`}
                        >
                            {data.locationChart.length === 0 ? (
                                <div className="flex items-center justify-center h-44 text-stone-500 text-sm">
                                    No hay turnos registrados en este período.
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart
                                        data={data.locationChart}
                                        margin={{ top: 6, right: 4, left: -16, bottom: 0 }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#e7e5e4"
                                            vertical={false}
                                        />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fontSize: 11, fill: "#57534e" }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 11, fill: "#57534e" }}
                                            axisLine={false}
                                            tickLine={false}
                                            allowDecimals={false}
                                            width={32}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar
                                            dataKey="turnos"
                                            name="Turnos"
                                            fill={BRAND}
                                            radius={[0, 0, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </ChartPanel>

                        <section className="bg-white border border-stone-200 p-5 sm:p-6">
                            <div className="flex items-baseline justify-between gap-3 mb-4">
                                <h2 className="text-sm font-semibold text-stone-900">
                                    Últimas reseñas
                                </h2>
                                <span className="text-xs font-medium text-stone-600 tabular-nums">
                                    Promedio {s.avgRating} / 5
                                </span>
                            </div>

                            {data.recentReviews.length === 0 ? (
                                <div className="flex items-center justify-center h-44 text-stone-500 text-sm">
                                    Todavía no hay reseñas de clientes.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {data.recentReviews.map((review, index) => (
                                        <div key={index} className="bg-stone-50 p-3.5">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <span className="text-sm font-semibold text-stone-900 truncate">
                                                    {review.author}
                                                </span>
                                                <Stars rating={review.rating} />
                                            </div>
                                            <p className="text-xs sm:text-sm text-stone-700 line-clamp-2 leading-relaxed">
                                                {review.comment}
                                            </p>
                                            <p className="text-xs text-stone-500 mt-1 tabular-nums">
                                                {formatDisplayDate(review.createdAt)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </>
            )}
        </div>
    );
}
