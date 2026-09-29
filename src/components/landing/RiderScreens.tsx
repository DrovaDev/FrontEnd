import { useEffect, useState } from "react";
import { Award, Bike, CloudRain, Flame, Moon, Package, Star, Timer, Truck, Wallet, Zap, HeartPulse, ShieldCheck, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import CityMap from "./CityMap";

const OFFER_SECONDS = 45;

/** Rider app: an incoming order offer with its expiry countdown. */
export function RiderOfferScreen() {
    const [left, setLeft] = useState(OFFER_SECONDS);
    useEffect(() => {
        const id = setInterval(() => setLeft((s) => (s <= 1 ? OFFER_SECONDS : s - 1)), 1000);
        return () => clearInterval(id);
    }, []);
    const progress = left / OFFER_SECONDS;
    const R = 22;
    const C = 2 * Math.PI * R;

    return (
        <div className="relative flex h-full flex-col bg-app-bg text-forest">
            <div className="flex items-center justify-between px-5 pb-2 pt-9 text-[11px] font-semibold">
                <span>9:41</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald px-2 py-0.5 text-[10px] font-bold text-white">
                    <span className="size-1.5 animate-pulse rounded-full bg-white" /> Online
                </span>
            </div>
            <div className="relative h-[230px]">
                <CityMap route movingRider />
            </div>
            <div className="relative -mt-6 flex-1 rounded-t-3xl bg-white p-5 shadow-[0_-10px_30px_rgba(0,64,48,0.12)]">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald">New delivery offer</p>
                        <p className="mt-1 text-[22px] font-extrabold leading-none">₦1,800</p>
                        <p className="text-[11px] text-sage">Your earnings · 6.4 km · Parcel, 3 kg</p>
                    </div>
                    <div className="relative grid size-14 place-items-center">
                        <svg viewBox="0 0 56 56" className="absolute inset-0 -rotate-90">
                            <circle cx="28" cy="28" r={R} fill="none" stroke="#eaf8df" strokeWidth="5" />
                            <circle
                                cx="28"
                                cy="28"
                                r={R}
                                fill="none"
                                stroke={left < 10 ? "#ddc52f" : "#00a651"}
                                strokeWidth="5"
                                strokeLinecap="round"
                                strokeDasharray={C}
                                strokeDashoffset={C * (1 - progress)}
                                style={{ transition: "stroke-dashoffset 1s linear" }}
                            />
                        </svg>
                        <span className="text-[12px] font-bold tabular-nums">0:{String(left).padStart(2, "0")}</span>
                    </div>
                </div>
                <ol className="mt-4 space-y-3 text-[12px]">
                    <li className="flex gap-3">
                        <span className="mt-1 size-2.5 shrink-0 rounded-full bg-forest" />
                        <div>
                            <p className="text-[10px] text-sage">Pickup</p>
                            <p className="font-semibold">14 Admiralty Way, Lekki Phase 1</p>
                        </div>
                    </li>
                    <li className="flex gap-3">
                        <span className="mt-1 size-2.5 shrink-0 rounded-full bg-gold" />
                        <div>
                            <p className="text-[10px] text-sage">Drop-off</p>
                            <p className="font-semibold">22 Herbert Macaulay Way, Yaba</p>
                        </div>
                    </li>
                </ol>
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {["Keep upright", "Fragile"].map((c) => (
                        <span key={c} className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-semibold text-gold-ink">
                            {c}
                        </span>
                    ))}
                </div>
                <div className="mt-5 grid grid-cols-[1fr_2fr] gap-2">
                    <span className="rounded-2xl border border-app-border py-3 text-center text-[13px] font-semibold text-sage">Decline</span>
                    <span className="rounded-2xl bg-forest py-3 text-center text-[13px] font-bold text-white">Accept order</span>
                </div>
            </div>
        </div>
    );
}

const BADGES = [
    { icon: Zap, name: "Quick Draw", tone: "bg-gold/20 text-gold-ink" },
    { icon: Flame, name: "Iron Rider", tone: "bg-gold/20 text-gold-ink" },
    { icon: Star, name: "Golden Glove", tone: "bg-gold/20 text-gold-ink" },
    { icon: HeartPulse, name: "Medical Courier", tone: "bg-emerald/15 text-emerald" },
    { icon: Truck, name: "Long Hauler", tone: "bg-forest/10 text-forest" },
    { icon: Moon, name: "Night Owl", tone: "bg-forest/10 text-forest" },
    { icon: CloudRain, name: "Rainy Day", tone: "bg-lime/20 text-forest" },
    { icon: Package, name: "Century", tone: "bg-emerald/15 text-emerald" },
    { icon: ShieldCheck, name: "Verified", tone: "bg-emerald/15 text-emerald" },
];

/** Rider app: tier progress, earnings and badges. */
export function RiderProfileScreen() {
    return (
        <div className="flex h-full flex-col bg-app-bg text-forest">
            <div className="relative overflow-hidden bg-forest px-5 pb-6 pt-10 text-white">
                <div className="absolute -right-10 -top-10 size-40 rounded-full bg-lime/30 blur-3xl" />
                <div className="relative flex items-center gap-3">
                    <span className="grid size-12 place-items-center rounded-full bg-white text-[14px] font-bold text-forest">TA</span>
                    <div>
                        <p className="text-[15px] font-bold">Tunde Adewale</p>
                        <p className="flex items-center gap-1 text-[11px] text-white/70">
                            <Bike size={12} /> Swiftline Logistics
                        </p>
                    </div>
                    <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold text-forest">
                        <Trophy size={11} /> Gold
                    </span>
                </div>
                <div className="relative mt-5">
                    <div className="flex justify-between text-[10px] text-white/70">
                        <span>2,140 points</span>
                        <span>Platinum at 4,000</span>
                    </div>
                    <div className="mt-1.5 h-2 rounded-full bg-white/15">
                        <div className="h-full w-[54%] rounded-full bg-gradient-to-r from-lime to-gold" />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5 p-4">
                <div className="rounded-2xl border border-app-border bg-white p-3">
                    <Wallet size={14} className="text-emerald" />
                    <p className="mt-1.5 text-[17px] font-extrabold">₦48,600</p>
                    <p className="text-[10px] text-sage">Earned this week</p>
                </div>
                <div className="rounded-2xl border border-app-border bg-white p-3">
                    <Timer size={14} className="text-emerald" />
                    <p className="mt-1.5 text-[17px] font-extrabold">96%</p>
                    <p className="text-[10px] text-sage">On-time rate</p>
                </div>
            </div>
            <div className="px-4">
                <p className="flex items-center gap-1.5 text-[12px] font-bold">
                    <Award size={14} className="text-emerald" /> Badges earned
                </p>
                <div className="mt-2.5 grid grid-cols-3 gap-2">
                    {BADGES.map(({ icon: Icon, name, tone }) => (
                        <div key={name} className="flex flex-col items-center gap-1 rounded-2xl border border-app-border bg-white p-2 text-center">
                            <span className={cn("grid size-9 place-items-center rounded-full", tone)}>
                                <Icon size={16} />
                            </span>
                            <span className="text-[9px] font-semibold leading-tight">{name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
