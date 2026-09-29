import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, CalendarCheck, Check, Loader2, MonitorPlay, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * "Request a demo" dialog. Any link to `#demo` opens it, so buttons anywhere on the site
 * just use href="#demo".
 *
 * Submissions are POSTed as JSON to VITE_DEMO_REQUEST_URL when it is set (a backend
 * endpoint, form service or automation webhook). Without it, the visitor's email app opens
 * with the request pre-filled to DEMO_EMAIL, so the feature works before any backend exists.
 */

export const DEMO_HASH = "#demo";
const DEMO_EMAIL = "product@drova.ng";
const ENDPOINT = import.meta.env.VITE_DEMO_REQUEST_URL as string | undefined;

const FLEET_SIZES = ["1–5", "6–25", "26–100", "100+"];
const TIMES = ["Morning", "Afternoon", "Evening"];

type Status = "idle" | "sending" | "sent" | "emailed" | "error";

function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
    return (
        <label className={cn("block", className)}>
            <span className="text-[13px] font-semibold text-forest">{label}</span>
            {children}
        </label>
    );
}

const inputClass =
    "mt-1.5 w-full rounded-xl border border-app-border bg-white px-3.5 py-2.5 text-[15px] text-forest outline-none transition placeholder:text-sage/60 focus:border-emerald focus:ring-4 focus:ring-emerald/15";

