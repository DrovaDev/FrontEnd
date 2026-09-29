import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BadgeCheck, Bell, Check, Mail, MessageCircle, ShieldCheck, Smartphone, Star } from "lucide-react";
import { cn } from "@/lib/utils";

// "Everything you need to scale": a bento grid where each tile shows a small piece of the
// product (with sample data) instead of an icon and a paragraph.

function Tile({ title, text, className, dark, children }: { title: string; text: string; className?: string; dark?: boolean; children: ReactNode }) {
    return (
        <motion.div
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}
            className={cn(
                "group relative flex flex-col overflow-hidden rounded-[1.75rem] border p-5 md:p-6",
                dark ? "border-forest bg-forest text-white" : "border-app-border bg-app-bg/70",
                className,
            )}>
            <div className="relative flex min-h-[9.5rem] flex-1 items-center justify-center">{children}</div>
            <div className="relative mt-5">
                <p className={cn("text-[17px] font-bold tracking-tight", dark ? "text-white" : "text-forest")}>{title}</p>
                <p className={cn("mt-1 text-sm leading-relaxed", dark ? "text-white/60" : "text-sage")}>{text}</p>
            </div>
        </motion.div>
    );
}

// ─── Staff & roles ───────────────────────────────────────────────────────────

const STAFF = [
    { initials: "AO", name: "Amaka O.", role: "Dispatcher", tone: "bg-gold text-forest", perms: [true, true, false, false] },
    { initials: "TB", name: "Tobi B.", role: "Finance", tone: "bg-lime text-forest", perms: [false, false, true, false] },
    { initials: "KE", name: "Kemi E.", role: "Support", tone: "bg-white text-forest", perms: [true, false, false, true] },
];
const PERMS = ["Orders", "Riders", "Money", "Disputes"];

function StaffVisual() {
    return (
        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] text-[12px] backdrop-blur">
            <div className="grid grid-cols-[auto_repeat(4,1fr)] sm:grid-cols-[1.6fr_repeat(4,1fr)] gap-2 border-b border-white/10 px-3 py-2 text-[10px] font-semibold text-white/50">
                <span>Team</span>
                {PERMS.map((p) => (
                    <span key={p} className="text-center">
                        {p}
                    </span>
                ))}
            </div>
            {STAFF.map((s, r) => (
                <div key={s.name} className="grid grid-cols-[auto_repeat(4,1fr)] sm:grid-cols-[1.6fr_repeat(4,1fr)] items-center gap-2 border-b border-white/5 px-3 py-2 last:border-0">
                    <span className="flex min-w-0 items-center gap-2">
                        <span className={cn("grid size-7 shrink-0 place-items-center rounded-full text-[10px] font-bold", s.tone)}>{s.initials}</span>
                        <span className="hidden min-w-0 sm:block">
                            <span className="block truncate font-semibold">{s.name}</span>
                            <span className="block text-[10px] text-white/50">{s.role}</span>
                        </span>
                    </span>
                    {s.perms.map((on, c) => (
                        <span key={c} className="flex justify-center">
                            <motion.span
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 + (r * 4 + c) * 0.04, type: "spring" }}
                                className={cn("grid size-5 place-items-center rounded-md", on ? "bg-lime text-forest" : "border border-white/15")}>
                                {on && <Check className="h-3 w-3" strokeWidth={3} />}
                            </motion.span>
                        </span>
                    ))}
                </div>
            ))}
        </div>
    );
}

// ─── Verified reviews ────────────────────────────────────────────────────────

function ReviewVisual() {
    return (
        <div className="relative w-full max-w-[16rem]">
            <div className="absolute inset-x-4 -bottom-2 h-full rounded-2xl bg-white/70 shadow-sm" />
            <div className="relative rounded-2xl bg-white p-4 shadow-lg shadow-forest/10">
                <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <motion.span key={i} initial={{ scale: 0, rotate: -40 }} whileInView={{ scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.08, type: "spring" }}>
                            <Star className="h-4 w-4 fill-gold text-gold" />
                        </motion.span>
                    ))}
                    <span className="ml-auto text-sm font-bold text-forest">4.9</span>
                </div>
                <p className="mt-2 text-[13px] leading-snug text-forest/80">“At my door in 35 minutes. The tracking link was spot on.”</p>
                <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald/10 px-2 py-0.5 text-[10px] font-semibold text-emerald">
                    <BadgeCheck className="h-3 w-3" /> Verified delivery
                </p>
            </div>
        </div>
    );
}

