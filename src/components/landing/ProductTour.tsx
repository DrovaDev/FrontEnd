import { useEffect, useRef, useState, type ComponentType } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LayoutDashboard, ListOrdered, MapPin, SlidersHorizontal, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrowserFrame, Reveal } from "./primitives";
import { DashboardScreen, OrdersScreen, PricingScreen, SCREEN_HEIGHT, SCREEN_WIDTH, StorefrontScreen, TrackingScreen } from "./AppScreens";

// The browser-bar URLs are illustrative; update APP_HOST if the business app lives elsewhere.
const APP_HOST = "usedrova.app";

const TABS: { id: string; icon: typeof Store; label: string; url: string; title: string; text: string; Screen: ComponentType }[] = [
    {
        id: "overview",
        icon: LayoutDashboard,
        label: "Dashboard",
        url: `${APP_HOST}/dashboard`,
        title: "Your whole operation on one screen",
        text: "Your entire operation, visible in one click.",
        Screen: DashboardScreen,
    },
    {
        id: "orders",
        icon: ListOrdered,
        label: "Orders",
        url: `${APP_HOST}/dashboard/orders`,
        title: "Every order, from booking to doorstep",
        text: "Take complete control of your fleet with smart routing updates.",
        Screen: OrdersScreen,
    },
    {
        id: "pricing",
        icon: SlidersHorizontal,
        label: "Pricing",
        url: `${APP_HOST}/dashboard/settings/delivery-pricing`,
        title: "Your prices, quoted automatically",
        text: "Distance tiers in your city, a flat rate per state, and surcharges for heavy packages.",
        Screen: PricingScreen,
    },
    {
        id: "storefront",
        icon: Store,
        label: "Storefront",
        url: `${APP_HOST}/store/swiftline-logistics`,
        title: "A storefront customers can book from",
        text: "Your brand, hours, vehicles and reviews on one link. Customers book and pay without an account.",
        Screen: StorefrontScreen,
    },
    {
        id: "tracking",
        icon: MapPin,
        label: "Live tracking",
        url: `${APP_HOST}/track`,
        title: "Tracking your customers will love",
        text: "Eight live stages, the rider on a map, and a delivery PIN that releases payment at the door.",
        Screen: TrackingScreen,
    },
];

const ROTATE_MS = 7000;

/** Renders a fixed-size screen scaled down to the container's width. */
function ScaledScreen({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / SCREEN_WIDTH));
        ro.observe(el);
        return () => ro.disconnect();
    }, []);
    return (
        <div ref={ref} className="relative w-full overflow-hidden" style={{ height: SCREEN_HEIGHT * scale }}>
            <div className="absolute left-0 top-0 origin-top-left" style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, transform: `scale(${scale})` }}>
                {children}
            </div>
        </div>
    );
}

export default function ProductTour() {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const tab = TABS[index];

    useEffect(() => {
        if (paused) return;
        const id = setTimeout(() => setIndex((i) => (i + 1) % TABS.length), ROTATE_MS);
        return () => clearTimeout(id);
    }, [index, paused]);

    return (
        <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            <Reveal className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 md:mx-auto md:max-w-4xl md:flex-wrap md:justify-center md:overflow-visible md:px-0" delay={0.1}>
                {TABS.map((t, i) => (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => setIndex(i)}
                        className={cn(
                            "relative flex shrink-0 items-center gap-2 overflow-hidden rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                            i === index ? "border-white/25 bg-white text-forest" : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
                        )}>
                        <t.icon className="h-4 w-4" />
                        {t.label}
                        {i === index && !paused && (
                            <motion.span
                                key={`progress-${index}`}
                                className="absolute bottom-0 left-0 h-0.5 bg-emerald"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: ROTATE_MS / 1000, ease: "linear" }}
                            />
                        )}
                    </button>
                ))}
            </Reveal>

            <div className="relative z-10 mx-auto mt-6 max-w-2xl rounded-2xl border border-white/10 bg-forest/80 px-5 py-4 shadow-xl shadow-black/20 backdrop-blur-md md:mt-8 md:px-8 md:py-5 md:text-center">
                <AnimatePresence mode="wait">
                    <motion.div key={tab.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                        <h3 className="text-lg font-bold text-white md:text-2xl">{tab.title}</h3>
                        <p className="mt-1.5 max-w-xl text-[15px] text-white/85 md:mx-auto md:mt-2 md:text-base">{tab.text}</p>
                    </motion.div>
                </AnimatePresence>
            </div>

            <Reveal className="relative mx-auto mt-6 max-w-6xl md:mt-10" delay={0.15}>
                <div className="absolute -inset-x-10 -inset-y-8 rounded-[3rem] bg-gradient-to-b from-lime/25 via-emerald/10 to-transparent blur-3xl" />
                <motion.div style={{ perspective: 1800 }} className="relative">
                    <BrowserFrame url={tab.url}>
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={tab.id}
                                initial={{ opacity: 0, scale: 0.985 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.01 }}
                                transition={{ duration: 0.35 }}>
                                <ScaledScreen>
                                    <tab.Screen />
                                </ScaledScreen>
                            </motion.div>
                        </AnimatePresence>
                    </BrowserFrame>
                </motion.div>
            </Reveal>
        </div>
    );
}
