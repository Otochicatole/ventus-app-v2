export type BudgetPeriod = "week" | "month" | "year";

export type PeriodRange = {
    period: BudgetPeriod;
    referenceDate: string;
    label: string;
    start: Date;
    end: Date;
};

export type DateRange = {
    label: string;
    startDate: string;
    endDate: string;
    start: Date;
    end: Date;
};

type FixedExpenseSource = {
    id: string;
    name: string;
    amount: number;
    description: string | null;
    startsAt: Date | string;
};

export type FixedExpenseOccurrence = {
    fixedExpenseId: string;
    name: string;
    amount: number;
    description: string | null;
    occurrenceDate: Date;
};

const DATE_INPUT_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function getLocalTodayParts() {
    const now = new Date();

    return {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
    };
}

function toUtcDate(year: number, month: number, day: number, hour = 0) {
    return new Date(Date.UTC(year, month - 1, day, hour, 0, 0, 0));
}

function pad(value: number) {
    return String(value).padStart(2, "0");
}

function getMonthLastDay(year: number, monthIndex: number) {
    return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

function getMonthStart(date: Date) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 0, 0, 0, 0));
}

function addMonths(monthStart: Date, amount: number) {
    return new Date(
        Date.UTC(monthStart.getUTCFullYear(), monthStart.getUTCMonth() + amount, 1, 0, 0, 0, 0)
    );
}

function ensureDate(date: Date | string) {
    return date instanceof Date ? date : new Date(date);
}

function formatUtcDate(date: Date) {
    return new Intl.DateTimeFormat("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    }).format(date);
}

function toDateInputValue(date: Date) {
    return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

function parseReferenceDate(referenceDate?: string) {
    if (referenceDate && DATE_INPUT_PATTERN.test(referenceDate)) {
        const [year, month, day] = referenceDate.split("-").map(Number);

        return {
            referenceDate,
            date: toUtcDate(year, month, day, 12),
        };
    }

    const { year, month, day } = getLocalTodayParts();
    const normalized = `${year}-${pad(month)}-${pad(day)}`;

    return {
        referenceDate: normalized,
        date: toUtcDate(year, month, day, 12),
    };
}

export function isBudgetPeriod(value: string | null | undefined): value is BudgetPeriod {
    return value === "week" || value === "month" || value === "year";
}

export function getTodayDateInput() {
    return parseReferenceDate().referenceDate;
}

export function parseDateInputToUtcMidday(value: unknown) {
    if (typeof value !== "string" || !DATE_INPUT_PATTERN.test(value)) {
        return null;
    }

    const [year, month, day] = value.split("-").map(Number);
    return toUtcDate(year, month, day, 12);
}

export function parseMoneyAmount(value: unknown) {
    const numericValue = typeof value === "number" ? value : Number(value);

    if (!Number.isFinite(numericValue) || numericValue < 0) {
        return null;
    }

    return numericValue;
}

export function formatDateRangeLabel(start: Date, inclusiveEnd: Date) {
    return `Del ${formatUtcDate(start)} al ${formatUtcDate(inclusiveEnd)}`;
}

export function getPeriodRange(period: BudgetPeriod, referenceDate?: string): PeriodRange {
    const { date, referenceDate: normalizedReferenceDate } = parseReferenceDate(referenceDate);

    if (period === "week") {
        const dayOfWeek = date.getUTCDay();
        const daysSinceMonday = (dayOfWeek + 6) % 7;
        const start = new Date(date);
        start.setUTCDate(date.getUTCDate() - daysSinceMonday);
        start.setUTCHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setUTCDate(start.getUTCDate() + 7);

        const endLabel = new Date(end);
        endLabel.setUTCDate(end.getUTCDate() - 1);

        return {
            period,
            referenceDate: normalizedReferenceDate,
            label: `Semana del ${formatUtcDate(start)} al ${formatUtcDate(endLabel)}`,
            start,
            end,
        };
    }

    if (period === "month") {
        const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 0, 0, 0, 0));
        const end = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1, 0, 0, 0, 0));

        return {
            period,
            referenceDate: normalizedReferenceDate,
            label: new Intl.DateTimeFormat("es-AR", {
                month: "long",
                year: "numeric",
                timeZone: "UTC",
            }).format(start),
            start,
            end,
        };
    }

    const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0));
    const end = new Date(Date.UTC(date.getUTCFullYear() + 1, 0, 1, 0, 0, 0, 0));

    return {
        period,
        referenceDate: normalizedReferenceDate,
        label: String(date.getUTCFullYear()),
        start,
        end,
    };
}

export function getFixedExpenseOccurrences(
    fixedExpenses: FixedExpenseSource[],
    range: Pick<PeriodRange, "start" | "end">
) {
    const occurrences: FixedExpenseOccurrence[] = [];

    for (const fixedExpense of fixedExpenses) {
        const startsAt = ensureDate(fixedExpense.startsAt);
        const billingDay = startsAt.getUTCDate();
        let cursor = getMonthStart(startsAt);
        const minimumCursor = getMonthStart(range.start);

        if (cursor < minimumCursor) {
            cursor = minimumCursor;
        }

        while (cursor < range.end) {
            const year = cursor.getUTCFullYear();
            const monthIndex = cursor.getUTCMonth();
            const lastDay = getMonthLastDay(year, monthIndex);
            const occurrenceDate = new Date(
                Date.UTC(year, monthIndex, Math.min(billingDay, lastDay), 12, 0, 0, 0)
            );

            if (
                occurrenceDate >= startsAt &&
                occurrenceDate >= range.start &&
                occurrenceDate < range.end
            ) {
                occurrences.push({
                    fixedExpenseId: fixedExpense.id,
                    name: fixedExpense.name,
                    amount: fixedExpense.amount,
                    description: fixedExpense.description,
                    occurrenceDate,
                });
            }

            cursor = addMonths(cursor, 1);
        }
    }

    return occurrences.sort(
        (left, right) => right.occurrenceDate.getTime() - left.occurrenceDate.getTime()
    );
}

export function getDateRange(startDate: string, endDate: string): DateRange | null {
    const start = parseDateInputToUtcMidday(startDate);
    const inclusiveEnd = parseDateInputToUtcMidday(endDate);

    if (!start || !inclusiveEnd) {
        return null;
    }

    if (start.getTime() > inclusiveEnd.getTime()) {
        return null;
    }

    const rangeStart = new Date(start);
    rangeStart.setUTCHours(0, 0, 0, 0);

    const rangeEnd = new Date(inclusiveEnd);
    rangeEnd.setUTCDate(rangeEnd.getUTCDate() + 1);
    rangeEnd.setUTCHours(0, 0, 0, 0);

    return {
        label: formatDateRangeLabel(rangeStart, inclusiveEnd),
        startDate,
        endDate,
        start: rangeStart,
        end: rangeEnd,
    };
}

export function getPresetDateRange(period: BudgetPeriod, referenceDate?: string): DateRange {
    const periodRange = getPeriodRange(period, referenceDate);
    const inclusiveEnd = new Date(periodRange.end);
    inclusiveEnd.setUTCDate(inclusiveEnd.getUTCDate() - 1);

    return {
        label: periodRange.label,
        startDate: toDateInputValue(periodRange.start),
        endDate: toDateInputValue(inclusiveEnd),
        start: periodRange.start,
        end: periodRange.end,
    };
}