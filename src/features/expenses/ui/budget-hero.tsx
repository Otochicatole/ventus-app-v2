import { CalendarRange, PiggyBank, Wallet } from "lucide-react";
import type { BudgetPeriod } from "../domain/finance";
import type { SummaryResponse } from "../domain/expenses.types";
import { formatCurrency } from "./formatters";
import { SummaryCards } from "./summary-cards";

const PERIOD_OPTIONS: Array<{ value: BudgetPeriod; label: string }> = [
    { value: "week", label: "Semana" },
    { value: "month", label: "Mes" },
    { value: "year", label: "Año" },
];

type BudgetHeroProps = {
    selectedPreset: BudgetPeriod | "custom";
    startDate: string;
    endDate: string;
    summary: SummaryResponse | null;
    isInvalidDateRange: boolean;
    onPresetChange: (period: BudgetPeriod) => void;
    onStartDateChange: (value: string) => void;
    onEndDateChange: (value: string) => void;
    onCustomPreset: () => void;
};

export function BudgetHero({
    selectedPreset,
    startDate,
    endDate,
    summary,
    isInvalidDateRange,
    onPresetChange,
    onStartDateChange,
    onEndDateChange,
    onCustomPreset,
}: BudgetHeroProps) {
    const budget = summary?.budget ?? 0;

    return (
        <section className="overflow-clip rounded-3xl border border-stone-200 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_35%),linear-gradient(135deg,#fffdf7,#f5efe3_55%,#eef9f3)] shadow-sm sm:rounded-4xl">
            <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <div className="space-y-4 sm:space-y-5">
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-emerald-700 backdrop-blur sm:px-4 sm:py-2 sm:text-sm">
                        <PiggyBank className="h-4 w-4" />
                        Presupuesto operativo
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl md:text-4xl">
                            Ganancias menos gastos, en el período que elijas
                        </h1>
                        <p className="mt-2 text-sm text-stone-600 sm:mt-3 sm:max-w-2xl md:text-base">
                            Las ganancias salen de los cobros cargados y el presupuesto neto se
                            calcula restando gastos fijos recurrentes y gastos del día a día.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                        {PERIOD_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => onPresetChange(option.value)}
                                className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors sm:px-4 sm:py-2 ${
                                    selectedPreset === option.value
                                        ? "bg-stone-900 text-white"
                                        : "bg-white text-stone-700 ring-1 ring-stone-200 hover:bg-stone-50"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={onCustomPreset}
                            className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors sm:px-4 sm:py-2 ${
                                selectedPreset === "custom"
                                    ? "bg-emerald-600 text-white"
                                    : "bg-white text-stone-700 ring-1 ring-stone-200 hover:bg-stone-50"
                            }`}
                        >
                            Rango libre
                        </button>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                        <div className="relative flex-1">
                            <CalendarRange className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                            <input
                                type="date"
                                value={startDate}
                                onChange={(event) => onStartDateChange(event.target.value)}
                                className="w-full rounded-full border border-stone-200 bg-white py-2 pl-10 pr-4 text-sm text-stone-700 outline-none transition focus:border-emerald-500"
                            />
                        </div>
                        <div className="relative flex-1">
                            <CalendarRange className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                            <input
                                type="date"
                                value={endDate}
                                onChange={(event) => onEndDateChange(event.target.value)}
                                className="w-full rounded-full border border-stone-200 bg-white py-2 pl-10 pr-4 text-sm text-stone-700 outline-none transition focus:border-emerald-500"
                            />
                        </div>
                    </div>
                    {isInvalidDateRange && (
                        <p className="text-sm font-medium text-red-600">
                            La fecha desde no puede ser mayor que la fecha hasta.
                        </p>
                    )}
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5 text-white shadow-[0_24px_80px_rgba(28,25,23,0.24)] sm:rounded-[1.75rem] sm:p-6">
                    <p className="text-xs uppercase tracking-[0.16em] text-emerald-300 sm:text-sm sm:tracking-[0.24em]">
                        {summary?.range.label}
                    </p>
                    <div className="mt-4 flex flex-col gap-4 sm:mt-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                            <p className="text-sm text-stone-300">Presupuesto disponible</p>
                            <p
                                className={`mt-1 truncate text-3xl font-bold tracking-tight tabular-nums sm:mt-2 sm:text-4xl ${
                                    budget >= 0 ? "text-white" : "text-rose-300"
                                }`}
                            >
                                {formatCurrency(budget)}
                            </p>
                            <p className="mt-1 text-xs text-stone-300">
                                Ingresos menos gastos totales del período
                            </p>
                        </div>
                        <div className="flex items-center justify-between gap-3 sm:justify-end sm:gap-4">
                            <div className="min-w-0 rounded-xl border border-white/10 bg-white/5 px-4 py-3 sm:rounded-2xl">
                                <p className="text-xs text-rose-300">Gastos totales</p>
                                <p className="mt-1 truncate text-lg font-semibold text-white tabular-nums sm:text-xl">
                                    {formatCurrency(summary?.totalExpenses ?? 0)}
                                </p>
                            </div>
                            <div className="shrink-0 rounded-2xl bg-white/10 p-3 text-emerald-300 sm:p-4">
                                <Wallet className="h-6 w-6 sm:h-8 sm:w-8" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 border-t border-white/10 pt-5 sm:mt-6 sm:pt-6">
                        <SummaryCards summary={summary} />
                    </div>
                </div>
            </div>
        </section>
    );
}
