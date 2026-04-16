"use client";

import { useState } from "react";
import type { ExpenseFormState, ExpenseRecord } from "../domain/expenses.types";
import { getTodayDateInput } from "../domain/finance";
import * as api from "../infrastructure/expenses.api";

function defaultForm(): ExpenseFormState {
    return { name: "", amount: "", description: "", spentAt: getTodayDateInput() };
}

export function useExpenseForm() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<ExpenseRecord | null>(null);
    const [form, setForm] = useState<ExpenseFormState>(defaultForm);
    const [submitting, setSubmitting] = useState(false);

    const open = (expense?: ExpenseRecord) => {
        if (expense) {
            setEditing(expense);
            setForm({
                name: expense.name,
                amount: expense.amount.toString(),
                description: expense.description ?? "",
                spentAt: expense.spentAt.split("T")[0],
            });
        } else {
            setEditing(null);
            setForm(defaultForm());
        }

        setDialogOpen(true);
    };

    const close = () => {
        setDialogOpen(false);
        setEditing(null);
        setForm(defaultForm());
    };

    const updateField = (field: keyof ExpenseFormState, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const submit = async (): Promise<string> => {
        setSubmitting(true);

        try {
            if (editing) {
                await api.updateExpense(editing.id, form);
                close();
                return "Gasto actualizado";
            }

            await api.createExpense(form);
            close();
            return "Gasto agregado";
        } finally {
            setSubmitting(false);
        }
    };

    return { dialogOpen, editing, form, submitting, open, close, updateField, submit };
}
