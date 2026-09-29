import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BellRing, ChevronLeft, ChevronRight, Bike, CheckCircle2, CreditCard, MapPin, Navigation, PackageCheck, ShoppingBag, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./primitives";

// Mirrors the order status pipeline in drova-backend (OrderStatus) and the public tracking page.
const STAGES = [
    {
        icon: ShoppingBag,
        label: "Order placed",
        who: "Customer",
        text: "The customer books from your storefront — or your team creates the order in the dashboard. The price is quoted instantly from your pricing rules. Guests don't need an account.",
        chips: ["Storefront or dashboard", "Guest checkout", "Instant quote"],
    },
    {
        icon: CreditCard,
        label: "Payment confirmed",
        who: "Drova",
        text: "The customer pays by card, bank transfer or payment link. The money is held in escrow — not with you, not with the rider — and a 6-digit delivery PIN is sent to the customer.",
        chips: ["Held in escrow", "Delivery PIN issued"],
    },
    {
        icon: UserCheck,
        label: "Rider assigned",
        who: "Drova",
        text: "Drova offers the job to available riders who still have room — within their order and weight limits. The first to accept gets it. If nobody accepts in time, you're alerted to assign it yourself.",
        chips: ["Auto-dispatch", "Capacity-aware", "Manual override"],
    },
    {
        icon: Navigation,
        label: "Heading to pickup",
        who: "Rider",
        text: "The rider navigates to the pickup address. From here on, the customer can watch them move on the tracking page.",
        chips: ["Live location"],
    },
    {
        icon: PackageCheck,
        label: "Package picked up",
        who: "Rider",
        text: "The rider confirms collection. Riders carrying several orders must collect every pickup before they can start the trip — so nothing is left behind.",
        chips: ["Batch pickups", "Care instructions shown"],
    },
    {
        icon: Bike,
        label: "On the way",
        who: "Rider",
        text: "Live GPS streams from the rider's phone to your dashboard and the customer's tracking link, updating on its own.",
        chips: ["Real-time GPS", "Shareable tracking link"],
    },
    {
        icon: MapPin,
        label: "Arrived at drop-off",
        who: "Rider",
        text: "The customer is told their rider is at the door, so no one is left waiting outside.",
        chips: ["Customer notified"],
    },
    {
        icon: CheckCircle2,
        label: "Delivered",
        who: "Customer",
        text: "The customer hands over their PIN and the rider enters it to complete the order. After a 24-hour dispute window, the payment is released to your wallet automatically — and the customer is invited to leave a review.",
        chips: ["PIN-confirmed", "24h dispute window", "Auto-release to wallet"],
    },
];

const STEP_MS = 4500;

