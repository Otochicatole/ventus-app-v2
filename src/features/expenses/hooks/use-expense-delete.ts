"use client";

import { useState } from "react";
import type { DeleteTarget } from "../domain/expenses.types";
import * as api from "../infrastructure/expenses.api";

export function useExpenseDelete() {
    const [target, setTarget] = useState<DeleteTarget | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const requestDelete = (id: string, type: "expense" | "fixed", label: string) => {
        setTarget({ id, type, label });
    };

    const cancel = () => setTarget(null);

    const confirm = async (): Promise<string> => {
        if (!target) {
            throw new Error("No hay registro para eliminar");
        }

        setSubmitting(true);

        try {
            if (target.type === "fixed") {
                await api.deleteFixedExpense(target.id);
            } else {
                await api.deleteExpense(target.id);
            }

            const message = target.type === "fixed" ? "Gasto fijo eliminado" : "Gasto eliminado";
            setTarget(null);
            return message;
        } finally {
            setSubmitting(false);
        }
    };

    return { target, submitting, requestDelete, cancel, confirm };
}
