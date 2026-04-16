import { Pencil, Plus, Trash2 } from "lucide-react";
import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { FixedExpenseBreakdown, FixedExpenseRecord, SummaryResponse } from "../domain/expenses.types";
import { ActionIconButton } from "./action-icon-button";
import { formatCurrency, formatDate, getFixedBillingLabel } from "./formatters";

type FixedExpensesTableProps = {
    fixedExpenses: FixedExpenseRecord[];
    summary: SummaryResponse | null;
    onAdd: () => void;
    onEdit: (fixedExpense: FixedExpenseRecord) => void;
    onDelete: (id: string, label: string) => void;
};

function FixedExpenseActions({
    fixedExpense,
    onEdit,
    onDelete,
}: {
    fixedExpense: FixedExpenseRecord;
    onEdit: () => void;
    onDelete: () => void;
}) {
    return (
        <div className="flex gap-2">
            <ActionIconButton
                title="Editar gasto fijo"
                onClick={onEdit}
                className="border-stone-200 text-stone-700 hover:bg-stone-100"
            >
                <Pencil className="h-4 w-4" />
            </ActionIconButton>
            <ActionIconButton
                title="Eliminar gasto fijo"
                onClick={onDelete}
                className="border-red-200 text-red-600 hover:bg-red-50"
            >
                <Trash2 className="h-4 w-4" />
            </ActionIconButton>
        </div>
    );
}

function ImpactBadge({ impact }: { impact: FixedExpenseBreakdown | undefined }) {
    const count = impact?.occurrenceCount ?? 0;

    return (
        <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 whitespace-nowrap">
            {count > 0 ? `${count} ${count === 1 ? "vez" : "veces"}` : "Sin impacto"}
        </span>
    );
}

function MobileCard({
    fixedExpense,
    impact,
    onEdit,
    onDelete,
}: {
    fixedExpense: FixedExpenseRecord;
    impact: FixedExpenseBreakdown | undefined;
    onEdit: () => void;
    onDelete: () => void;
}) {
    return (
        <div className="border-t border-stone-100 p-4 first:border-t-0">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="font-semibold text-stone-900">{fixedExpense.name}</p>
                    {fixedExpense.description && (
                        <p className="mt-0.5 text-sm text-stone-500">{fixedExpense.description}</p>
                    )}
                </div>
                <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-stone-900">
                        {formatCurrency(impact?.totalForPeriod ?? 0)}
                    </p>
                    <p className="text-xs text-stone-500">
                        {formatCurrency(fixedExpense.amount)}/mes
                    </p>
                </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-stone-600">
                <span className="rounded-lg bg-stone-100 px-2 py-1">
                    {formatDate(fixedExpense.startsAt)}
                </span>
                <span className="rounded-lg bg-stone-100 px-2 py-1">
                    {getFixedBillingLabel(fixedExpense.startsAt)}
                </span>
                <ImpactBadge impact={impact} />
            </div>
            <div className="mt-3 flex justify-end">
                <FixedExpenseActions
                    fixedExpense={fixedExpense}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </div>
        </div>
    );
}

export function FixedExpensesTable({
    fixedExpenses,
    summary,
    onAdd,
    onEdit,
    onDelete,
}: FixedExpensesTableProps) {
    const breakdownMap = new Map(
        (summary?.fixedExpenseBreakdown ?? []).map((item) => [item.id, item])
    );

    return (
        <Card className="overflow-hidden border-stone-200 bg-white">
            <div className="flex flex-col gap-4 border-b border-stone-200 bg-stone-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold text-stone-900">Tabla de gastos fijos</h2>
                    <p className="mt-1 text-sm text-stone-600">
                        Se aplican automáticamente mes a mes según su fecha de inicio.
                    </p>
                </div>
                <Button
                    onClick={onAdd}
                    startIcon={<Plus className="h-4 w-4" />}
                >
                    Nuevo gasto fijo
                </Button>
            </div>

            {fixedExpenses.length === 0 ? (
                <p className="px-6 py-10 text-center text-sm text-stone-500">
                    No hay gastos fijos cargados.
                </p>
            ) : (
                <>
                    <div className="lg:hidden">
                        {fixedExpenses.map((fixedExpense) => (
                            <MobileCard
                                key={fixedExpense.id}
                                fixedExpense={fixedExpense}
                                impact={breakdownMap.get(fixedExpense.id)}
                                onEdit={() => onEdit(fixedExpense)}
                                onDelete={() => onDelete(fixedExpense.id, fixedExpense.name)}
                            />
                        ))}
                    </div>

                    <div className="hidden lg:block">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-stone-100 text-stone-600">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Concepto</th>
                                    <th className="px-6 py-4 font-semibold">Inicio</th>
                                    <th className="px-6 py-4 font-semibold">Frecuencia</th>
                                    <th className="px-6 py-4 font-semibold">Impacto</th>
                                    <th className="px-6 py-4 font-semibold text-right">Monto</th>
                                    <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fixedExpenses.map((fixedExpense) => {
                                    const impact = breakdownMap.get(fixedExpense.id);

                                    return (
                                        <tr key={fixedExpense.id} className="border-t border-stone-100 align-top">
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-stone-900">{fixedExpense.name}</p>
                                                {fixedExpense.description && (
                                                    <p className="mt-1 max-w-xs text-stone-500">
                                                        {fixedExpense.description}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-stone-700">
                                                {formatDate(fixedExpense.startsAt)}
                                            </td>
                                            <td className="px-6 py-4 text-stone-700">
                                                {getFixedBillingLabel(fixedExpense.startsAt)}
                                            </td>
                                            <td className="px-6 py-4 text-stone-700">
                                                <ImpactBadge impact={impact} />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="font-semibold text-stone-900">
                                                    {formatCurrency(impact?.totalForPeriod ?? 0)}
                                                </div>
                                                <div className="text-xs text-stone-500">
                                                    {formatCurrency(fixedExpense.amount)} por mes
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <FixedExpenseActions
                                                        fixedExpense={fixedExpense}
                                                        onEdit={() => onEdit(fixedExpense)}
                                                        onDelete={() => onDelete(fixedExpense.id, fixedExpense.name)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </Card>
    );
}
