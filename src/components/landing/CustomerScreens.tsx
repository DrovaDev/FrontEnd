import { ArrowRight, BadgeCheck, Bike, Check, FileText, Heart, MapPin, Package, Search, ShieldCheck, Star, Truck, UtensilsCrossed, Wine } from "lucide-react";
import { cn } from "@/lib/utils";
import CityMap from "./CityMap";

// Screens from the Drova customer app, recreated with sample data for the landing page.
// They render inside <PhoneFrame> (280 × 560), in the same visual language as the rider app screens.

const CATEGORIES = [
    { icon: Package, label: "Parcel", tone: "bg-lime/25 text-forest" },
    { icon: UtensilsCrossed, label: "Food", tone: "bg-gold/30 text-gold-ink" },
    { icon: FileText, label: "Documents", tone: "bg-emerald/15 text-emerald" },
    { icon: Wine, label: "Fragile", tone: "bg-forest/10 text-forest" },
];

const NEARBY = [
    { initials: "GE", name: "GreenEdge Couriers", meta: "4.8 · 2.6 km · Bike", tone: "bg-gold text-forest", fav: false },
    { initials: "KD", name: "Kora Dispatch", meta: "4.7 · 3.1 km · Bike, Van", tone: "bg-emerald text-white", fav: true },
];

/** Customer app: the Drova Marketplace home. */
export function CustomerMarketplaceScreen() {
    return (
        <div className="flex h-full flex-col bg-app-bg text-forest">
            <div className="relative overflow-hidden bg-forest px-4 pb-5 pt-9 text-white">
                <div className="absolute -right-10 -top-10 size-40 rounded-full bg-lime/30 blur-3xl" />
                <div className="relative flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-white/60">Good morning,</p>
                        <p className="text-[15px] font-bold">Adaeze</p>
                    </div>
                    <span className="grid size-9 place-items-center rounded-full bg-lime text-[11px] font-bold text-forest">AO</span>
                </div>
                <p className="relative mt-3 inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold">
                    <MapPin size={11} className="text-lime" /> Lekki Phase 1, Lagos
                </p>
                <div className="relative mt-3 flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-[11px] text-sage">
                    <Search size={12} /> Where are you sending to?
                </div>
            </div>

            <div className="grid grid-cols-4 gap-2 px-4 pt-4">
                {CATEGORIES.map(({ icon: Icon, label, tone }) => (
                    <div key={label} className="flex flex-col items-center gap-1">
                        <span className={cn("grid size-11 place-items-center rounded-2xl", tone)}>
                            <Icon size={17} />
                        </span>
                        <span className="text-[9px] font-semibold">{label}</span>
                    </div>
                ))}
            </div>

            <div className="px-4 pt-4">
                <p className="text-[11px] font-bold">Top rated near you</p>
                <div className="relative mt-2 overflow-hidden rounded-2xl bg-gradient-to-br from-lime to-emerald p-3 text-white shadow-lg shadow-emerald/30">
                    <div className="absolute -bottom-8 -right-6 size-24 rounded-full bg-gold/40 blur-2xl" />
                    <div className="relative flex items-center gap-2.5">
                        <span className="grid size-10 place-items-center rounded-xl bg-white text-[12px] font-bold text-forest">SL</span>
                        <div className="min-w-0 flex-1">
                            <p className="flex items-center gap-1 truncate text-[11px] font-bold">
                                Swiftline Logistics <BadgeCheck size={11} className="shrink-0" />
                            </p>
                            <p className="flex items-center gap-1 text-[9px] text-white/85">
                                <Star size={9} className="fill-gold text-gold" /> 4.9 (312) · 1.2 km
                            </p>
                        </div>
                        <Heart size={15} className="fill-white text-white" />
                    </div>
                    <div className="relative mt-2.5 flex items-center justify-between">
                        <span className="flex items-center gap-1 text-[9px] font-semibold text-white/90">
                            <Bike size={11} /> <Truck size={11} /> Open now
                        </span>
                        <span className="rounded-full bg-forest px-3 py-1 text-[10px] font-bold">Book now</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 space-y-2 overflow-hidden px-4 pt-3">
                <p className="text-[11px] font-bold">Couriers nearby</p>
                {NEARBY.map((b) => (
                    <div key={b.name} className="flex items-center gap-2.5 rounded-2xl border border-app-border bg-white p-2.5">
                        <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl text-[10px] font-bold", b.tone)}>{b.initials}</span>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-[11px] font-bold">{b.name}</p>
                            <p className="flex items-center gap-1 text-[9px] text-sage">
                                <Star size={9} className="fill-gold text-gold" /> {b.meta}
                            </p>
                        </div>
                        <Heart size={14} className={b.fav ? "fill-red-500 text-red-500" : "text-sage/50"} />
                    </div>
                ))}
            </div>
        </div>
    );
}

