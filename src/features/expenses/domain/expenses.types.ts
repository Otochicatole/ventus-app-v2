export type ExpenseRecord = {
    id: string;
    name: string;
    amount: number;
    description: string | null;
    spentAt: string;
    createdAt: string;
    updatedAt: string;
};

export type FixedExpenseRecord = {
    id: string;
    name: string;
    amount: number;
    description: string | null;
    startsAt: string;
    createdAt: string;
    updatedAt: string;
};

export type FixedExpenseBreakdown = {
    id: string;
    name: string;
    amount: number;
    description: string | null;
    startsAt: string;
    occurrenceCount: number;
    totalForPeriod: number;
};

export type SummaryResponse = {
    range: {
        label: string;
        start: string;
        end: string;
    };
    income: number;
    paymentsCount: number;
    normalExpenses: number;
    normalExpensesCount: number;
    fixedExpensesTotal: number;
    fixedExpenseTemplatesCount: number;
    fixedExpenseOccurrencesCount: number;
    totalExpenses: number;
    budget: number;
    fixedExpenseBreakdown: FixedExpenseBreakdown[];
};

export type ExpenseFormState = {
    name: string;
    amount: string;
    description: string;
    spentAt: string;
};

export type FixedExpenseFormState = {
    name: string;
    amount: string;
    description: string;
    startsAt: string;
};

export type DeleteTarget = {
    id: string;
    type: "expense" | "fixed";
    label: string;
};
