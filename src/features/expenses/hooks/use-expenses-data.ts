"use client";

import { useCallback, useEffect, useState } from "react";
import type { ExpenseRecord, FixedExpenseRecord, SummaryResponse } from "../domain/expenses.types";
import type { BudgetPeriod } from "../domain/finance";
import { getPresetDateRange } from "../domain/finance";
import * as api from "../infrastructure/expenses.api";

export function useExpensesData() {
    const defaultRange = getPresetDateRange("month");
    const [selectedPreset, setSelectedPreset] = useState<BudgetPeriod | "custom">("month");
    const [startDate, setStartDate] = useState(defaultRange.startDate);
    const [endDate, setEndDate] = useState(defaultRange.endDate);
    const [summary, setSummary] = useState<SummaryResponse | null>(null);
    const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
    const [fixedExpenses, setFixedExpenses] = useState<FixedExpenseRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const isInvalidDateRange = startDate > endDate;

    const fetchData = useCallback(async () => {
        if (isInvalidDateRange) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setFetchError(null);

        try {
            const [summaryData, expensesData, fixedExpensesData] = await Promise.all([
                api.fetchSummary(startDate, endDate),
                api.fetchExpenses(startDate, endDate),
                api.fetchFixedExpenses(),
            ]);

            setSummary(summaryData);
            setExpenses(expensesData);
            setFixedExpenses(fixedExpensesData);
        } catch (error) {
            setFetchError(
                error instanceof Error
                    ? error.message
                    : "No se pudo cargar la información de gastos"
            );
        } finally {
            setLoading(false);
        }
    }, [endDate, isInvalidDateRange, startDate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handlePresetRange = (period: BudgetPeriod) => {
        const range = getPresetDateRange(period);
        setSelectedPreset(period);
        setStartDate(range.startDate);
        setEndDate(range.endDate);
    };

    const handleStartDateChange = (value: string) => {
        setSelectedPreset("custom");
        setStartDate(value);
    };

    const handleEndDateChange = (value: string) => {
        setSelectedPreset("custom");
        setEndDate(value);
    };

    const handleCustomPreset = () => {
        setSelectedPreset("custom");
    };

    return {
        selectedPreset,
        startDate,
        endDate,
        summary,
        expenses,
        fixedExpenses,
        loading,
        fetchError,
        isInvalidDateRange,
        handlePresetRange,
        handleStartDateChange,
        handleEndDateChange,
        handleCustomPreset,
        refresh: fetchData,
    };
}
