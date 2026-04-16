"use client";

import { useState } from "react";
import Alert from "@/components/ui/alert";
import { useExpensesData } from "../hooks/use-expenses-data";
import { useExpenseForm } from "../hooks/use-expense-form";
import { useFixedExpenseForm } from "../hooks/use-fixed-expense-form";
import { useExpenseDelete } from "../hooks/use-expense-delete";
import { BudgetHero } from "./budget-hero";
import { SummaryCards } from "./summary-cards";
import { FixedExpensesTable } from "./fixed-expenses-table";
import { ExpensesTable } from "./expenses-table";
import { ExpenseDialog } from "./expense-dialog";
import { FixedExpenseDialog } from "./fixed-expense-dialog";
import { DeleteExpenseDialog } from "./delete-expense-dialog";

type Message = { type: "success" | "error"; text: string };

export default function ExpensesPage() {
    const data = useExpensesData();
    const expenseForm = useExpenseForm();
    const fixedExpenseForm = useFixedExpenseForm();
    const expenseDelete = useExpenseDelete();
    const [message, setMessage] = useState<Message | null>(null);

    const handleAction = async (action: () => Promise<string>) => {
        setMessage(null);

        try {
            const text = await action();
            setMessage({ type: "success", text });
            await data.refresh();
        } catch (error) {
            setMessage({
                type: "error",
                text: error instanceof Error ? error.message : "Error en la operación",
            });
        }
    };

    if (data.loading && !data.summary) {
        return (
            <div className="flex items-center gap-3 py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"></div>
                <p className="text-stone-600">Cargando presupuesto y gastos...</p>
            </div>
        );
    }

    const activeMessage = message ?? (data.fetchError ? { type: "error" as const, text: data.fetchError } : null);

    return (
        <div className="space-y-8 pb-8">
            <BudgetHero
                selectedPreset={data.selectedPreset}
                startDate={data.startDate}
                endDate={data.endDate}
                summary={data.summary}
                isInvalidDateRange={data.isInvalidDateRange}
                onPresetChange={data.handlePresetRange}
                onStartDateChange={data.handleStartDateChange}
                onEndDateChange={data.handleEndDateChange}
                onCustomPreset={data.handleCustomPreset}
            />

            {activeMessage && <Alert severity={activeMessage.type}>{activeMessage.text}</Alert>}

            <SummaryCards summary={data.summary} />

            <section className="grid gap-6">
                <FixedExpensesTable
                    fixedExpenses={data.fixedExpenses}
                    summary={data.summary}
                    onAdd={() => fixedExpenseForm.open()}
                    onEdit={(fe) => fixedExpenseForm.open(fe)}
                    onDelete={(id, label) => expenseDelete.requestDelete(id, "fixed", label)}
                />
                <ExpensesTable
                    expenses={data.expenses}
                    rangeLabel={data.summary?.range.label}
                    onAdd={() => expenseForm.open()}
                    onEdit={(e) => expenseForm.open(e)}
                    onDelete={(id, label) => expenseDelete.requestDelete(id, "expense", label)}
                />
            </section>

            <ExpenseDialog
                open={expenseForm.dialogOpen}
                editing={Boolean(expenseForm.editing)}
                form={expenseForm.form}
                submitting={expenseForm.submitting}
                onClose={expenseForm.close}
                onSubmit={() => handleAction(expenseForm.submit)}
                onFieldChange={expenseForm.updateField}
            />

            <FixedExpenseDialog
                open={fixedExpenseForm.dialogOpen}
                editing={Boolean(fixedExpenseForm.editing)}
                form={fixedExpenseForm.form}
                submitting={fixedExpenseForm.submitting}
                onClose={fixedExpenseForm.close}
                onSubmit={() => handleAction(fixedExpenseForm.submit)}
                onFieldChange={fixedExpenseForm.updateField}
            />

            <DeleteExpenseDialog
                target={expenseDelete.target}
                submitting={expenseDelete.submitting}
                onClose={expenseDelete.cancel}
                onConfirm={() => handleAction(expenseDelete.confirm)}
            />
        </div>
    );
}