const QUOTES = [
    { initials: "GE", name: "GreenEdge Couriers", price: "₦2,613", eta: "~45 min", rating: "4.8", tag: "Cheapest", tagTone: "bg-lime text-forest", avatar: "bg-gold text-forest" },
    { initials: "SL", name: "Swiftline Logistics", price: "₦2,926", eta: "~30 min", rating: "4.9", tag: "Top rated", tagTone: "bg-gold text-forest", avatar: "bg-white text-forest", selected: true },
    { initials: "KD", name: "Kora Dispatch", price: "₦3,344", eta: "~25 min", rating: "4.7", tag: "Fastest", tagTone: "bg-emerald text-white", avatar: "bg-emerald text-white" },
];

/** Customer app: every courier that can take a delivery, priced side by side. */
export function CustomerCompareScreen() {
    return (
        <div className="relative flex h-full flex-col bg-app-bg text-forest">
            <div className="flex items-center justify-between px-5 pb-2 pt-9 text-[11px] font-semibold">
                <span>9:41</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-forest">3 kg parcel</span>
            </div>
            <div className="relative h-[170px]">
                <CityMap route />
            </div>
            <div className="relative -mt-6 flex-1 rounded-t-3xl bg-white p-4 shadow-[0_-10px_30px_rgba(0,64,48,0.12)]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald">Compare couriers</p>
                <p className="mt-0.5 text-[15px] font-extrabold leading-tight">Lekki Phase 1 → Yaba</p>
                <p className="text-[10px] text-sage">8.4 km · 3 couriers available · all fees included</p>
                <div className="mt-3 space-y-2">
                    {QUOTES.map((q) => (
                        <div
                            key={q.name}
                            className={cn(
                                "flex items-center gap-2 rounded-2xl border p-2",
                                q.selected ? "border-forest bg-forest text-white shadow-lg shadow-forest/25" : "border-app-border bg-white",
                            )}>
                            <span className={cn("grid size-8 shrink-0 place-items-center rounded-xl text-[10px] font-bold", q.avatar)}>{q.initials}</span>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-[10px] font-bold tracking-tight">{q.name}</p>
                                <p className={cn("flex items-center gap-1 text-[9px]", q.selected ? "text-white/70" : "text-sage")}>
                                    <Star size={9} className="fill-gold text-gold" /> {q.rating} · {q.eta}
                                </p>
                                <span className={cn("mt-0.5 inline-block rounded-full px-1.5 text-[8px] font-bold", q.tagTone)}>{q.tag}</span>
                            </div>
                            <div className="flex flex-col items-end gap-0.5">
                                <p className="text-[12px] font-extrabold tracking-tight">{q.price}</p>
                                {q.selected && (
                                    <span className="grid size-4 place-items-center rounded-full bg-lime text-forest">
                                        <Check size={10} strokeWidth={3} />
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <p className="mt-2.5 flex items-center gap-1 text-[9px] font-semibold text-emerald">
                    <ShieldCheck size={11} /> Held in escrow until you share your PIN
                </p>
                <span className="mt-2.5 flex items-center justify-center gap-1.5 rounded-2xl bg-lime py-2.5 text-[12px] font-bold text-forest">
                    Book Swiftline · ₦2,926 <ArrowRight size={13} />
                </span>
            </div>
        </div>
    );
}
