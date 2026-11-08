import { useEffect, useRef, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, Loader2, MessageSquare, PackageSearch, Search, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchTracking, FINAL, normalizeCode, TrackingError, type TrackedOrder } from "@/lib/tracking";
import { TrackResult } from "@/components/tracking/TrackResult";

type TrackSearch = { code?: string; store?: string };

// Same URL shape as the business web app's /track page (?code=…&store=…), so a tracking
// link works on either site.
export const Route = createFileRoute("/track")({
    validateSearch: (search: Record<string, unknown>): TrackSearch => ({
        code: typeof search.code === "string" && search.code.trim() ? normalizeCode(search.code) : undefined,
        store: typeof search.store === "string" && search.store.trim() ? search.store.trim() : undefined,
    }),
    component: TrackPage,
});

const POLL_MS = 30_000;

/** Loads the order, then refreshes every 30s until it is delivered or cancelled. */
function useTrackedOrder(code: string | undefined, store: string | undefined) {
    const [order, setOrder] = useState<TrackedOrder | null>(null);
    const [error, setError] = useState<TrackingError | null>(null);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const finished = useRef(false);

    useEffect(() => {
        setOrder(null);
        setError(null);
        finished.current = false;
        if (!code) return;

        const controller = new AbortController();
        const load = async (initial: boolean) => {
            if (initial) setLoading(true);
            else setRefreshing(true);
            try {
                const next = await fetchTracking(code, store, controller.signal);
                setOrder(next);
                setError(null);
                finished.current = FINAL.includes(next.status);
            } catch (e) {
                if ((e as Error).name === "AbortError") return;
                // A failed background refresh keeps the last good result on screen.
                if (initial) setError(e instanceof TrackingError ? e : new TrackingError("unavailable", "Tracking is unavailable right now."));
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                    setRefreshing(false);
                }
            }
        };

        load(true);
        const timer = setInterval(() => {
            if (!finished.current && document.visibilityState === "visible") load(false);
        }, POLL_MS);
        return () => {
            controller.abort();
            clearInterval(timer);
        };
    }, [code, store]);

    return { order, error, loading, refreshing };
}

