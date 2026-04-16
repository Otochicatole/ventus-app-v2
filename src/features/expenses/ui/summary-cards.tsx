import { HandCoins, Landmark, ReceiptText, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { SummaryResponse } from "../domain/expenses.types";
import { formatCurrency } from "./formatters";

type SummaryCardsProps = {
    summary: SummaryResponse | null;
};

export function SummaryCards({ summary }: SummaryCardsProps) {
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card className="border-emerald-200 bg-emerald-50/70">
                <CardContent className="space-y-3 p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-emerald-900">Ganancias</span>
                        <Landmark className="h-5 w-5 text-emerald-700" />
                    </div>
                    <p className="text-3xl font-bold text-emerald-950">
                        {formatCurrency(summary?.income ?? 0)}
                    </p>
                    <p className="text-sm text-emerald-800">
                        {summary?.paymentsCount ?? 0} cobros dentro del período
                    </p>
                </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50/80">
                <CardContent className="space-y-3 p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-amber-900">Gastos fijos</span>
                        <ReceiptText className="h-5 w-5 text-amber-700" />
                    </div>
                    <p className="text-3xl font-bold text-amber-950">
                        {formatCurrency(summary?.fixedExpensesTotal ?? 0)}
                    </p>
                    <p className="text-sm text-amber-800">
                        {summary?.fixedExpenseOccurrencesCount ?? 0} impactos automáticos
                    </p>
                </CardContent>
            </Card>

            <Card className="border-rose-200 bg-rose-50/80">
                <CardContent className="space-y-3 p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-rose-900">Gastos del día</span>
                        <HandCoins className="h-5 w-5 text-rose-700" />
                    </div>
                    <p className="text-3xl font-bold text-rose-950">
                        {formatCurrency(summary?.normalExpenses ?? 0)}
                    </p>
                    <p className="text-sm text-rose-800">
                        {summary?.normalExpensesCount ?? 0} registros cargados
                    </p>
                </CardContent>
            </Card>

            <Card className="border-stone-200 bg-white">
                <CardContent className="space-y-3 p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-stone-600">Presupuesto neto</span>
                        <Wallet className="h-5 w-5 text-stone-700" />
                    </div>
                    <p className={`text-3xl font-bold ${(summary?.budget ?? 0) >= 0 ? "text-stone-950" : "text-red-600"}`}>
                        {formatCurrency(summary?.budget ?? 0)}
                    </p>
                    <p className="text-sm text-stone-500">
                        Ganancias menos gastos totales del período
                    </p>
                </CardContent>
            </Card>
        </section>
    );
}
