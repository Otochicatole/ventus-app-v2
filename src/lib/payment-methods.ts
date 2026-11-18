export const PAYMENT_METHODS = ["transferencia", "tarjeta", "efectivo"] as const;

export type PaymentMethodType = (typeof PAYMENT_METHODS)[number];

export type PaymentMethodEntry = {
    method: PaymentMethodType;
    amount: number;
};

export const PAYMENT_METHOD_OPTIONS: Array<{ value: PaymentMethodType; label: string }> = [
    { value: "transferencia", label: "Transferencia" },
    { value: "tarjeta", label: "Tarjeta" },
    { value: "efectivo", label: "Efectivo" },
];

const PAYMENT_METHOD_LABELS: Record<PaymentMethodType, string> = {
    transferencia: "Transferencia",
    tarjeta: "Tarjeta",
    efectivo: "Efectivo",
};

export function isPaymentMethod(value: unknown): value is PaymentMethodType {
    return typeof value === "string" && (PAYMENT_METHODS as readonly string[]).includes(value);
}

export function getPaymentMethodLabel(method: string): string {
    return isPaymentMethod(method) ? PAYMENT_METHOD_LABELS[method] : method;
}

export function normalizeStoredPaymentMethods(raw: unknown): PaymentMethodEntry[] {
    if (!Array.isArray(raw)) {
        return [];
    }

    const normalized: PaymentMethodEntry[] = [];
    for (const item of raw) {
        if (!item || typeof item !== "object") continue;
        const candidate = item as { method?: unknown; amount?: unknown };
        if (!isPaymentMethod(candidate.method)) continue;

        const amount = typeof candidate.amount === "number" ? candidate.amount : Number(candidate.amount);
        if (!Number.isFinite(amount) || amount < 0) continue;

        normalized.push({
            method: candidate.method,
            amount,
        });
    }

    return normalized;
}

export function parsePaymentMethodsInput(
    raw: unknown,
    totalPayment: number
): { value: PaymentMethodEntry[] | null; error?: string } {
    if (raw === undefined || raw === null) {
        return { value: null };
    }

    if (!Array.isArray(raw)) {
        return { value: null, error: "El formato de los métodos de pago es inválido" };
    }

    if (raw.length === 0) {
        return { value: null };
    }

    const entries: PaymentMethodEntry[] = [];
    const seenMethods = new Set<PaymentMethodType>();

    for (const item of raw) {
        if (!item || typeof item !== "object") {
            return { value: null, error: "Método de pago inválido" };
        }

        const candidate = item as { method?: unknown; amount?: unknown };
        if (!isPaymentMethod(candidate.method)) {
            return { value: null, error: "Seleccioná un método de pago válido (Transferencia, Tarjeta o Efectivo)" };
        }

        if (seenMethods.has(candidate.method)) {
            return { value: null, error: `El método ${getPaymentMethodLabel(candidate.method)} está repetido` };
        }
        seenMethods.add(candidate.method);

        const hasExplicitAmount =
            candidate.amount !== undefined &&
            candidate.amount !== null &&
            candidate.amount !== "";
        const parsedAmount = hasExplicitAmount ? Number(candidate.amount) : NaN;

        if (hasExplicitAmount && (!Number.isFinite(parsedAmount) || parsedAmount < 0)) {
            return { value: null, error: "Ingresá un monto válido para cada método de pago" };
        }

        entries.push({
            method: candidate.method,
            amount: hasExplicitAmount ? parsedAmount : 0,
        });
    }

    if (entries.length === 1) {
        return { value: [{ method: entries[0].method, amount: totalPayment }] };
    }

    for (const entry of entries) {
        if (entry.amount <= 0) {
            return {
                value: null,
                error: `Ingresá un monto mayor a 0 para ${getPaymentMethodLabel(entry.method)}`,
            };
        }
    }

    const sum = entries.reduce((acc, entry) => acc + entry.amount, 0);
    if (Math.abs(sum - totalPayment) > 0.01) {
        return {
            value: null,
            error: "La suma de los montos por método de pago debe coincidir con el monto total a cobrar",
        };
    }

    return { value: entries };
}