// ─── Notifications ───────────────────────────────────────────────────────────

const NOTES = [
    { icon: Smartphone, tone: "bg-forest text-lime", title: "New order · ₦3,200", meta: "Push · just now" },
    { icon: MessageCircle, tone: "bg-[#25d366] text-white", title: "Your sign-in code is 482715", meta: "WhatsApp · 1 min" },
    { icon: Mail, tone: "bg-gold text-forest", title: "Payout of ₦48,600 sent", meta: "Email · 5 min" },
    { icon: Bell, tone: "bg-emerald text-white", title: "Rider arrived at drop-off", meta: "Push · 8 min" },
];

function NotificationsVisual() {
    const [top, setTop] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setTop((t) => (t + 1) % NOTES.length), 2200);
        return () => clearInterval(id);
    }, []);
    const shown = [0, 1, 2].map((k) => NOTES[(top + k) % NOTES.length]);

    return (
        <div className="relative h-[10.5rem] w-full max-w-[16rem]">
            <AnimatePresence initial={false}>
                {shown.map((n, k) => (
                    <motion.div
                        key={n.title}
                        layout
                        initial={{ opacity: 0, y: -30, scale: 0.9 }}
                        animate={{ opacity: 1 - k * 0.3, y: k * 52, scale: 1 - k * 0.05 }}
                        exit={{ opacity: 0, y: 200, scale: 0.85 }}
                        transition={{ type: "spring", stiffness: 260, damping: 26 }}
                        style={{ zIndex: 3 - k }}
                        className="absolute inset-x-0 top-0 flex items-center gap-2.5 rounded-2xl border border-app-border bg-white p-3 shadow-lg shadow-forest/10">
                        <span className={cn("grid size-8 shrink-0 place-items-center rounded-xl", n.tone)}>
                            <n.icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0">
                            <span className="block truncate text-[12px] font-semibold text-forest">{n.title}</span>
                            <span className="block text-[10px] text-sage">{n.meta}</span>
                        </span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

// ─── Operating hours ─────────────────────────────────────────────────────────

const HOURS = [
    { d: "M", open: 7, close: 20 },
    { d: "T", open: 7, close: 20 },
    { d: "W", open: 7, close: 20 },
    { d: "T", open: 7, close: 20 },
    { d: "F", open: 7, close: 22 },
    { d: "S", open: 9, close: 18 },
    { d: "S", open: 0, close: 0 },
];

function HoursVisual() {
    return (
        <div className="w-full max-w-[15rem]">
            <div className="mb-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald/10 px-2.5 py-1 text-[11px] font-semibold text-emerald">
                    <span className="size-1.5 animate-pulse rounded-full bg-emerald" /> Open now
                </span>
                <span className="text-[11px] text-sage">Pickups within 15 km</span>
            </div>
            <div className="flex h-24 items-end justify-between gap-1.5">
                {HOURS.map((h, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                        <div className="relative h-20 w-full rounded-lg bg-forest/5">
                            {h.close > 0 && (
                                <motion.div
                                    initial={{ scaleY: 0 }}
                                    whileInView={{ scaleY: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + i * 0.06, duration: 0.5 }}
                                    className={cn("absolute inset-x-0 origin-bottom rounded-lg", i === 1 ? "bg-forest" : "bg-lime")}
                                    style={{ bottom: `${(h.open / 24) * 100}%`, top: `${100 - (h.close / 24) * 100}%` }}
                                />
                            )}
                        </div>
                        <span className={cn("text-[10px] font-semibold", i === 1 ? "text-forest" : "text-sage")}>{h.d}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Verified business ───────────────────────────────────────────────────────

function VerifiedVisual() {
    return (
        <div className="relative w-full max-w-[15rem] rounded-2xl border border-app-border bg-white p-4 shadow-lg shadow-forest/10">
            <p className="text-[10px] font-semibold text-sage">Business verification</p>
            <p className="mt-0.5 text-sm font-bold text-forest">Swiftline Logistics Ltd</p>
            <div className="mt-3 space-y-1.5 text-[11px]">
                {[
                    ["CAC number", "RC 1843207"],
                    ["TIN", "2398 1142-0001"],
                ].map(([k, v], i) => (
                    <p key={k} className="flex items-center justify-between rounded-lg bg-app-bg px-2.5 py-1.5">
                        <span className="text-sage">{k}</span>
                        <span className="flex items-center gap-1 font-semibold text-forest">
                            {v}
                            <motion.span initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 + i * 0.2, type: "spring" }}>
                                <Check className="h-3 w-3 text-emerald" strokeWidth={3} />
                            </motion.span>
                        </span>
                    </p>
                ))}
            </div>
            <motion.span
                initial={{ scale: 0, rotate: -30 }}
                whileInView={{ scale: 1, rotate: -12 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
                className="absolute -right-3 -top-3 grid size-12 place-items-center rounded-full bg-lime text-forest shadow-lg shadow-lime/40">
                <ShieldCheck className="h-6 w-6" />
            </motion.span>
        </div>
    );
}

// ─── Disputes ────────────────────────────────────────────────────────────────

function DisputeVisual() {
    return (
        <div className="w-full max-w-md rounded-2xl border border-app-border bg-white p-4 shadow-lg shadow-forest/10">
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-mono text-[10px] text-sage">TKT-20931 · Quality</p>
                    <p className="text-sm font-bold text-forest">Package arrived damaged</p>
                </div>
                <motion.span
                    initial={{ backgroundColor: "rgba(221,197,47,0.25)" }}
                    whileInView={{ backgroundColor: "rgba(0,166,81,0.12)" }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.6, duration: 0.4 }}
                    className="rounded-full px-2.5 py-1 text-[10px] font-bold text-forest">
                    Resolved
                </motion.span>
            </div>
            <div className="mt-3 space-y-2 text-[12px]">
                {[
                    { who: "Customer · guest", text: "The screen cracked in transit 😞", mine: false },
                    { who: "Swiftline Logistics", text: "Sorry! We've refunded the delivery fee.", mine: true },
                ].map((m, i) => (
                    <motion.div
                        key={m.who}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.5 }}
                        className={cn("max-w-[85%] rounded-xl px-3 py-2", m.mine ? "ml-auto rounded-tr-sm bg-forest text-white" : "rounded-tl-sm bg-app-bg text-forest")}>
                        <p className={cn("text-[10px] font-semibold", m.mine ? "text-lime" : "text-emerald")}>{m.who}</p>
                        {m.text}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// ─── Grid ────────────────────────────────────────────────────────────────────

export default function OpsBento() {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="rail grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Tile dark className="lg:col-span-2" title="Staff & roles" text="Invite your team and give each person exactly the access they need.">
                <div className="absolute -right-16 -top-16 size-56 rounded-full bg-lime/20 blur-3xl" />
                <StaffVisual />
            </Tile>
            <Tile title="Verified reviews" text="Only customers with a completed delivery can review you.">
                <ReviewVisual />
            </Tile>
            <Tile title="Instant notifications" text="Push, email and WhatsApp keep everyone in the loop.">
                <NotificationsVisual />
            </Tile>
            <Tile title="Operating hours" text="Set when you're open and how far you'll travel for a pickup.">
                <HoursVisual />
            </Tile>
            <Tile title="Verified business" text="Confirm your business with your CAC number and TIN.">
                <VerifiedVisual />
            </Tile>
            <Tile className="md:col-span-2" title="Dispute management" text="Every issue gets a ticket and a thread — even for guest customers.">
                <DisputeVisual />
            </Tile>
        </motion.div>
    );
}
