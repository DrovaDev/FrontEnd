import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
    BadgeCheck,
    Building2,
    Camera,
    Check,
    CheckCircle2,
    Clock,
    CreditCard,
    ExternalLink,
    Flag,
    Loader2,
    MapPin,
    MessageCircle,
    MessageSquare,
    Motorbike,
    Navigation,
    Package,
    PackageCheck,
    Phone,
    Scale,
    Share2,
    Store,
    Truck,
    UserCheck,
    XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BUSINESS_APP_URL, directionsHref, FINAL, formatTime, whatsappHref, type OrderStatus, type Tracking, type TrackedOrder } from "@/lib/tracking";

// Status copy and journey mirror the business web app's /track page, so a customer sees
// the same wording wherever they track from.

const STATUS: Record<OrderStatus, { headline: string; text: string; icon: LucideIcon; stage: number; at?: keyof Tracking }> = {
    pending: { headline: "Order placed", text: "Waiting for payment to be confirmed.", icon: CreditCard, stage: 0 },
    payment_confirmed: { headline: "Order confirmed", text: "Payment received. A rider is being lined up.", icon: CheckCircle2, stage: 1, at: "confirmedAt" },
    assigned: { headline: "Rider assigned", text: "A rider has taken your delivery and will head to pickup shortly.", icon: UserCheck, stage: 1, at: "assignedAt" },
    en_route_pickup: { headline: "Rider heading to pickup", text: "Your rider is on the way to collect the package.", icon: Navigation, stage: 2, at: "enRoutePickupAt" },
    picked_up: { headline: "Package picked up", text: "Your package has been collected.", icon: PackageCheck, stage: 2, at: "pickedUpAt" },
    in_transit: { headline: "On the way", text: "Your package is on its way to the drop-off address.", icon: Truck, stage: 3, at: "inTransitAt" },
    arrived_at_delivery: { headline: "Rider has arrived", text: "Your rider is at the drop-off location.", icon: MapPin, stage: 3, at: "arrivedAtDeliveryAt" },
    completed: { headline: "Delivered", text: "Your package has been delivered.", icon: CheckCircle2, stage: 4, at: "deliveredAt" },
    disputed: { headline: "Under review", text: "There's an open issue on this delivery. The delivery company is looking into it.", icon: Scale, stage: -1 },
    cancelled: { headline: "Cancelled", text: "This delivery was cancelled.", icon: XCircle, stage: -1, at: "cancelledAt" },
};

const STAGES = ["Placed", "Confirmed", "Picked up", "On the way", "Delivered"];

const JOURNEY: { label: string; at: keyof Tracking | "createdAt"; status: OrderStatus }[] = [
    { label: "Order placed", at: "createdAt", status: "pending" },
    { label: "Payment confirmed", at: "confirmedAt", status: "payment_confirmed" },
    { label: "Rider assigned", at: "assignedAt", status: "assigned" },
    { label: "Rider heading to pickup", at: "enRoutePickupAt", status: "en_route_pickup" },
    { label: "Package picked up", at: "pickedUpAt", status: "picked_up" },
    { label: "On the way", at: "inTransitAt", status: "in_transit" },
    { label: "Arrived at drop-off", at: "arrivedAtDeliveryAt", status: "arrived_at_delivery" },
    { label: "Delivered", at: "deliveredAt", status: "completed" },
];
const FLOW: OrderStatus[] = JOURNEY.map((j) => j.status);

const pill = "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors";

