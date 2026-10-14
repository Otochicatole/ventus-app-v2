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
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Star,
    Users,
    MapPin,
    CheckCircle,
    Clock,
    Scissors,
    BarChart2,
    ShoppingBag,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface DashboardData {
    period: { label: string; start: string; end: string };
    summary: {
        totalShifts: number;
        confirmedShifts: number;
        pendingShifts: number;
        totalLocations: number;
        totalServices: number;
        totalProducts?: number;
        totalReviews: number;
        avgRating: number;
        income: number;
        expenses: number;
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
    { value: "quarter", label: "Trim." },
    { value: "year", label: "Año" },
];

const BRAND = "#0b3a60";

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n: number) {
    // Compact format for small screens: $1.2k instead of $1.200
    if (Math.abs(n) >= 1_000_000) {
        return `$${(n / 1_000_000).toFixed(1)}M`;
    }
    if (Math.abs(n) >= 1_000) {
        return `$${(n / 1_000).toFixed(1)}k`;
    }
    return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}

function fmtDate(dateStr: string) {
    const [, m, d] = dateStr.split("-");
    return `${d}/${m}`;
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({
    label,
    value,
    icon: Icon,
    sub,
    accent = false,
    positive,
}: {
    label: string;
    value: string | number;
    icon: React.ElementType;
    sub?: string;
    accent?: boolean;
    positive?: boolean;
}) {
    return (
        <div
            className={`relative overflow-hidden border rounded-xl p-3.5 sm:p-4.5 transition-all hover:shadow-sm ${
                accent ? "bg-[#0b3a60] border-[#0b3a60] text-white shadow-xs" : "bg-white border-stone-200 text-stone-900"
            }`}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                    <p className={`text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-1 sm:mb-2 leading-tight ${accent ? "text-blue-200" : "text-stone-500"}`}>
                        {label}
                    </p>
                    <p className={`text-xl sm:text-2xl font-bold truncate tabular-nums ${accent ? "text-white" : "text-stone-900"}`}>{value}</p>
                    {sub && (
                        <p className={`text-[10px] sm:text-xs mt-1.5 flex items-center gap-1 leading-tight ${accent ? "text-blue-200" : positive === true ? "text-emerald-600" : positive === false ? "text-red-500" : "text-stone-400"}`}>
                            {positive === true && <TrendingUp className="w-3 h-3 shrink-0" />}
                            {positive === false && <TrendingDown className="w-3 h-3 shrink-0" />}
                            <span className="truncate">{sub}</span>
                        </p>
                    )}
                </div>
                <div className={`p-2 rounded-lg shrink-0 ${accent ? "bg-white/10" : "bg-stone-50 border border-stone-100"}`}>
                    <Icon className={`w-4 h-4 ${accent ? "text-white" : "text-[#0b3a60]"}`} />
                </div>
            </div>
        </div>
    );
}

// ── Chart wrapper ─────────────────────────────────────────────────────────────
function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-6 shadow-xs">
            <h3 className="text-xs font-bold tracking-widest uppercase text-stone-500 mb-3 sm:mb-4">{title}</h3>
            {children}
        </div>
    );
}

// ── Custom tooltip ─────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label, currency = false }: {
    active?: boolean;
    payload?: { name: string; value: number; color: string }[];
    label?: string;
    currency?: boolean;
}) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-stone-200 rounded-lg shadow-md px-3 py-2 text-xs tabular-nums">
            <p className="font-semibold text-stone-700 mb-1">{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color }} className="font-medium">
                    {p.name}: {currency ? fmt(p.value) : p.value}
                </p>
            ))}
        </div>
    );
}

