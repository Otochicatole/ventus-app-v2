"use client";

import { useState } from "react";
import type { FixedExpenseFormState, FixedExpenseRecord } from "../domain/expenses.types";
import { getTodayDateInput } from "../domain/finance";
import * as api from "../infrastructure/expenses.api";

function defaultForm(): FixedExpenseFormState {
    return { name: "", amount: "", description: "", startsAt: getTodayDateInput() };
}

export function useFixedExpenseForm() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<FixedExpenseRecord | null>(null);
    const [form, setForm] = useState<FixedExpenseFormState>(defaultForm);
    const [submitting, setSubmitting] = useState(false);

    const open = (fixedExpense?: FixedExpenseRecord) => {
        if (fixedExpense) {
            setEditing(fixedExpense);
            setForm({
                name: fixedExpense.name,
                amount: fixedExpense.amount.toString(),
                description: fixedExpense.description ?? "",
                startsAt: fixedExpense.startsAt.split("T")[0],
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

    const updateField = (field: keyof FixedExpenseFormState, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const submit = async (): Promise<string> => {
        setSubmitting(true);

        try {
            if (editing) {
                await api.updateFixedExpense(editing.id, form);
                close();
                return "Gasto fijo actualizado";
            }

            await api.createFixedExpense(form);
            close();
            return "Gasto fijo agregado";
        } finally {
            setSubmitting(false);
        }
    };

    return { dialogOpen, editing, form, submitting, open, close, updateField, submit };
}