export function TrackResult({ ord, shareUrl, refreshing }: { ord: TrackedOrder; shareUrl: string; refreshing: boolean }) {
    const status = ord.status;
    const s = STATUS[status] ?? STATUS.pending;
    const tracking = ord.tracking;
    const business = ord.business;
    const locations = ord.locations;
    const items = ord.items ?? [];
    const live = !FINAL.includes(status) && status !== "disputed";
    const lastUpdate = (s.at && (tracking?.[s.at] as string | undefined)) || ord.updatedAt || ord.createdAt;
    const storeUrl = BUSINESS_APP_URL && business?.slug ? `${BUSINESS_APP_URL}/store/${encodeURIComponent(business.slug)}` : undefined;
    const [copied, setCopied] = useState(false);

    const share = async () => {
        try {
            if (navigator.share) await navigator.share({ title: "Track delivery", text: `Track delivery ${ord.referenceCode}`, url: shareUrl });
            else {
                await navigator.clipboard.writeText(shareUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch {
            // share sheet dismissed
        }
    };

    const tone =
        status === "completed" ? "bg-emerald text-white" : status === "cancelled" ? "bg-red-600 text-white" : status === "disputed" ? "bg-gold text-forest" : "bg-forest text-white";

    return (
        <div className="space-y-5">
            {/* ─── Status ─── */}
            <section className="overflow-hidden rounded-3xl border border-app-border bg-white shadow-xl shadow-forest/5">
                <div className="p-6 sm:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <span className={cn("relative grid size-14 shrink-0 place-items-center rounded-2xl shadow-lg", tone)}>
                                <s.icon size={26} />
                                {live && <span className="absolute -right-1 -top-1 size-3.5 animate-pulse rounded-full bg-lime ring-4 ring-white" />}
                            </span>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-2xl font-extrabold tracking-tight text-forest sm:text-3xl">{s.headline}</h2>
                                    {live && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald/10 px-2.5 py-1 text-xs font-semibold text-emerald">
                                            <span className="size-1.5 animate-pulse rounded-full bg-emerald" /> Live
                                        </span>
                                    )}
                                </div>
                                <p className="mt-1 text-sm text-sage">{s.text}</p>
                                <p className="mt-2 flex items-center gap-1.5 text-xs text-sage">
                                    <Clock size={12} /> {formatTime(lastUpdate)}
                                    {refreshing && <Loader2 size={11} className="animate-spin" />}
                                </p>
                            </div>
                        </div>
                        <div className="text-left sm:text-right">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-sage">Tracking code</p>
                            <p className="font-mono text-sm font-bold text-forest">{ord.referenceCode}</p>
                            <button type="button" onClick={share} className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald hover:underline">
                                {copied ? <Check size={12} /> : <Share2 size={12} />} {copied ? "Link copied" : "Share tracking link"}
                            </button>
                        </div>
                    </div>

                    {status === "cancelled" && tracking?.cancellationReason && (
                        <p className="mt-5 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                            <XCircle size={16} className="mt-0.5 shrink-0" /> {tracking.cancellationReason}
                        </p>
                    )}

                    {s.stage >= 0 && <StageBar stage={s.stage} done={status === "completed"} />}
                </div>

                {/* Who's delivering */}
                {business && (
                    <div className="flex flex-col gap-4 border-t border-app-border bg-app-bg/60 px-6 py-4 sm:flex-row sm:items-center sm:px-8">
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                            <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-forest/10 text-forest">
                                {business.businessLogo ? <img src={business.businessLogo} alt="" className="size-full object-cover" /> : <Building2 size={20} />}
                            </span>
                            <div className="min-w-0">
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-sage">Delivered by</p>
                                <p className="flex items-center gap-1 truncate font-semibold text-forest">
                                    <span className="truncate">{business.businessName}</span>
                                    {business.isVerified && <BadgeCheck size={15} className="shrink-0 text-emerald" aria-label="Verified business" />}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {business.contactNumber && (
                                <>
                                    <a href={`tel:${business.contactNumber}`} className={cn(pill, "bg-forest text-white hover:bg-forest/90")}>
                                        <Phone size={13} /> Call
                                    </a>
                                    <a href={whatsappHref(business.contactNumber)} target="_blank" rel="noopener noreferrer" className={cn(pill, "border border-forest/20 text-forest hover:bg-mint")}>
                                        <MessageCircle size={13} /> WhatsApp
                                    </a>
                                </>
                            )}
                            {storeUrl && (
                                <a href={storeUrl} className={cn(pill, "text-forest hover:bg-mint")}>
                                    <Store size={13} /> Visit store
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </section>

            {/* Report a problem: easy to spot, right under the status */}
            {storeUrl && business && (
                <section className="flex flex-col gap-4 rounded-2xl border border-forest/15 bg-forest/5 p-5 sm:flex-row sm:items-center sm:p-6">
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gold text-forest shadow-lg shadow-gold/30">
                        <Flag size={20} />
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="font-bold text-forest">Problem with this delivery?</p>
                        <p className="text-sm text-sage">
                            Damaged or missing items, a wrong charge, or poor service. Report it to {business.businessName} and get a ticket number. Already reported?{" "}
                            <a href={`${BUSINESS_APP_URL}/tickets`} className="font-semibold text-emerald hover:underline">
                                Check your ticket
                            </a>
                            .
                        </p>
                    </div>
                    <a href={`${storeUrl}/dispute?code=${encodeURIComponent(ord.referenceCode)}`} className={cn(pill, "shrink-0 justify-center bg-forest px-5 py-2.5 text-sm text-white hover:bg-forest/90")}>
                        <Flag size={15} /> Report a problem
                    </a>
                </section>
            )}

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
                {/* Journey */}
                <section className="rounded-2xl border border-app-border bg-white p-5 shadow-sm sm:p-6 lg:col-span-3 lg:self-start">
                    <h3 className="mb-5 text-sm font-semibold text-forest">Journey</h3>
                    <Journey ord={ord} />
                </section>

                <div className="space-y-5 lg:col-span-2">
                    {/* Route */}
                    <section className="rounded-2xl border border-app-border bg-white p-5 shadow-sm sm:p-6">
                        <h3 className="mb-4 text-sm font-semibold text-forest">Route</h3>
                        <ol className="relative space-y-4">
                            <span aria-hidden className="absolute left-[7px] top-4 h-[calc(100%-2.5rem)] w-0.5 bg-app-border" />
                            <li className="relative flex gap-3">
                                <span className="mt-1 size-4 shrink-0 rounded-full border-4 border-forest bg-white" />
                                <div className="min-w-0">
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-sage">Pickup</p>
                                    <p className="text-sm text-forest">{locations?.pickupAddress || "—"}</p>
                                    {locations?.pickupNearestLandmark && <p className="text-xs text-sage">Near {locations.pickupNearestLandmark}</p>}
                                </div>
                            </li>
                            <li className="relative flex gap-3">
                                <MapPin size={16} className="mt-0.5 shrink-0 text-emerald" />
                                <div className="min-w-0">
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-sage">Drop-off</p>
                                    <p className="text-sm text-forest">{locations?.deliveryAddress || "—"}</p>
                                    {locations?.deliveryNearestLandmark && <p className="text-xs text-sage">Near {locations.deliveryNearestLandmark}</p>}
                                </div>
                            </li>
                        </ol>
                        {locations?.pickupCoordinates?.coordinates && locations?.deliveryCoordinates?.coordinates && (
                            <a
                                href={directionsHref(locations.pickupCoordinates, locations.deliveryCoordinates)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald hover:underline">
                                <ExternalLink size={12} /> View route on Google Maps
                            </a>
                        )}
                    </section>

                    {/* Package */}
                    <section className="rounded-2xl border border-app-border bg-white p-5 shadow-sm sm:p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-forest">Package</h3>
                            {ord.deliveryPriority && <span className="rounded-full bg-app-bg px-2.5 py-0.5 text-xs font-semibold capitalize text-forest">{ord.deliveryPriority}</span>}
                        </div>
                        {items.length ? (
                            <ul className="space-y-2">
                                {items.map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 rounded-xl bg-app-bg p-3">
                                        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white text-forest">
                                            <Package size={16} />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-forest">{item.packageName}</p>
                                            <p className="text-xs capitalize text-sage">
                                                {item.packageType}
                                                {item.estimatedWeight ? ` · ${item.estimatedWeight} ${item.weightUnit || "kg"}` : ""}
                                            </p>
                                        </div>
                                        <span className="text-xs font-semibold text-sage">×{item.quantity}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-sage">No item details.</p>
                        )}
                    </section>
                </div>
            </div>

            {/* Notes */}
            {(ord.deliveryInstructions || ord.customerNote) && (
                <section className="grid gap-3 rounded-2xl border border-app-border bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-6">
                    {ord.deliveryInstructions && (
                        <div className="flex gap-3">
                            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-lime/20 text-forest">
                                <Flag size={15} />
                            </span>
                            <div>
                                <p className="text-xs font-semibold text-forest">Delivery instructions</p>
                                <p className="text-sm text-sage">{ord.deliveryInstructions}</p>
                            </div>
                        </div>
                    )}
                    {ord.customerNote && (
                        <div className="flex gap-3">
                            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-gold/20 text-forest">
                                <MessageSquare size={15} />
                            </span>
                            <div>
                                <p className="text-xs font-semibold text-forest">Note from sender</p>
                                <p className="text-sm italic text-sage">&ldquo;{ord.customerNote}&rdquo;</p>
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* Proof photos */}
            {(tracking?.pickupPhotoUrl || tracking?.deliveryPhotoUrl) && (
                <section className="rounded-2xl border border-app-border bg-white p-5 shadow-sm sm:p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-forest">
                        <Camera size={15} /> Photos from your rider
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {(
                            [
                                ["At pickup", tracking?.pickupPhotoUrl, tracking?.pickupPhotoTakenAt],
                                ["At delivery", tracking?.deliveryPhotoUrl, tracking?.deliveryPhotoTakenAt],
                            ] as const
                        ).map(([label, url, at]) =>
                            url ? (
                                <figure key={label} className="overflow-hidden rounded-xl border border-app-border">
                                    <img src={url} alt={`Photo taken ${label.toLowerCase()}`} className="aspect-[4/3] w-full object-cover" />
                                    <figcaption className="flex justify-between px-3 py-2 text-xs">
                                        <span className="font-semibold text-forest">{label}</span>
                                        <span className="text-sage">{formatTime(at)}</span>
                                    </figcaption>
                                </figure>
                            ) : null,
                        )}
                    </div>
                </section>
            )}
        </div>
    );
}

/** Five big stages with a rider riding along the bar. */
function StageBar({ stage, done }: { stage: number; done: boolean }) {
    const pct = (stage / (STAGES.length - 1)) * 100;
    return (
        <div className="mt-8" aria-label={`Stage ${stage + 1} of ${STAGES.length}: ${STAGES[stage]}`}>
            <div className="relative mx-3 h-2 rounded-full bg-app-bg">
                <div className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-forest to-emerald transition-all duration-700" style={{ width: `${pct}%` }} />
                <span
                    className={cn(
                        "absolute top-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full shadow-lg ring-4 ring-white transition-all duration-700",
                        done ? "bg-emerald text-white" : "bg-forest text-white",
                    )}
                    style={{ left: `${pct}%` }}>
                    {done ? <Check size={16} strokeWidth={3} /> : <Motorbike size={16} />}
                </span>
            </div>
            <ol className="mt-5 grid grid-cols-5 text-center">
                {STAGES.map((label, i) => (
                    <li key={label} className={cn("px-0.5 text-[10px] font-semibold leading-tight sm:text-xs", i <= stage ? "text-forest" : "text-sage/70")}>
                        {label}
                    </li>
                ))}
            </ol>
        </div>
    );
}

function Journey({ ord }: { ord: TrackedOrder }) {
    const tracking = ord.tracking;
    const idx = FLOW.indexOf(ord.status);
    const stopped = ord.status === "cancelled" || ord.status === "disputed";
    const timeOf = (at: (typeof JOURNEY)[number]["at"]) => (at === "createdAt" ? ord.createdAt : (tracking?.[at] as string | undefined));
    // A stopped order only shows the steps it actually reached.
    const rows = JOURNEY.map((j, i) => ({ ...j, done: stopped ? !!timeOf(j.at) : i <= idx, time: timeOf(j.at) })).filter((r) => !stopped || r.done);
    if (ord.status === "cancelled") rows.push({ label: "Cancelled", at: "cancelledAt", status: "cancelled", done: true, time: tracking?.cancelledAt });
    const firstPending = rows.findIndex((r) => !r.done);
    const currentIndex = stopped || firstPending < 0 ? rows.length - 1 : firstPending - 1;

    return (
        <ol>
            {rows.map((r, i) => {
                const current = i === currentIndex;
                const cancelled = r.status === "cancelled";
                return (
                    <li key={r.label} className="relative flex gap-4 pb-6 last:pb-0">
                        {i < rows.length - 1 && (
                            <span aria-hidden className={cn("absolute left-[11px] top-7 h-[calc(100%-1.5rem)] w-0.5", rows[i + 1].done ? "bg-emerald" : "bg-app-border")} />
                        )}
                        <span
                            className={cn(
                                "relative grid size-6 shrink-0 place-items-center rounded-full",
                                cancelled ? "bg-red-600 text-white" : r.done ? "bg-emerald text-white" : "border-2 border-app-border bg-white",
                                current && !cancelled && ord.status !== "completed" && "ring-4 ring-emerald/25",
                            )}>
                            {cancelled ? <XCircle size={13} /> : r.done && <Check size={13} strokeWidth={3} />}
                        </span>
                        <div className="-mt-0.5 flex min-w-0 flex-1 items-baseline justify-between gap-3">
                            <p className={cn("text-sm", current ? "font-bold text-forest" : r.done ? "font-medium text-forest" : "text-sage")}>{r.label}</p>
                            <span className="shrink-0 text-xs text-sage">{formatTime(r.time) ?? (r.done ? "" : "Pending")}</span>
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}
