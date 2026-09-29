import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { ArrowLeft, Check, CheckCheck, Lock, Mic, Paperclip, Radar, Star, Store, Users, Wallet, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { PhoneFrame } from "./primitives";
import { BrandMark } from "./Brand";

// "Why Drova" told as two phones: the group chat most courier businesses run on,
// next to a Drova order that runs itself. Both screens animate on a loop while visible.

/** Counts 0 → `total` one step every `stepMs`, holds, then starts again. Pauses off-screen. */
function useLoop(total: number, stepMs: number, holdMs: number, active: boolean) {
    const [step, setStep] = useState(0);
    useEffect(() => {
        if (!active) return;
        const id = setTimeout(() => setStep((s) => (s >= total ? 0 : s + 1)), step >= total ? holdMs : stepMs);
        return () => clearTimeout(id);
    }, [step, total, stepMs, holdMs, active]);
    return step;
}

// ─── Without Drova: the group chat ───────────────────────────────────────────

const CHAT = [
    { from: "Customer", color: "text-emerald", text: "Abeg how much to Yaba? I've sent a voice note", time: "9:02" },
    { from: "You", text: "Who's free for a Lekki pickup?? 🙏🏾", time: "9:04", mine: true },
    { from: "Customer", color: "text-emerald", text: "I've sent the money, check again 🙄", time: "9:15" },
    { from: "Rider · Musa", color: "text-[#c2410c]", text: "Oga, when are you paying for last week?", time: "9:31" },
    { from: "Customer", color: "text-emerald", text: "Where is my package?? It's been 3 hours 😡", time: "11:48" },
];

export function GroupChatScreen({ active }: { active: boolean }) {
    const step = useLoop(CHAT.length, 1500, 3200, active);
    const unread = 142 + step * 3;
    const typing = step < CHAT.length;

    return (
        <div className="flex h-full flex-col bg-[#efeae2] text-[#111b21]">
            {/* Header */}
            <div className="flex items-center gap-2.5 bg-[#f0f2f5] px-3 pb-2.5 pt-9">
                <ArrowLeft size={16} className="text-[#54656f]" />
                <span className="grid size-8 place-items-center rounded-full bg-[#dfe5e7] text-[#54656f]">
                    <Users size={15} />
                </span>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-semibold">Deliveries & Riders 🚚</p>
                    <p className="truncate text-[10px] text-emerald">{typing ? "Customer is typing…" : "Musa, Tunde, +16 more"}</p>
                </div>
                <motion.span key={unread} initial={{ scale: 1.35 }} animate={{ scale: 1 }} className="rounded-full bg-[#25d366] px-1.5 py-0.5 text-[9px] font-bold text-white">
                    {unread}
                </motion.span>
            </div>

            {/* Messages */}
            <div className="flex flex-1 flex-col justify-end gap-1.5 overflow-hidden px-2.5 py-3">
                <p className="mx-auto mb-1 rounded-md bg-white/80 px-2 py-0.5 text-[9px] font-medium text-[#54656f] shadow-sm">TODAY</p>
                <AnimatePresence initial={false}>
                    {CHAT.slice(0, step).map((m) => (
                        <motion.div
                            key={m.text}
                            layout
                            initial={{ opacity: 0, y: 14, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: "spring", stiffness: 380, damping: 28 }}
                            className={cn(
                                "max-w-[82%] rounded-lg px-2.5 py-1.5 text-[11px] leading-snug shadow-[0_1px_0.5px_rgba(0,0,0,0.13)]",
                                m.mine ? "self-end rounded-tr-none bg-[#d9fdd3]" : "self-start rounded-tl-none bg-white",
                            )}>
                            {!m.mine && <p className={cn("text-[9px] font-bold", m.color)}>{m.from}</p>}
                            <p>{m.text}</p>
                            <p className="mt-0.5 flex items-center justify-end gap-0.5 text-[8px] text-[#667781]">
                                {m.time}
                                {m.mine && <CheckCheck size={10} className="text-[#53bdeb]" />}
                            </p>
                        </motion.div>
                    ))}
                    {typing && (
                        <motion.div
                            key={`typing-${step}`}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex gap-1 self-start rounded-lg rounded-tl-none bg-white px-3 py-2.5 shadow-[0_1px_0.5px_rgba(0,0,0,0.13)]">
                            {[0, 1, 2].map((d) => (
                                <motion.span
                                    key={d}
                                    className="size-1.5 rounded-full bg-[#8696a0]"
                                    animate={{ y: [0, -3, 0] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: d * 0.15 }}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Composer */}
            <div className="flex items-center gap-1.5 px-2 pb-3">
                <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-3 py-2 text-[10px] text-[#8696a0]">
                    <Paperclip size={12} /> Message
                </div>
                <span className="grid size-8 place-items-center rounded-full bg-[#00a884] text-white">
                    <Mic size={13} />
                </span>
            </div>
        </div>
    );
}

// ─── With Drova: the order runs itself ───────────────────────────────────────

const EVENTS = [
    { icon: Store, text: "Booked online", meta: "Price quoted instantly" },
    { icon: Lock, text: "₦3,200 in escrow", meta: "Paid before pickup" },
    { icon: Zap, text: "Rider accepted", meta: "Tunde, in 12 seconds" },
    { icon: Radar, text: "Tracked live", meta: "No “where is it?” calls" },
    { icon: Star, text: "Delivered · 5★", meta: "PIN confirmed at the door" },
];

export function DrovaOrderScreen({ active }: { active: boolean }) {
    const step = useLoop(EVENTS.length, 1300, 3400, active);
    const done = step >= EVENTS.length;

    return (
        <div className="flex h-full flex-col bg-app-bg text-forest">
            {/* Header */}
            <div className="relative overflow-hidden bg-forest px-4 pb-4 pt-9 text-white">
                <div className="absolute -right-10 -top-10 size-36 rounded-full bg-lime/30 blur-3xl" />
                <div className="relative flex items-center gap-2.5">
                    <span className="grid size-9 place-items-center rounded-full bg-lime">
                        <BrandMark className="bg-forest" size={17} />
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-bold">Order #4827315</p>
                        <p className="text-[10px] text-white/60">Lekki Phase 1 → Yaba</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-lime/20 px-2 py-0.5 text-[9px] font-bold text-lime">
                        <span className="size-1.5 animate-pulse rounded-full bg-lime" /> Live
                    </span>
                </div>
                <div className="relative mt-3.5 h-1.5 overflow-hidden rounded-full bg-white/15">
                    <motion.div className="h-full rounded-full bg-gradient-to-r from-lime to-gold" animate={{ width: `${(step / EVENTS.length) * 100}%` }} transition={{ duration: 0.5 }} />
                </div>
                <p className="relative mt-1.5 text-[9px] font-semibold text-white/60">{done ? "Completed" : `Step ${step + 1} of ${EVENTS.length}`}</p>
            </div>

            {/* Timeline */}
            <ol className="relative flex-1 space-y-1.5 px-3 py-3">
                {EVENTS.map((e, i) => {
                    const state = i < step ? "done" : i === step ? "now" : "next";
                    return (
                        <motion.li
                            key={e.text}
                            animate={{ opacity: state === "next" ? 0.45 : 1, scale: state === "now" ? 1.02 : 1 }}
                            transition={{ duration: 0.3 }}
                            className={cn(
                                "flex items-center gap-2.5 rounded-2xl border p-2 transition-colors",
                                state === "now" ? "border-emerald bg-white shadow-lg shadow-emerald/15" : state === "done" ? "border-app-border bg-white" : "border-transparent",
                            )}>
                            <span
                                className={cn(
                                    "grid size-8 shrink-0 place-items-center rounded-xl transition-colors",
                                    state === "done" ? "bg-lime/25 text-forest" : state === "now" ? "bg-forest text-lime" : "bg-forest/5 text-sage",
                                )}>
                                <e.icon size={14} />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-[11px] font-bold">{e.text}</p>
                                <p className="truncate text-[9px] text-sage">{e.meta}</p>
                            </div>
                            <span className="grid size-4 shrink-0 place-items-center">
                                {state === "done" && (
                                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="grid size-4 place-items-center rounded-full bg-emerald text-white">
                                        <Check size={10} strokeWidth={3} />
                                    </motion.span>
                                )}
                                {state === "now" && <span className="size-3.5 animate-spin rounded-full border-2 border-emerald border-t-transparent" />}
                            </span>
                        </motion.li>
                    );
                })}
            </ol>

            {/* Payout toast */}
            <div className="h-[68px] px-3 pb-3">
                <AnimatePresence>
                    {done && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-lime to-emerald p-2.5 text-white shadow-lg shadow-emerald/30">
                            <span className="grid size-8 place-items-center rounded-xl bg-white/20">
                                <Wallet size={14} />
                            </span>
                            <div>
                                <p className="text-[11px] font-bold">₦3,200 heading to your wallet</p>
                                <p className="text-[9px] text-white/85">After the 24h dispute window</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// ─── Layout ──────────────────────────────────────────────────────────────────

function Caption({ good }: { good?: boolean }) {
    return (
        <p className={cn("mt-8 flex items-center justify-center gap-2 text-sm font-semibold", good ? "text-emerald" : "text-red-500/80")}>
            <span className={cn("grid size-5 place-items-center rounded-full", good ? "bg-emerald text-white" : "bg-red-500/15")}>
                {good ? <Check className="h-3 w-3" strokeWidth={3} /> : <X className="h-3 w-3" strokeWidth={3} />}
            </span>
            {good ? "With Drova — every order handled" : "Without Drova — everything lost in one chat"}
        </p>
    );
}

const FLOAT = { y: [0, -10, 0] };

export default function WhyPhones() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { margin: "-120px" });
    const [side, setSide] = useState<"without" | "with">("without");
    const [touched, setTouched] = useState(false);

    // Phones: flip between the two stories until the visitor picks one.
    useEffect(() => {
        if (touched || !inView) return;
        const id = setTimeout(() => setSide((s) => (s === "without" ? "with" : "without")), 9000);
        return () => clearTimeout(id);
    }, [side, touched, inView]);

    return (
        <div ref={ref}>
            {/* Desktop: both phones, tilted toward each other */}
            <div className="relative hidden items-start justify-center gap-8 md:flex lg:gap-12">
                <div className="absolute inset-x-0 top-1/3 mx-auto h-72 max-w-3xl rounded-full bg-gradient-to-r from-[#efeae2] via-transparent to-lime/30 blur-3xl" />
                <div className="relative">
                    <motion.div
                        initial={{ opacity: 0, rotate: 0, x: 40 }}
                        whileInView={{ opacity: 1, rotate: -6, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 60, damping: 14 }}>
                        <motion.div animate={FLOAT} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
                            <PhoneFrame className="grayscale-[35%]">
                                <GroupChatScreen active={inView} />
                            </PhoneFrame>
                        </motion.div>
                    </motion.div>
                    <Caption />
                </div>

                <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="relative z-10 mt-60 -mx-4 grid size-14 shrink-0 place-items-center rounded-full bg-white text-sm font-bold text-forest shadow-xl shadow-forest/15 ring-8 ring-white/60">
                    vs
                </motion.span>

                <div className="relative">
                    <motion.div
                        initial={{ opacity: 0, rotate: 0, x: -40 }}
                        whileInView={{ opacity: 1, rotate: 6, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 60, damping: 14, delay: 0.15 }}>
                        <motion.div animate={FLOAT} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 }}>
                            <PhoneFrame className="shadow-lime/40">
                                <DrovaOrderScreen active={inView} />
                            </PhoneFrame>
                        </motion.div>
                    </motion.div>
                    <Caption good />
                </div>
            </div>

            {/* Phones: one phone, a switch to flip between the two stories */}
            <div className="md:hidden">
                <div className="mx-auto grid max-w-xs grid-cols-2 rounded-full bg-app-bg p-1 ring-1 ring-app-border">
                    {(["without", "with"] as const).map((s) => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => {
                                setSide(s);
                                setTouched(true);
                            }}
                            aria-pressed={side === s}
                            className={cn("relative rounded-full py-2.5 text-sm font-semibold transition-colors", side === s ? (s === "with" ? "text-white" : "text-forest") : "text-sage")}>
                            {side === s && (
                                <motion.span
                                    layoutId="why-toggle"
                                    className={cn("absolute inset-0 rounded-full shadow", s === "with" ? "bg-forest" : "bg-white")}
                                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                                />
                            )}
                            <span className="relative">{s === "with" ? "With Drova" : "Without Drova"}</span>
                        </button>
                    ))}
                </div>

                <div className="relative mt-8 flex justify-center">
                    <div className={cn("absolute inset-0 m-auto size-72 rounded-full blur-3xl transition-colors duration-700", side === "with" ? "bg-lime/35" : "bg-[#efeae2]")} />
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={side}
                            initial={{ opacity: 0, rotateY: side === "with" ? -35 : 35, scale: 0.92 }}
                            animate={{ opacity: 1, rotateY: 0, scale: 1, rotate: side === "with" ? 3 : -3 }}
                            exit={{ opacity: 0, rotateY: side === "with" ? 35 : -35, scale: 0.92 }}
                            transition={{ duration: 0.45 }}
                            style={{ transformPerspective: 1200 }}
                            className="relative">
                            <PhoneFrame className="w-[260px]">{side === "with" ? <DrovaOrderScreen active={inView} /> : <GroupChatScreen active={inView} />}</PhoneFrame>
                        </motion.div>
                    </AnimatePresence>
                </div>
                <Caption good={side === "with"} />
            </div>
        </div>
    );
}
