import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

// Example rates only — every business sets its own in the dashboard.
const CITY_TIERS = [
    { max: 5, cost: 1500 },
    { max: 10, cost: 2500 },
    { max: 20, cost: 3800 },
    { max: Infinity, cost: 5500 },
];
const STATES = [
    { name: "Ogun", cost: 6000 },
    { name: "Oyo", cost: 8500 },
    { name: "Rivers", cost: 14000 },
    { name: "FCT Abuja", cost: 15000 },
];
const WEIGHT_TIERS = [
    { max: 5, cost: 0 },
    { max: 20, cost: 1000 },
    { max: Infinity, cost: 2500 },
];

// Mirrors calculatePaymentBreakdown in drova-backend's order service.
const PROCESSING_RATE = 0.02;
const PLATFORM_RATE = 0.025;
const FEE_CAP = 2000;

/** Sets the filled portion of a `.range` slider track. */
const fill = (v: number, min: number, max: number) => ({ "--fill": `${((v - min) / (max - min)) * 100}%` }) as React.CSSProperties;

const naira = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;

export default function PriceCalculator() {
    const [scope, setScope] = useState<"city" | "state">("city");
    const [km, setKm] = useState(8);
    const [state, setState] = useState(STATES[0].name);
    const [kg, setKg] = useState(3);

    const q = useMemo(() => {
        const base = scope === "city" ? CITY_TIERS.find((t) => km <= t.max)!.cost : STATES.find((s) => s.name === state)!.cost;
        const weight = WEIGHT_TIERS.find((t) => kg <= t.max)!.cost;
        const fee = base + weight;
        const processing = Math.min(fee * PROCESSING_RATE, FEE_CAP);
        const platform = Math.min(fee * PLATFORM_RATE, FEE_CAP);
        return { base, weight, fee, processing, platform, total: fee + processing + platform };
    }, [scope, km, state, kg]);

    return (
        <div className="overflow-hidden rounded-[2rem] border border-app-border bg-white shadow-2xl shadow-forest/10">
            <div className="grid md:grid-cols-[1.1fr_1fr]">
                <div className="space-y-7 p-6 md:p-8">
                    <div>
                        <p className="text-sm font-bold text-forest">Where is it going?</p>
                        <div className="mt-3 grid grid-cols-2 gap-1 rounded-full bg-app-bg p-1">
                            {(["city", "state"] as const).map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setScope(s)}
                                    className={cn("rounded-full py-2 text-sm font-semibold transition-colors", scope === s ? "bg-forest text-white shadow" : "text-sage hover:text-forest")}>
                                    {s === "city" ? "Within Lagos" : "To another state"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {scope === "city" ? (
                        <label className="block">
                            <span className="flex justify-between text-sm font-bold text-forest">
                                Distance <span className="tabular-nums text-emerald">{km} km</span>
                            </span>
                            <input type="range" min={1} max={35} value={km} onChange={(e) => setKm(+e.target.value)} className="range mt-4 w-full" style={fill(km, 1, 35)} />
                        </label>
                    ) : (
                        <div>
                            <p className="text-sm font-bold text-forest">Destination state</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {STATES.map((s) => (
                                    <button
                                        key={s.name}
                                        type="button"
                                        onClick={() => setState(s.name)}
                                        className={cn(
                                            "rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors",
                                            state === s.name ? "border-emerald bg-emerald/10 text-emerald" : "border-app-border text-sage hover:border-forest/30",
                                        )}>
                                        {s.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <label className="block">
                        <span className="flex justify-between text-sm font-bold text-forest">
                            Package weight <span className="tabular-nums text-emerald">{kg} kg</span>
                        </span>
                        <input type="range" min={1} max={40} value={kg} onChange={(e) => setKg(+e.target.value)} className="range mt-4 w-full" style={fill(kg, 1, 40)} />
                    </label>
                    <p className="text-xs text-sage">Example rates. You set your own distance tiers, state prices and weight surcharges.</p>
                </div>

                <div className="relative overflow-hidden bg-forest p-6 text-white md:p-8">
                    <div className="absolute -right-16 -top-16 size-56 rounded-full bg-lime/25 blur-3xl" />
                    <p className="relative text-[13px] font-semibold text-lime">Customer pays</p>
                    <motion.p key={q.total} initial={{ opacity: 0.4, y: 6 }} animate={{ opacity: 1, y: 0 }} className="relative mt-2 text-5xl font-bold tracking-tight tabular-nums">
                        {naira(q.total)}
                    </motion.p>
                    <dl className="relative mt-6 space-y-2.5 text-sm">
                        <Row label={scope === "city" ? `Distance (${km} km)` : `Flat rate to ${state}`} value={naira(q.base)} />
                        <Row label={`Weight (${kg} kg)`} value={q.weight ? `+ ${naira(q.weight)}` : "No extra"} />
                        <Row label="Payment processing · 2%" value={naira(q.processing)} muted />
                        <Row label="Drova fee · 2.5%" value={naira(q.platform)} muted />
                    </dl>
                    <div className="relative mt-6 rounded-2xl bg-white p-4 text-forest">
                        <p className="text-xs font-semibold text-sage">You receive</p>
                        <p className="text-2xl font-bold tabular-nums">{naira(q.fee)}</p>
                        <p className="text-xs text-sage">100% of your delivery fee. Fees are added at checkout and capped at ₦2,000 each.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
    return (
        <div className={cn("flex justify-between gap-4 border-b border-white/10 pb-2.5", muted && "text-white/55")}>
            <dt>{label}</dt>
            <dd className="font-semibold tabular-nums">{value}</dd>
        </div>
    );
}
