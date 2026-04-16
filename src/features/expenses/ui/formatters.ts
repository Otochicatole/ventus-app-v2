export function formatCurrency(amount: number) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    }).format(amount);
}

export function formatDate(date: string) {
    return new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(date));
}

export function getFixedBillingLabel(startsAt: string) {
    const day = new Date(startsAt).getUTCDate();
    return `Cada mes el día ${day}`;
}