/** A single-choice set of chips, labelled as a group (a <label> would name only the first chip). */
function Chips({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
    return (
        <div role="group" aria-label={label} className="mt-5">
            <span className="text-[13px] font-semibold text-forest">{label}</span>
            <div className="mt-1.5 flex flex-wrap gap-2">
            {options.map((o) => (
                <button
                    key={o}
                    type="button"
                    onClick={() => onChange(o)}
                    aria-pressed={value === o}
                    className={cn(
                        "rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors",
                        value === o ? "border-forest bg-forest text-white" : "border-app-border bg-white text-sage hover:border-forest/30 hover:text-forest",
                    )}>
                    {o}
                </button>
            ))}
            </div>
        </div>
    );
}

export default function DemoRequest() {
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState<Status>("idle");
    const [fleet, setFleet] = useState(FLEET_SIZES[1]);
    const [time, setTime] = useState(TIMES[0]);
    const firstField = useRef<HTMLInputElement>(null);

    // Open whenever the URL hash is #demo; closing clears it.
    useEffect(() => {
        const sync = () => setOpen(window.location.hash === DEMO_HASH);
        sync();
        window.addEventListener("hashchange", sync);
        return () => window.removeEventListener("hashchange", sync);
    }, []);

    const close = () => {
        setOpen(false);
        if (window.location.hash === DEMO_HASH) history.replaceState(null, "", window.location.pathname + window.location.search);
        setTimeout(() => setStatus("idle"), 300);
    };

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        setTimeout(() => firstField.current?.focus(), 150);
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [open]);

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const data = {
            name: String(form.get("name") ?? "").trim(),
            business: String(form.get("business") ?? "").trim(),
            email: String(form.get("email") ?? "").trim(),
            phone: String(form.get("phone") ?? "").trim(),
            fleetSize: fleet,
            preferredTime: time,
            notes: String(form.get("notes") ?? "").trim(),
            source: "landing-page",
        };

        if (!ENDPOINT) {
            const body = [
                `Name: ${data.name}`,
                `Business: ${data.business}`,
                `Email: ${data.email}`,
                `Phone: ${data.phone}`,
                `Fleet size: ${data.fleetSize} riders`,
                `Best time for a call: ${data.preferredTime}`,
                data.notes && `\n${data.notes}`,
            ]
                .filter(Boolean)
                .join("\n");
            window.location.href = `mailto:${DEMO_EMAIL}?subject=${encodeURIComponent(`Demo request — ${data.business}`)}&body=${encodeURIComponent(body)}`;
            setStatus("emailed");
            return;
        }

        setStatus("sending");
        try {
            const res = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
            if (!res.ok) throw new Error(String(res.status));
            setStatus("sent");
        } catch {
            setStatus("error");
        }
    };

    const done = status === "sent" || status === "emailed";

    return (
        <AnimatePresence>
            {open && (
                <motion.div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="absolute inset-0 bg-forest-deep/70 backdrop-blur-sm" onClick={close} />
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="demo-title"
                        initial={{ y: 60, opacity: 0, scale: 0.98 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 40, opacity: 0, scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 320, damping: 30 }}
                        className="relative grid max-h-[92dvh] w-full max-w-4xl overflow-hidden rounded-t-[2rem] bg-white shadow-2xl sm:rounded-[2rem] md:grid-cols-[0.9fr_1.2fr]">
                        {/* Pitch panel */}
                        <div className="relative hidden overflow-hidden bg-forest p-8 text-white md:block">
                            <div className="absolute -right-20 -top-20 size-64 rounded-full bg-lime/25 blur-3xl" />
                            <span className="relative grid size-11 place-items-center rounded-2xl bg-lime text-forest">
                                <MonitorPlay className="h-5 w-5" />
                            </span>
                            <h2 className="relative mt-6 text-3xl font-bold leading-tight tracking-tight">See Drova running your deliveries.</h2>
                            <p className="relative mt-3 text-white/65">A 30-minute walkthrough with the team, built around how your business works today.</p>
                            <ul className="relative mt-8 space-y-3.5 text-sm">
                                {[
                                    "Your storefront, set up with your pricing",
                                    "Dispatch, tracking and escrow, live",
                                    "Rider payouts and your wallet",
                                    "Answers for your exact setup",
                                ].map((t) => (
                                    <li key={t} className="flex items-start gap-3">
                                        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-lime/20 text-lime">
                                            <Check className="h-3 w-3" strokeWidth={3} />
                                        </span>
                                        <span className="text-white/80">{t}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Form */}
                        <div className="relative overflow-y-auto p-6 sm:p-8">
                            <button type="button" onClick={close} aria-label="Close" className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-sage hover:bg-app-bg hover:text-forest">
                                <X className="h-5 w-5" />
                            </button>

                            <AnimatePresence mode="wait" initial={false}>
                                {done ? (
                                    <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-[28rem] flex-col items-center justify-center text-center">
                                        <motion.span
                                            initial={{ scale: 0, rotate: -30 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ type: "spring", stiffness: 220, delay: 0.1 }}
                                            className="grid size-16 place-items-center rounded-full bg-lime text-forest shadow-lg shadow-lime/40">
                                            <CalendarCheck className="h-7 w-7" />
                                        </motion.span>
                                        <h3 className="mt-6 text-2xl font-bold tracking-tight text-forest">{status === "sent" ? "Request received!" : "Almost there!"}</h3>
                                        <p className="mt-2 max-w-sm text-sage">
                                            {status === "sent"
                                                ? "Thanks — the Drova team will reach out to find a time that works for you."
                                                : `Your email app has opened with your request to ${DEMO_EMAIL}. Just hit send, and the team will reach out to schedule your demo.`}
                                        </p>
                                        <button type="button" onClick={close} className="mt-8 rounded-full bg-forest px-6 py-3 font-semibold text-white hover:bg-forest/90">
                                            Back to the site
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.form key="form" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <p className="flex items-center gap-2 text-[13px] font-semibold text-emerald">
                                            <Sparkles className="h-4 w-4" /> Free, no commitment
                                        </p>
                                        <h2 id="demo-title" className="mt-2 pr-10 text-2xl font-bold tracking-tight text-forest">
                                            Request a demo
                                        </h2>

                                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                            <Field label="Your name">
                                                <input ref={firstField} name="name" required autoComplete="name" placeholder="Adaeze Okafor" className={inputClass} />
                                            </Field>
                                            <Field label="Business name">
                                                <input name="business" required autoComplete="organization" placeholder="Swiftline Logistics" className={inputClass} />
                                            </Field>
                                            <Field label="Work email">
                                                <input name="email" type="email" required autoComplete="email" placeholder="you@company.ng" className={inputClass} />
                                            </Field>
                                            <Field label="Phone / WhatsApp">
                                                <input name="phone" type="tel" required autoComplete="tel" placeholder="0803 000 0000" pattern="[0-9+ \(\)\-]{7,}" title="At least 7 digits" className={inputClass} />
                                            </Field>
                                        </div>

                                        <Chips label="How many riders do you have?" options={FLEET_SIZES} value={fleet} onChange={setFleet} />
                                        <Chips label="Best time for a call" options={TIMES} value={time} onChange={setTime} />
                                        <Field label="Anything we should know? (optional)" className="mt-5">
                                            <textarea name="notes" rows={2} placeholder="e.g. we deliver food across Lagos and want interstate pricing" className={cn(inputClass, "resize-none")} />
                                        </Field>

                                        {status === "error" && (
                                            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                                                We couldn't send your request. Please try again, or email{" "}
                                                <a href={`mailto:${DEMO_EMAIL}`} className="font-semibold underline">
                                                    {DEMO_EMAIL}
                                                </a>
                                                .
                                            </p>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={status === "sending"}
                                            className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-forest py-3.5 font-bold text-white transition-colors hover:bg-forest/90 disabled:opacity-70">
                                            {status === "sending" ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                                                </>
                                            ) : (
                                                <>
                                                    Request my demo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                                </>
                                            )}
                                        </button>
                                        <p className="mt-3 text-center text-xs text-sage">We'll only use your details to arrange your demo.</p>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
