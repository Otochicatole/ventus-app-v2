export type CoordinateParseResult = {
    latitude: number | null;
    longitude: number | null;
    error: string | null;
};

function parseSingleCoordinate(raw: unknown): number | null | "invalid" {
    if (raw === null || raw === undefined || raw === "") {
        return null;
    }

    if (typeof raw === "number") {
        return Number.isFinite(raw) ? raw : "invalid";
    }

    if (typeof raw === "string") {
        const normalized = raw.trim().replace(",", ".");
        if (!normalized) return null;
        if (!/^-?\d+(\.\d+)?$/.test(normalized)) {
            return "invalid";
        }
        const parsed = Number(normalized);
        return Number.isFinite(parsed) ? parsed : "invalid";
    }

    return "invalid";
}

export function isValidCoordinates(
    latitude: number | null | undefined,
    longitude: number | null | undefined
): boolean {
    return (
        typeof latitude === "number" &&
        typeof longitude === "number" &&
        Number.isFinite(latitude) &&
        Number.isFinite(longitude) &&
        latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180
    );
}

export function parseAndValidateCoordinates(
    rawLatitude: unknown,
    rawLongitude: unknown
): CoordinateParseResult {
    const latitude = parseSingleCoordinate(rawLatitude);
    const longitude = parseSingleCoordinate(rawLongitude);

    if (latitude === "invalid") {
        return {
            latitude: null,
            longitude: null,
            error: "La latitud debe ser un número válido (ej: -33.3436).",
        };
    }

    if (longitude === "invalid") {
        return {
            latitude: null,
            longitude: null,
            error: "La longitud debe ser un número válido (ej: -60.2067).",
        };
    }

    if (latitude !== null && (latitude < -90 || latitude > 90)) {
        return {
            latitude: null,
            longitude: null,
            error: "La latitud debe estar entre -90 y 90 grados (revisá el punto decimal).",
        };
    }

    if (longitude !== null && (longitude < -180 || longitude > 180)) {
        return {
            latitude: null,
            longitude: null,
            error: "La longitud debe estar entre -180 y 180 grados (revisá el punto decimal).",
        };
    }

    if ((latitude === null) !== (longitude === null)) {
        return {
            latitude: null,
            longitude: null,
            error: "Completá tanto la latitud como la longitud, o dejá ambos campos vacíos.",
        };
    }

    return { latitude, longitude, error: null };
}
