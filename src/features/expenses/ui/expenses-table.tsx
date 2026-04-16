import { Pencil, Plus, Trash2 } from "lucide-react";
import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ExpenseRecord } from "../domain/expenses.types";
import { ActionIconButton } from "./action-icon-button";
import { formatCurrency, formatDate } from "./formatters";

type ExpensesTableProps = {
    expenses: ExpenseRecord[];
    rangeLabel: string | undefined;
    onAdd: () => void;
    onEdit: (expense: ExpenseRecord) => void;
    onDelete: (id: string, label: string) => void;
};

function ExpenseActions({
    onEdit,
    onDelete,
}: {
    onEdit: () => void;
    onDelete: () => void;
}) {
    return (
        <div className="flex gap-2">
            <ActionIconButton
                title="Editar gasto"
                onClick={onEdit}
                className="border-stone-200 text-stone-700 hover:bg-stone-100"
            >
                <Pencil className="h-4 w-4" />
            </ActionIconButton>
            <ActionIconButton
                title="Eliminar gasto"
                onClick={onDelete}
                className="border-red-200 text-red-600 hover:bg-red-50"
            >
                <Trash2 className="h-4 w-4" />
            </ActionIconButton>
        </div>
    );
}

function MobileCard({
    expense,
    onEdit,
    onDelete,
}: {
    expense: ExpenseRecord;
    onEdit: () => void;
    onDelete: () => void;
}) {
    return (
        <div className="border-t border-stone-100 p-4 first:border-t-0">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="font-semibold text-stone-900">{expense.name}</p>
                    {expense.description && (
                        <p className="mt-0.5 text-sm text-stone-500">{expense.description}</p>
                    )}
                </div>
                <p className="shrink-0 text-lg font-bold text-stone-900">
                    {formatCurrency(expense.amount)}
                </p>
            </div>
            <div className="mt-3 flex items-center justify-between">
                <span className="rounded-lg bg-stone-100 px-2 py-1 text-xs text-stone-600">
                    {formatDate(expense.spentAt)}
                </span>
                <ExpenseActions onEdit={onEdit} onDelete={onDelete} />
            </div>
        </div>
    );
}

export function ExpensesTable({
    expenses,
    rangeLabel,
    onAdd,
    onEdit,
    onDelete,
}: ExpensesTableProps) {
    return (
        <Card className="overflow-hidden border-stone-200 bg-white">
            <div className="flex flex-col gap-4 border-b border-stone-200 bg-stone-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold text-stone-900">Tabla de gastos del día a día</h2>
                    <p className="mt-1 text-sm text-stone-600">
                        Los registros se filtran por el rango de fechas seleccionado usando la fecha del gasto.
                    </p>
                </div>
                <Button
                    onClick={onAdd}
                    startIcon={<Plus className="h-4 w-4" />}
                >
                    Nuevo gasto
                </Button>
            </div>

            {expenses.length === 0 ? (
                <p className="px-6 py-10 text-center text-sm text-stone-500">
                    No hay gastos cargados en {rangeLabel?.toLowerCase()}.
                </p>
            ) : (
                <>
                    <div className="md:hidden">
                        {expenses.map((expense) => (
                            <MobileCard
                                key={expense.id}
                                expense={expense}
                                onEdit={() => onEdit(expense)}
                                onDelete={() => onDelete(expense.id, expense.name)}
                            />
                        ))}
                    </div>

                    <div className="hidden md:block">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-stone-100 text-stone-600">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Concepto</th>
                                    <th className="px-6 py-4 font-semibold">Fecha</th>
                                    <th className="px-6 py-4 font-semibold text-right">Monto</th>
                                    <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map((expense) => (
                                    <tr key={expense.id} className="border-t border-stone-100 align-top">
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-stone-900">{expense.name}</p>
                                            {expense.description && (
                                                <p className="mt-1 max-w-xs text-stone-500">
                                                    {expense.description}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-stone-700">
                                            {formatDate(expense.spentAt)}
                                        </td>
                                        <td className="px-6 py-4 text-right font-semibold text-stone-900">
                                            {formatCurrency(expense.amount)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end">
                                                <ExpenseActions
                                                    onEdit={() => onEdit(expense)}
                                                    onDelete={() => onDelete(expense.id, expense.name)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </Card>
    );
}
