import { HandCoins, Landmark, ReceiptText, ShoppingBag } from "lucide-react";
import type { SummaryResponse } from "../domain/expenses.types";
import { formatCurrency } from "./formatters";

type SummaryCardsProps = {
    summary: SummaryResponse | null;
};

export function SummaryCards({ summary }: SummaryCardsProps) {
    const paymentsCount = summary?.paymentsCount ?? 0;
    const productsSoldCount = summary?.productsSoldCount ?? 0;
    const fixedOccurrencesCount = summary?.fixedExpenseOccurrencesCount ?? 0;
    const normalExpensesCount = summary?.normalExpensesCount ?? 0;

    const cards = [
        {
            label: "Ingresos",
            value: formatCurrency(summary?.income ?? 0),
            subtitle: `${paymentsCount} ${paymentsCount === 1 ? "cobro" : "cobros"} dentro del período`,
            icon: Landmark,
            accentClass: "text-emerald-300",
        },
        {
            label: "Productos vendidos",
            value: formatCurrency(summary?.productsSoldTotal ?? 0),
            subtitle: `${productsSoldCount} ${productsSoldCount === 1 ? "producto vendido" : "productos vendidos"}`,
            icon: ShoppingBag,
            accentClass: "text-teal-300",
        },
        {
            label: "Gastos fijos",
            value: formatCurrency(summary?.fixedExpensesTotal ?? 0),
            subtitle: `${fixedOccurrencesCount} ${fixedOccurrencesCount === 1 ? "impacto automático" : "impactos automáticos"}`,
            icon: ReceiptText,
            accentClass: "text-amber-300",
        },
        {
            label: "Gastos del día",
            value: formatCurrency(summary?.normalExpenses ?? 0),
            subtitle: `${normalExpensesCount} ${normalExpensesCount === 1 ? "registro cargado" : "registros cargados"}`,
            icon: HandCoins,
            accentClass: "text-rose-300",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <div
                        key={card.label}
                        className="flex min-w-0 flex-col justify-between gap-2.5 rounded-xl border border-white/10 bg-white/5 p-4 sm:rounded-2xl sm:p-5"
                    >
                        <div className="flex items-center justify-between gap-2">
                            <span className={`text-sm font-medium ${card.accentClass}`}>
                                {card.label}
                            </span>
                            <Icon className={`h-4 w-4 shrink-0 ${card.accentClass}`} />
                        </div>
                        <p className="truncate text-2xl font-bold text-white tabular-nums sm:text-3xl">
                            {card.value}
                        </p>
                        <p className={`text-xs sm:text-sm ${card.accentClass}`}>
                            {card.subtitle}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}
