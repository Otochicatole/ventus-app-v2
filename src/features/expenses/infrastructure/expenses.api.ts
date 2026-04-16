import type {
    ExpenseFormState,
    ExpenseRecord,
    FixedExpenseFormState,
    FixedExpenseRecord,
    SummaryResponse,
} from "../domain/expenses.types";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            (data as { error?: string }).error || "Error en la operación"
        );
    }

    return data as T;
}

function dateQuery(startDate: string, endDate: string) {
    return new URLSearchParams({ startDate, endDate }).toString();
}

export function fetchSummary(startDate: string, endDate: string) {
    return request<SummaryResponse>(
        `/api/finance/summary?${dateQuery(startDate, endDate)}`,
        { cache: "no-store" }
    );
}

export function fetchExpenses(startDate: string, endDate: string) {
    return request<ExpenseRecord[]>(
        `/api/expenses?${dateQuery(startDate, endDate)}`,
        { cache: "no-store" }
    );
}

export function fetchFixedExpenses() {
    return request<FixedExpenseRecord[]>("/api/fixed-expenses", { cache: "no-store" });
}

export function createExpense(data: ExpenseFormState) {
    return request<ExpenseRecord>("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

export function updateExpense(id: string, data: ExpenseFormState) {
    return request<ExpenseRecord>(`/api/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

export async function deleteExpense(id: string) {
    await request(`/api/expenses/${id}`, { method: "DELETE" });
}

export function createFixedExpense(data: FixedExpenseFormState) {
    return request<FixedExpenseRecord>("/api/fixed-expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

export function updateFixedExpense(id: string, data: FixedExpenseFormState) {
    return request<FixedExpenseRecord>(`/api/fixed-expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

export async function deleteFixedExpense(id: string) {
    await request(`/api/fixed-expenses/${id}`, { method: "DELETE" });
}