function TrackPage() {
    const { code: submitted, store } = Route.useSearch();
    const navigate = useNavigate({ from: "/track" });
    const [code, setCode] = useState(submitted ?? "");
    const { order, error, loading, refreshing } = useTrackedOrder(submitted, store);

    // Keep the input in step with back/forward navigation.
    useEffect(() => setCode(submitted ?? ""), [submitted]);

    useEffect(() => {
        document.title = submitted ? `Tracking ${submitted} | Drova` : "Track your delivery | Drova";
    }, [submitted]);

    const search = (e: FormEvent) => {
        e.preventDefault();
        const next = normalizeCode(code);
        if (!next) return;
        // A shareable URL for exactly this delivery.
        navigate({ search: (prev) => ({ ...prev, code: next }), replace: !!submitted });
    };

    const shareUrl = typeof window === "undefined" ? "" : window.location.href;
    const busy = loading && normalizeCode(code) === submitted;

    return (
        <div className="flex min-h-screen flex-col bg-app-bg">
            {/* Hero with search. Top padding clears the fixed site header. */}
            <header className="relative overflow-hidden bg-forest text-white">
                <div aria-hidden className="absolute -right-24 -top-24 size-96 rounded-full bg-lime/20 blur-3xl" />
                <div aria-hidden className="absolute -bottom-32 -left-20 size-80 rounded-full bg-emerald/30 blur-3xl" />
                <div
                    aria-hidden
                    className="absolute inset-0 opacity-[0.07]"
                    style={{ backgroundImage: "radial-gradient(rgb(255 255 255) 1px, transparent 1px)", backgroundSize: "22px 22px" }}
                />
                <div className={cn("relative mx-auto max-w-4xl px-5 pt-28 sm:px-8", submitted ? "pb-24" : "pb-28 sm:pb-36 sm:pt-36")}>
                    <div className="text-center">
                        {!submitted && (
                            <>
                                <span className="mx-auto grid size-16 place-items-center rounded-3xl bg-white/10 backdrop-blur">
                                    <PackageSearch size={30} />
                                </span>
                                <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">Where&apos;s my delivery?</h1>
                                <p className="mx-auto mt-3 max-w-md text-white/75">
                                    Enter the tracking code from your order confirmation to see where your package is right now.
                                </p>
                            </>
                        )}
                        <form onSubmit={search} className={cn("mx-auto flex max-w-xl items-center gap-2 rounded-2xl bg-white p-2 shadow-2xl", !submitted && "mt-8")}>
                            <Search size={18} className="ml-2 shrink-0 text-sage" />
                            <input
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                placeholder="e.g. DRV-ORD4570363"
                                aria-label="Tracking code"
                                autoFocus={!submitted}
                                autoComplete="off"
                                spellCheck={false}
                                className="h-11 min-w-0 flex-1 bg-transparent font-mono text-base tracking-wide text-forest outline-none placeholder:text-sage/60"
                            />
                            <button
                                type="submit"
                                disabled={!code.trim() || busy}
                                className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl bg-forest px-5 font-semibold text-white transition-colors hover:bg-forest/90 disabled:opacity-50">
                                {busy ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                                <span className="hidden sm:inline">Track</span>
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="relative mx-auto -mt-16 w-full max-w-4xl flex-1 px-5 sm:px-8">
                {!submitted ? (
                    <HowItWorks />
                ) : loading && !order ? (
                    <div className="space-y-4" aria-busy="true" aria-label="Loading delivery">
                        <div className="h-64 animate-pulse rounded-3xl bg-white shadow-xl shadow-forest/5" />
                        <div className="grid gap-4 lg:grid-cols-5">
                            <div className="h-80 animate-pulse rounded-2xl bg-white/70 lg:col-span-3" />
                            <div className="h-80 animate-pulse rounded-2xl bg-white/70 lg:col-span-2" />
                        </div>
                    </div>
                ) : error || !order ? (
                    <div className="rounded-3xl border border-app-border bg-white p-10 text-center shadow-xl shadow-forest/5">
                        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-app-bg text-sage">
                            <AlertTriangle size={24} />
                        </span>
                        <h2 className="mt-4 text-lg font-bold text-forest">{error?.kind === "unavailable" ? "Tracking is unavailable" : "We couldn't find that delivery"}</h2>
                        <p className="mx-auto mt-1 max-w-sm text-sm text-sage">
                            {error?.kind === "unavailable" ? (
                                error.message
                            ) : (
                                <>
                                    No delivery matches <span className="font-mono font-semibold text-forest">{submitted}</span>. Check the code in your confirmation message and try again.
                                </>
                            )}
                        </p>
                    </div>
                ) : (
                    <TrackResult ord={order} shareUrl={shareUrl} refreshing={refreshing} />
                )}
            </main>

            <footer className="py-8 text-center text-xs text-sage">
                Tracking powered by{" "}
                <Link to="/" className="font-semibold text-forest hover:underline">
                    Drova
                </Link>
            </footer>
        </div>
    );
}

function HowItWorks() {
    const steps = [
        { icon: MessageSquare, title: "Find your code", text: "It's in the SMS, WhatsApp or email you got when the order was placed." },
        { icon: Search, title: "Enter it above", text: "Codes look like DRV-ORD1234567." },
        { icon: Truck, title: "Follow it live", text: "This page updates on its own as your rider moves." },
    ];
    return (
        <div className="grid gap-4 rounded-3xl border border-app-border bg-white p-6 shadow-xl shadow-forest/5 sm:grid-cols-3 sm:p-8">
            {steps.map((s, i) => (
                <div key={s.title} className="flex gap-3 sm:flex-col">
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-forest/10 text-forest">
                        <s.icon size={20} />
                    </span>
                    <div>
                        <p className="text-sm font-semibold text-forest">
                            <span className="mr-1 text-sage">{i + 1}.</span>
                            {s.title}
                        </p>
                        <p className="mt-0.5 text-sm text-sage">{s.text}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