export default function OrderLifecycle() {
    const [active, setActive] = useState(0);
    const [auto, setAuto] = useState(true);
    const stage = STAGES[active];

    /** Jump to a stage (wrapping at both ends) and stop the autoplay. */
    const go = (i: number) => {
        setActive((i + STAGES.length) % STAGES.length);
        setAuto(false);
    };

    useEffect(() => {
        if (!auto) return;
        const id = setTimeout(() => setActive((i) => (i + 1) % STAGES.length), STEP_MS);
        return () => clearTimeout(id);
    }, [active, auto]);

    return (
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
            {/* The stage list is desktop-only; on phones the card below is self-contained. */}
            <Reveal className="hidden lg:block">
                <ol className="relative">
                    <span className="absolute bottom-5 left-[19px] top-5 w-0.5 bg-forest/10" />
                    <motion.span
                        className="absolute bottom-5 left-[19px] top-5 w-0.5 origin-top bg-emerald"
                        animate={{ scaleY: active / (STAGES.length - 1) }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                    {STAGES.map((s, i) => (
                        <li key={s.label}>
                            <button
                                type="button"
                                onClick={() => go(i)}
                                className={cn(
                                    "group relative flex w-full items-center gap-4 rounded-2xl py-2 pr-3 text-left transition-colors",
                                    i === active ? "bg-white shadow-sm" : "hover:bg-white/60",
                                )}>
                                <span
                                    className={cn(
                                        "relative z-10 grid size-10 shrink-0 place-items-center rounded-full border-2 transition-colors",
                                        i < active && "border-emerald bg-emerald text-white",
                                        i === active && "border-emerald bg-white text-emerald ring-4 ring-emerald/15",
                                        i > active && "border-forest/15 bg-app-bg text-sage",
                                    )}>
                                    <s.icon className="h-4 w-4" />
                                </span>
                                <span className="flex-1">
                                    <span className={cn("block font-semibold", i === active ? "text-forest" : "text-forest/70")}>{s.label}</span>
                                </span>
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-sage">{s.who}</span>
                            </button>
                        </li>
                    ))}
                </ol>
            </Reveal>

            <Reveal delay={0.1} className="lg:sticky lg:top-28">
                <div className="relative overflow-hidden rounded-[2rem] bg-forest p-6 text-white shadow-2xl shadow-forest/30 md:p-10">
                    <div className="absolute -right-24 -top-24 size-72 rounded-full bg-lime/25 blur-[90px]" />
                    <div className="absolute -bottom-24 -left-10 size-60 rounded-full bg-emerald/20 blur-[90px]" />

                    {/* Mini route showing where the parcel is */}
                    <div className="relative mx-2 mb-8 h-10 md:mx-0 md:mb-10">
                        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/10" />
                        <motion.div
                            className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-lime to-emerald"
                            animate={{ width: `${(active / (STAGES.length - 1)) * 100}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                        {STAGES.map((s, i) => (
                            <button
                                key={s.label}
                                type="button"
                                onClick={() => go(i)}
                                aria-label={`Stage ${i + 1}: ${s.label}`}
                                className="absolute top-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center"
                                style={{ left: `${(i / (STAGES.length - 1)) * 100}%` }}>
                                <span className={cn("size-2.5 rounded-full transition-colors", i <= active ? "bg-lime" : "bg-white/25")} />
                            </button>
                        ))}
                        <motion.span
                            className="pointer-events-none absolute top-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-forest shadow-lg shadow-black/30"
                            animate={{ left: `${(active / (STAGES.length - 1)) * 100}%` }}
                            transition={{ type: "spring", stiffness: 120, damping: 18 }}>
                            <stage.icon className="h-4 w-4" />
                        </motion.span>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -14 }}
                            transition={{ duration: 0.35 }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.25}
                            onDragEnd={(_, info) => {
                                if (info.offset.x < -50) go(active + 1);
                                else if (info.offset.x > 50) go(active - 1);
                            }}
                            className="relative min-h-[17.5rem] touch-pan-y md:min-h-0">
                            <p className="text-[13px] font-semibold text-lime">
                                Stage {active + 1} of {STAGES.length} · {stage.who}
                            </p>
                            <h3 className="mt-2 text-[1.75rem] font-bold leading-tight tracking-tight md:mt-3 md:text-4xl">{stage.label}</h3>
                            <p className="mt-3 text-[15px] leading-relaxed text-white/70 md:mt-4 md:text-lg">{stage.text}</p>
                            <div className="mt-5 flex flex-wrap gap-2 md:mt-6">
                                {stage.chips.map((c) => (
                                    <span key={c} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90">
                                        {c}
                                    </span>
                                ))}
                            </div>
                            <div className="mt-8 hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70 md:flex">
                                <BellRing className="h-4 w-4 shrink-0 text-gold" />
                                Your dashboard and the customer's tracking link update the moment this happens.
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Phones: step through the stages (the card can also be swiped). */}
                    <div className="relative mt-4 flex items-center justify-between lg:hidden">
                        <button type="button" onClick={() => go(active - 1)} aria-label="Previous stage" className="grid size-11 place-items-center rounded-full bg-white/10 text-white active:bg-white/20">
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <span className="text-xs font-semibold text-white/50">Swipe or tap to explore</span>
                        <button type="button" onClick={() => go(active + 1)} aria-label="Next stage" className="grid size-11 place-items-center rounded-full bg-lime text-forest active:bg-lime/80">
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </Reveal>
        </div>
    );
}