// ── Stars ─────────────────────────────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <Star
                    key={s}
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${s <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}`}
                />
            ))}
        </div>
    );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function DashboardCharts() {
    const [period, setPeriod] = useState("month");
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/dashboard?period=${period}`);
            if (res.ok) setData(await res.json());
        } finally {
            setLoading(false);
        }
    }, [period]);

    useEffect(() => { load(); }, [load]);

    const s = data?.summary;

    return (
        <div className="space-y-5 sm:space-y-8">

            {/* ── Period Selector ── */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <BarChart2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Período</span>
                    {data && (
                        <span className="text-[10px] text-gray-400 ml-auto">
                            {new Date(data.period.start).toLocaleDateString("es-AR")} – {new Date(data.period.end).toLocaleDateString("es-AR")}
                        </span>
                    )}
                </div>
                <div className="flex flex-wrap gap-1 p-1 bg-stone-100 rounded-lg border border-stone-200">
                    {PERIODS.map((p) => (
                        <button
                            key={p.value}
                            onClick={() => setPeriod(p.value)}
                            className={`flex-1 min-w-[50px] py-1.5 px-2 text-[11px] sm:text-xs font-semibold tracking-wide rounded-md transition-all cursor-pointer ${
                                period === p.value
                                    ? "bg-[#0b3a60] text-white shadow-xs"
                                    : "text-stone-600 hover:text-stone-900 hover:bg-white/60"
                            }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Skeleton / Loading overlay ── */}
            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-24 bg-stone-100 border border-stone-200 rounded-xl animate-pulse" />
                    ))}
                </div>
            )}

            {!loading && s && (
                <>
                    {/* ── KPI Cards — 1 col on mobile, 2 on sm, 3 on md, 6 on lg ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                        <StatCard accent label="Ingresos" value={fmt(s.income)} icon={DollarSign} sub={`Total cobrado`} positive={s.income >= 0} />
                        <StatCard label="Ganancia" value={fmt(s.profit)} icon={TrendingUp} sub={s.profit >= 0 ? "Balance +" : "Balance -"} positive={s.profit >= 0} />
                        <StatCard label="Gastos" value={fmt(s.expenses)} icon={TrendingDown} positive={false} sub="Total período" />
                        <StatCard label="Turnos" value={s.totalShifts} icon={Users} sub={`${s.confirmedShifts} conf.`} />
                        <StatCard label="Rating" value={`${s.avgRating}★`} icon={Star} sub={`${s.totalReviews} reseñas`} />
                        <StatCard label="Servicios" value={s.totalServices} icon={Scissors} sub={`${s.totalLocations} suc.`} />
                    </div>

                    {/* ── Confirmation split — 1 col on mobile, 2 on sm, 5 on md ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                        <StatCard label="Confirmados" value={s.confirmedShifts} icon={CheckCircle} sub="Verificados" />
                        <StatCard label="Pendientes" value={s.pendingShifts} icon={Clock} sub="Sin confirmar" />
                        <StatCard label="Sucursales" value={s.totalLocations} icon={MapPin} />
                        <StatCard label="Productos" value={s.totalProducts ?? 0} icon={ShoppingBag} sub="Activos" />
                        <StatCard label="Reseñas" value={s.totalReviews} icon={Star} />
                    </div>

                    {/* ── Charts row 1 — stack on mobile ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        {/* Shifts over time */}
                        <ChartCard title="Turnos por día">
                            <ResponsiveContainer width="100%" height={180}>
                                <AreaChart data={data.shiftsChart} margin={{ top: 4, right: 2, left: -28, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={BRAND} stopOpacity={0.15} />
                                            <stop offset="95%" stopColor={BRAND} stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="confirmedGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#16a34a" stopOpacity={0.12} />
                                            <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="date" tickFormatter={fmtDate} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                                    <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} width={28} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{ fontSize: 11 }} />
                                    <Area type="monotone" dataKey="total" name="Total" stroke={BRAND} strokeWidth={2} fill="url(#totalGrad)" dot={false} />
                                    <Area type="monotone" dataKey="confirmed" name="Confirmados" stroke="#16a34a" strokeWidth={2} fill="url(#confirmedGrad)" dot={false} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </ChartCard>

                        {/* Income over time */}
                        <ChartCard title="Ingresos por día">
                            <ResponsiveContainer width="100%" height={180}>
                                <AreaChart data={data.incomeChart} margin={{ top: 4, right: 2, left: -4, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={BRAND} stopOpacity={0.15} />
                                            <stop offset="95%" stopColor={BRAND} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="date" tickFormatter={fmtDate} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                                    <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} width={36} />
                                    <Tooltip content={<CustomTooltip currency />} />
                                    <Area type="monotone" dataKey="income" name="Ingresos" stroke={BRAND} strokeWidth={2} fill="url(#incomeGrad)" dot={false} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </div>

                    {/* ── Charts row 2 ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        {/* Turnos por sucursal */}
                        <ChartCard title="Turnos por sucursal">
                            {data.locationChart.length === 0 ? (
                                <div className="flex items-center justify-center h-32 text-gray-400 text-xs">Sin datos</div>
                            ) : (
                                <ResponsiveContainer width="100%" height={180}>
                                    <BarChart data={data.locationChart} margin={{ top: 4, right: 2, left: -28, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} width={28} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="turnos" name="Turnos" fill={BRAND} radius={[0, 0, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </ChartCard>

                        {/* Recent Reviews */}
                        <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-6 shadow-xs">
                            <h3 className="text-xs font-bold tracking-widest uppercase text-stone-500 mb-3 sm:mb-4">Últimas reseñas</h3>
                            {data.recentReviews.length === 0 ? (
                                <div className="flex items-center justify-center h-32 text-stone-400 text-xs">Sin reseñas</div>
                            ) : (
                                <div className="space-y-3 sm:space-y-4">
                                    {data.recentReviews.map((r, i) => (
                                        <div key={i} className="border-b border-stone-100 pb-3 last:border-0 last:pb-0">
                                            <div className="flex items-center justify-between mb-1 gap-2">
                                                <span className="text-xs sm:text-sm font-semibold text-stone-800 truncate">{r.author}</span>
                                                <Stars rating={r.rating} />
                                            </div>
                                            <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">{r.comment}</p>
                                            <p className="text-[10px] text-stone-400 mt-1 tabular-nums">
                                                {new Date(r.createdAt).toLocaleDateString("es-AR")}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
