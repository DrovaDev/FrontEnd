/**
 * Public order tracking, backed by the Drova API's `GET /order/track/:referenceCode`
 * (the same endpoint the business web app's /track page uses).
 *
 * The browser calls a same-origin path, `/api/v1/order/track/...`, so the API's host never
 * reaches the client. In production vercel.json forwards only that route to the API; in
 * development vite.config.ts proxies it to DROVA_API_URL. VITE_API_BASE overrides the path.
 */

export type OrderStatus =
    | "pending"
    | "payment_confirmed"
    | "assigned"
    | "en_route_pickup"
    | "picked_up"
    | "in_transit"
    | "arrived_at_delivery"
    | "completed"
    | "disputed"
    | "cancelled";

type Coordinates = { type: string; coordinates: [number, number] };

/**
 * The fields of the API's Order that this public page reads. The API returns more
 * (contact details, payment fields); they are deliberately left out of this type so
 * nothing renders them by accident.
 */
export interface TrackedOrder {
    referenceCode: string;
    status: OrderStatus;
    deliveryPriority?: string;
    deliveryInstructions?: string;
    customerNote?: string;
    items?: { packageName: string; packageType?: string; quantity: number; estimatedWeight?: number; weightUnit?: string }[];
    locations?: {
        pickupAddress?: string;
        pickupNearestLandmark?: string;
        pickupCoordinates?: Coordinates;
        deliveryAddress?: string;
        deliveryNearestLandmark?: string;
        deliveryCoordinates?: Coordinates;
        estimatedDurationMinutes?: number | null;
    };
    tracking?: {
        confirmedAt?: string;
        assignedAt?: string;
        enRoutePickupAt?: string;
        pickedUpAt?: string;
        inTransitAt?: string;
        arrivedAtDeliveryAt?: string;
        deliveredAt?: string;
        cancelledAt?: string;
        cancellationReason?: string;
        pickupPhotoUrl?: string | null;
        pickupPhotoTakenAt?: string | null;
        deliveryPhotoUrl?: string | null;
        deliveryPhotoTakenAt?: string | null;
    };
    business?: { businessName: string; businessLogo?: string; contactNumber?: string; slug?: string; isVerified?: boolean };
    createdAt: string;
    updatedAt: string;
}

export type Tracking = NonNullable<TrackedOrder["tracking"]>;

const API_BASE = ((import.meta.env.VITE_API_BASE as string | undefined) ?? "/api/v1").replace(/\/+$/, "");

/**
 * Where the business web app lives (storefronts, disputes, tickets), e.g. https://usedrova.app.
 * Links into it are hidden until this is set.
 */
export const BUSINESS_APP_URL = (import.meta.env.VITE_BUSINESS_APP_URL as string | undefined)?.replace(/\/+$/, "");

export const FINAL: OrderStatus[] = ["completed", "cancelled"];

/** Upper-cases and strips spaces, so "drv-ord 4570363" finds DRV-ORD4570363. */
export function normalizeCode(input: string) {
    return input.toUpperCase().replace(/\s+/g, "");
}

export class TrackingError extends Error {
    constructor(
        public kind: "not_found" | "unavailable",
        message: string,
    ) {
        super(message);
    }
}

export async function fetchTracking(referenceCode: string, businessSlug: string | undefined, signal?: AbortSignal): Promise<TrackedOrder> {
    const query = businessSlug ? `?${new URLSearchParams({ businessSlug })}` : "";
    let res: Response;
    try {
        res = await fetch(`${API_BASE}/order/track/${encodeURIComponent(referenceCode)}${query}`, { signal, headers: { Accept: "application/json" } });
    } catch (e) {
        if ((e as Error).name === "AbortError") throw e;
        throw new TrackingError("unavailable", "We couldn't reach Drova. Check your connection and try again.");
    }

    const body = (await res.json().catch(() => null)) as { data?: TrackedOrder; message?: string } | null;
    if (res.status === 404 || (res.ok && !body?.data)) throw new TrackingError("not_found", "Order not found");
    if (!res.ok || !body?.data) throw new TrackingError("unavailable", "Tracking is unavailable right now. Please try again in a moment.");
    return body.data;
}

export function formatTime(iso?: string | null) {
    if (!iso) return undefined;
    return new Date(iso).toLocaleString("en-NG", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}

export function whatsappHref(phone: string) {
    return `https://wa.me/${phone.replace(/\D/g, "").replace(/^0/, "234")}`;
}

/** Google Maps directions between the pickup and drop-off. GeoJSON stores [lng, lat]. */
export function directionsHref(from: Coordinates, to: Coordinates) {
    const [fromLng, fromLat] = from.coordinates;
    const [toLng, toLat] = to.coordinates;
    return `https://www.google.com/maps/dir/?api=1&origin=${fromLat},${fromLng}&destination=${toLat},${toLng}&travelmode=driving`;
}
