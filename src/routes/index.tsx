import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
    ArrowRight,
    BadgeCheck,
    Bike,
    Check,
    ChevronDown,
    Clock,
    CreditCard,
    Globe2,
    Heart,
    KeyRound,
    LayoutDashboard,
    Lock,
    MapPin,
    MessageSquareWarning,
    Package,
    Radar,
    RotateCcw,
    Scale,
    ShieldCheck,
    Smartphone,
    Star,
    Store,
    Trophy,
    UserCog,
    Wallet,
    Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import HeroGlobe from "@/components/three/HeroGlobe";
import RouteJourney from "@/components/three/RouteJourney";
import MarketplaceWaves from "@/components/three/MarketplaceWaves";
import { fadeUp, PhoneFrame, Reveal, SectionHeading, Stagger, WAITLIST_URL } from "@/components/landing/primitives";
import ProductTour from "@/components/landing/ProductTour";
import WhyPhones from "@/components/landing/WhyPhones";
import OpsBento from "@/components/landing/OpsBento";
import { BrandPattern, Logo } from "@/components/landing/Brand";
import OrderLifecycle from "@/components/landing/OrderLifecycle";
import { CustomerCompareScreen, CustomerMarketplaceScreen } from "@/components/landing/CustomerScreens";
import PriceCalculator from "@/components/landing/PriceCalculator";
import { RiderOfferScreen, RiderProfileScreen } from "@/components/landing/RiderScreens";

export const Route = createFileRoute("/")({
    component: Index,
});

// ─── Small building blocks ────────────────────────────────────────────────────

function PrimaryCta({ children = "Join the waitlist", className }: { children?: ReactNode; className?: string }) {
    return (
        <motion.a
            href={WAITLIST_URL}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
                "group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-lime px-7 py-3.5 text-base font-bold text-forest shadow-lg shadow-lime/25 transition-colors hover:bg-lime/90",
                className,
            )}>
            {children}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </motion.a>
    );
}

function FeatureItem({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "dark" }) {
    return (
        <li className="flex gap-3">
            <span className={cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full", tone === "dark" ? "bg-lime/20 text-lime" : "bg-emerald/12 text-emerald")}>
                <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            <span className={tone === "dark" ? "text-white/75" : "text-forest/80"}>{children}</span>
        </li>
    );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

const HERO_TOASTS = [
    { icon: Package, title: "New order · Lekki → Yaba", meta: "₦3,200 · paid, held in escrow", tone: "text-gold" },
    { icon: Bike, title: "Tunde accepted the job", meta: "12 seconds after dispatch", tone: "text-lime" },
    { icon: KeyRound, title: "Delivered · PIN confirmed", meta: "Payment releases after 24h", tone: "text-emerald" },
];

const HERO_PROOF = [
    { icon: ShieldCheck, label: "Escrow on every order", short: "Escrow on every order" },
    { icon: Radar, label: "Live GPS tracking", short: "Live GPS tracking" },
    { icon: Globe2, label: "36 states + FCT", short: "36 states + FCT" },
    { icon: Lock, label: "Payments by Flutterwave & Bachs", short: "Flutterwave & Bachs" },
];

function Hero() {
    return (
        <section className="relative flex min-h-screen items-center overflow-hidden bg-forest">
            <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-15 mix-blend-luminosity" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(106,189,69,0.18),transparent_55%),linear-gradient(to_bottom,transparent,#002b20)]" />
            <HeroGlobe />
            {/* Phones get the brand pattern instead of the globe */}
            <div className="lg:hidden">
                <BrandPattern className="bg-lime/[0.06]" tile={88} />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(106,189,69,0.22),transparent_60%)]" />
            </div>

            <div className="container relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-28 md:pb-24 md:pt-36">
                <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }} className="max-w-2xl">
                    <motion.h1 variants={fadeUp} className="text-[2.9rem] font-bold leading-[1.02] tracking-[-0.045em] text-white md:text-7xl">
                        The operating system for Nigeria&rsquo;s <span className="bg-gradient-to-r from-lime to-gold bg-clip-text text-transparent">delivery businesses.</span>
                    </motion.h1>
                    <motion.p variants={fadeUp} className="mt-5 max-w-xl text-base leading-relaxed text-white/65 md:mt-7 md:text-xl">
                        Drova transforms your courier company from a manual WhatsApp operation into a scalable business.<span className="hidden md:inline"> It provides an all-in-one delivery-as-a-service platform featuring a customer-facing booking storefront, automated rider dispatch, secure escrow payments, and real-time tracking.</span>
                    </motion.p>
                    <motion.div variants={fadeUp} className="mt-8 grid grid-cols-[1.25fr_1fr] gap-2.5 sm:flex sm:gap-3 md:mt-10">
                        <PrimaryCta className="px-4 text-[15px] md:px-7 md:text-base" />
                        <a
                            href="#demo"
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/20 px-4 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-white/10 md:px-7 md:text-base">
                            <span className="md:hidden">Book a demo</span>
                            <span className="hidden md:inline">Request a demo</span>
                        </a>
                    </motion.div>
                    <motion.ul variants={fadeUp} className="mt-10 grid max-w-xl grid-cols-2 gap-x-4 gap-y-3 rounded-2xl border border-white/10 bg-forest/60 p-4 text-[13px] text-white/70 backdrop-blur-md md:mt-14 md:rounded-none md:border-x-0 md:border-b-0 md:bg-transparent md:p-0 md:backdrop-blur-none md:gap-x-8 md:pt-6 md:text-sm md:text-white/55">
                        {HERO_PROOF.map(({ icon: Icon, label, short }) => (
                            <li key={label} className="flex items-center gap-2 md:gap-2.5">
                                <Icon className="h-4 w-4 shrink-0 text-lime" />
                                <span className="md:hidden">{short}</span>
                                <span className="hidden md:inline">{label}</span>
                            </li>
                        ))}
                    </motion.ul>
                </motion.div>
            </div>

            {/* Live activity toasts floating beside the globe */}
            <div className="pointer-events-none absolute bottom-28 right-[6%] z-10 hidden w-72 flex-col gap-3 xl:flex">
                {HERO_TOASTS.map((t, i) => (
                    <motion.div
                        key={t.title}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
                        transition={{
                            opacity: { delay: 2.6 + i * 0.5 },
                            x: { delay: 2.6 + i * 0.5, type: "spring" },
                            y: { delay: 3 + i, duration: 5, repeat: Infinity, ease: "easeInOut" },
                        }}
                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 p-3.5 shadow-2xl shadow-black/30 backdrop-blur-xl">
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/10">
                            <t.icon className={cn("h-4 w-4", t.tone)} />
                        </span>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">{t.title}</p>
                            <p className="truncate text-xs text-white/50">{t.meta}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.a
                href="#why"
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 text-white/35 md:block"
                aria-label="Scroll down">
                <ChevronDown className="h-6 w-6" />
            </motion.a>
        </section>
    );
}

// ─── The problem ──────────────────────────────────────────────────────────────

function Problem() {
    return (
        <section id="why" className="relative bg-white py-16 md:py-28">
            <div className="container mx-auto max-w-6xl px-6">
                <SectionHeading
                    eyebrow="Why Drova"
                    title={
                        <>
                            Delivery businesses deserve better than <span className="text-emerald">a group chat.</span>
                        </>
                    }
                    subtitle="WhatsApp, cash, and memory can run a courier business. But they can’t scale it."
                />

                <div className="mt-10 md:mt-16">
                    <WhyPhones />
                </div>
            </div>
        </section>
    );
}

// ─── Product tour ─────────────────────────────────────────────────────────────

function Product() {
    return (
        <section id="product" className="relative overflow-hidden bg-gradient-to-b from-forest via-forest to-forest-deep py-16 md:py-28">
            <MarketplaceWaves />
            <div className="container relative z-10 mx-auto max-w-7xl px-6">
                <SectionHeading
                    tone="dark"
                    eyebrow="Product tour"
                    title={
                        <>
                            See Drova <span className="text-lime">in action.</span>
                        </>
                    }
                    subtitle="This is the app that powers your business, and the platform where your customers book and track."
                />
                <div className="mt-8 md:mt-14">
                    <ProductTour />
                </div>
            </div>
        </section>
    );
}

// ─── Three sides of every delivery ────────────────────────────────────────────

const SIDES = [
    {
        icon: LayoutDashboard,
        who: "For your business",
        title: "A dashboard that runs the day",
        points: ["Create orders or take them from your storefront", "Live map of every online rider", "Wallet, withdrawals and transaction history", "Invite staff and control what they can see"],
    },
    {
        icon: Smartphone,
        who: "For your riders",
        title: "An app built for the road",
        points: ["Accept offers with one tap", "Navigation to every pickup and drop-off", "Earnings, payouts and performance in one place", "Tiers and badges that reward great work"],
        highlight: true,
    },
    {
        icon: Store,
        who: "For your customers",
        title: "Booking without the back-and-forth",
        points: ["A marketplace app to find and compare couriers", "Book from your storefront — no account needed", "See the exact price before paying", "Track the rider live, stage by stage"],
    },
];

function Sides() {
    return (
        <section id="platform" className="relative overflow-hidden bg-white py-16 md:py-28">
            <div className="container relative z-10 mx-auto max-w-7xl px-6">
                <SectionHeading
                    eyebrow="One platform"
                    title={
                        <>
                            Every side of the delivery, <span className="text-emerald">connected.</span>
                        </>
                    }
                    subtitle="Perfect synchronization, from checkout to doorstep, keeping everyone on the same page."
                />
                <Stagger className="rail mt-8 grid gap-6 md:mt-16 md:grid-cols-3">
                    {SIDES.map((s) => (
                        <motion.div
                            key={s.who}
                            variants={fadeUp}
                            whileHover={{ y: -6 }}
                            className={cn(
                                "relative flex flex-col rounded-[2rem] border p-6 backdrop-blur-sm md:p-8",
                                s.highlight ? "border-forest bg-forest text-white shadow-2xl shadow-forest/25" : "border-app-border bg-white/90 shadow-sm",
                            )}>
                            <span className={cn("grid size-12 place-items-center rounded-2xl", s.highlight ? "bg-lime text-forest" : "bg-mint text-forest")}>
                                <s.icon className="h-5 w-5" />
                            </span>
                            <p className={cn("mt-5 text-[13px] font-semibold md:mt-6", s.highlight ? "text-lime" : "text-emerald")}>{s.who}</p>
                            <h3 className={cn("mt-2 text-xl font-extrabold tracking-tight md:text-2xl", s.highlight ? "text-white" : "text-forest")}>{s.title}</h3>
                            <ul className="mt-5 space-y-3 text-sm md:mt-6 md:text-[15px]">
                                {s.points.map((p) => (
                                    <FeatureItem key={p} tone={s.highlight ? "dark" : "light"}>
                                        {p}
                                    </FeatureItem>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </Stagger>
            </div>
        </section>
    );
}

// ─── Life of an order ─────────────────────────────────────────────────────────

function HowItWorks() {
    return (
        <section id="how-it-works" className="relative overflow-hidden bg-app-bg pb-52 pt-16 md:pb-56 md:pt-28">
            <RouteJourney />
            <div className="container relative z-10 mx-auto max-w-6xl px-6">
                <SectionHeading
                    eyebrow="Life of an order"
                    title={
                        <>
                            From “book” to “delivered” — <span className="text-emerald">handled.</span>
                        </>
                    }
                    subtitle="Every order moves through eight live stages. Drova does the busywork at each one, and everyone involved sees it happen."
                />
                <div className="mt-8 md:mt-16">
                    <OrderLifecycle />
                </div>
            </div>
        </section>
    );
}

// ─── Dispatch & riders ────────────────────────────────────────────────────────

const DISPATCH = [
    { icon: Zap, title: "Timed offers", text: "Riders get an offer with a countdown. First to accept takes it; if it expires, you're alerted to assign it yourself." },
    { icon: Scale, title: "Never overloaded", text: "Each rider has an order limit and a weight limit, so a bike never gets a fridge." },
    { icon: UserCog, title: "You stay in control", text: "Assign or reassign any order by hand, whenever you need to." },
    { icon: Package, title: "Care instructions", text: "Fragile, keep upright, refrigerate — riders see exactly how to handle every package." },
];

const RIDER_PERKS = [
    { icon: Wallet, title: "Pay your way", text: "Commission or fixed pay, per order, daily, weekly or monthly." },
    { icon: BadgeCheck, title: "Verified riders", text: "NIN verification, linked bank accounts and guarantors." },
    { icon: Clock, title: "Performance you can see", text: "On-time rate, ratings and earnings on every rider's profile." },
    { icon: CreditCard, title: "Cash too", text: "Paid a rider in cash? Record it, and the rider confirms it." },
];

function Riders() {
    return (
        <section id="riders" className="relative overflow-hidden bg-white py-16 md:py-28">
            <div className="container mx-auto grid max-w-7xl items-center gap-10 px-6 md:gap-16 lg:grid-cols-2">
                <div>
                    <SectionHeading
                        align="left"
                        eyebrow="Smart dispatch"
                        title={
                            <>
                                The right rider, <span className="text-emerald">in seconds.</span>
                            </>
                        }
                        subtitle="The moment an order is paid, Drova offers it to your available riders. No calls, no group chat, no one sitting on a job."
                    />
                    <Stagger className="mt-7 grid grid-cols-2 gap-3 md:mt-10 md:gap-4">
                        {DISPATCH.map((f) => (
                            <motion.div key={f.title} variants={fadeUp} className="rounded-2xl border border-app-border bg-app-bg/60 p-4 md:p-5">
                                <f.icon className="h-5 w-5 text-emerald" />
                                <p className="mt-2.5 text-sm font-bold leading-snug text-forest md:mt-3 md:text-base">{f.title}</p>
                                <p className="mt-1 hidden text-sm leading-relaxed text-sage md:block">{f.text}</p>
                            </motion.div>
                        ))}
                    </Stagger>
                </div>

                <Reveal className="relative flex justify-center lg:justify-end" delay={0.1}>
                    <div className="absolute inset-0 m-auto size-[26rem] rounded-full bg-gradient-to-br from-lime/35 to-emerald/10 blur-3xl" />
                    <motion.div initial={{ rotate: -6, y: 30 }} whileInView={{ rotate: -6, y: 0 }} viewport={{ once: true }} className="relative z-10">
                        <PhoneFrame>
                            <RiderOfferScreen />
                        </PhoneFrame>
                    </motion.div>
                    <motion.div initial={{ rotate: 5, y: 60 }} whileInView={{ rotate: 5, y: 40 }} viewport={{ once: true }} className="relative -ml-6 hidden sm:block">
                        <PhoneFrame>
                            <RiderProfileScreen />
                        </PhoneFrame>
                    </motion.div>
                </Reveal>
            </div>

            {/* Rider motivation strip */}
            <div className="container mx-auto mt-12 max-w-7xl px-6 md:mt-28">
                <Reveal className="grid gap-6 overflow-hidden rounded-[2rem] bg-forest p-6 text-white md:grid-cols-[1.2fr_2fr] md:gap-8 md:p-12">
                    <div>
                        <Trophy className="h-8 w-8 text-gold" />
                        <h3 className="mt-3 text-2xl font-bold tracking-tight md:mt-4 md:text-3xl">Riders who want to ride for you.</h3>
                        <p className="mt-3 hidden text-white/65 md:block">
                            Riders climb from Bronze to Platinum and earn 35+ badges for speed, ratings, streaks and specialist work. Good riders stay — and it shows in your reviews.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5 md:gap-3">
                        {RIDER_PERKS.map((f) => (
                            <div key={f.title} className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5">
                                <f.icon className="h-5 w-5 text-lime" />
                                <p className="mt-2.5 text-sm font-bold leading-snug md:mt-3 md:text-base">{f.title}</p>
                                <p className="mt-1 hidden text-sm text-white/60 md:block">{f.text}</p>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

// ─── Pricing engine ───────────────────────────────────────────────────────────

function PricingEngine() {
    return (
        <section id="pricing-engine" className="relative overflow-hidden bg-app-bg py-16 md:py-28">
            <div className="container mx-auto grid max-w-7xl items-center gap-8 px-6 md:gap-14 lg:grid-cols-[1fr_1.35fr]">
                <div>
                    <SectionHeading
                        align="left"
                        eyebrow="Your prices, your rules"
                        title={
                            <>
                                Set your prices once. <span className="text-emerald">Every order is quoted for you.</span>
                            </>
                        }
                        subtitle="No more working out fares in your head. Customers see an exact price before they pay — calculated from the rules you set."
                    />
                    <ul className="mt-10 hidden space-y-4 text-[15px] md:block">
                        <FeatureItem>
                            <b className="text-forest">Distance tiers</b> for deliveries within your city
                        </FeatureItem>
                        <FeatureItem>
                            <b className="text-forest">A flat price per state</b> — switch on any of the 36 states and the FCT
                        </FeatureItem>
                        <FeatureItem>
                            <b className="text-forest">Weight surcharges</b>, including volumetric weight for bulky items
                        </FeatureItem>
                        <FeatureItem>
                            <b className="text-forest">Express or scheduled</b> delivery, standard or bulk service
                        </FeatureItem>
                    </ul>
                </div>
                <Reveal delay={0.1}>
                    <PriceCalculator />
                </Reveal>
            </div>
        </section>
    );
}

// ─── Escrow & payouts ─────────────────────────────────────────────────────────

const ESCROW_STEPS = [
    { icon: CreditCard, title: "Customer pays online", text: "By card, bank transfer or payment link." },
    { icon: Lock, title: "Held in escrow", text: "The money is locked with Drova — safe for both sides." },
    { icon: KeyRound, title: "PIN at the door", text: "The rider enters the customer's 6-digit PIN on delivery." },
    { icon: Wallet, title: "Released to you", text: "After a 24-hour dispute window, it lands in your wallet." },
];

const MONEY_CARDS = [
    {
        icon: Scale,
        title: "You keep 100% of your fee",
        text: "Drova's 2.5% fee and 2% payment processing are added at checkout, each capped at ₦2,000 — and shown to the customer upfront.",
    },
    {
        icon: Wallet,
        title: "A wallet that pays everyone",
        text: "Withdraw to your bank whenever you like, and pay riders from the same wallet. Every withdrawal needs your PIN.",
    },
    {
        icon: MessageSquareWarning,
        title: "Disputes with a paper trail",
        text: "If something goes wrong, the customer opens a ticket — even as a guest — and you resolve it in a threaded conversation.",
    },
];

function Payments() {
    return (
        <section id="payments" className="relative overflow-hidden bg-forest py-16 md:py-28 text-white">
            <BrandPattern className="bg-lime/[0.035]" tile={120} />
            <div className="absolute left-1/2 top-0 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-emerald/10 blur-[140px]" />
            <div className="container relative z-10 mx-auto max-w-7xl px-6">
                <SectionHeading
                    tone="dark"
                    eyebrow="Escrow payments"
                    title={
                        <>
                            Get paid for every delivery. <span className="text-lime">No arguments.</span>
                        </>
                    }
                    subtitle="Customers pay before the rider moves, and you're paid once the package is in their hands. No cash to chase, no “I've sent it” screenshots."
                />

                <Stagger className="relative mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:mt-16 md:grid-cols-4 md:gap-5">
                    <div className="absolute left-[12%] right-[12%] top-10 hidden h-px bg-gradient-to-r from-lime/0 via-lime/50 to-lime/0 md:block" />
                    {ESCROW_STEPS.map((s, i) => (
                        <motion.div key={s.title} variants={fadeUp} className="relative text-center">
                            <motion.span
                                className="relative z-10 mx-auto grid size-14 place-items-center rounded-2xl border md:size-20 md:rounded-3xl border-lime/25 bg-forest shadow-xl shadow-black/40"
                                animate={{ boxShadow: ["0 0 0 0 rgba(106,189,69,0)", "0 0 0 10px rgba(106,189,69,0.12)", "0 0 0 0 rgba(106,189,69,0)"] }}
                                transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.6 }}>
                                <s.icon className="h-6 w-6 text-lime md:h-7 md:w-7" />
                            </motion.span>
                            <p className="mt-3 text-xs font-semibold text-white/40 md:mt-5 md:text-[13px]">Step {i + 1}</p>
                            <p className="mt-1 text-[15px] font-bold leading-snug md:text-lg">{s.title}</p>
                            <p className="mx-auto mt-1 max-w-[15rem] text-xs text-white/55 md:text-sm">{s.text}</p>
                        </motion.div>
                    ))}
                </Stagger>

                <Stagger className="rail mt-10 grid gap-5 md:mt-20 md:grid-cols-3">
                    {MONEY_CARDS.map((c) => (
                        <motion.div key={c.title} variants={fadeUp} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur md:p-7">
                            <c.icon className="h-6 w-6 text-gold" />
                            <p className="mt-4 text-lg font-bold">{c.title}</p>
                            <p className="mt-2 text-sm leading-relaxed text-white/60">{c.text}</p>
                        </motion.div>
                    ))}
                </Stagger>
            </div>
        </section>
    );
}

// ─── Operations & control ─────────────────────────────────────────────────────


function Controls() {
    return (
        <section className="bg-white py-16 md:py-28">
            <div className="container mx-auto max-w-7xl px-6">
                <SectionHeading
                    eyebrow="Built for serious operations"
                    title={
                        <>
                            Everything you need <span className="text-emerald">to scale.</span>
                        </>
                    }
                    subtitle="Drova grows with you — from a founder dispatching three riders to an operations team running a fleet."
                />
                <div className="mt-8 md:mt-16">
                    <OpsBento />
                </div>
            </div>
        </section>
    );
}

// ─── Customer app & marketplace ───────────────────────────────────────────────

const CUSTOMER_FEATURES = [
    { icon: Store, title: "Couriers nearby", text: "Browse verified delivery businesses around you, filtered by vehicle, service and who's open now." },
    { icon: Scale, title: "Compare prices", text: "Enter a route once and see every courier that can take it — price, rating and timing side by side." },
    { icon: ShieldCheck, title: "Pay with confidence", text: "Card, transfer or payment link, held in escrow until the customer hands over their delivery PIN." },
    { icon: Heart, title: "Favourites", text: "Customers save the businesses they love and come straight back to them." },
];

const CUSTOMER_PERKS = [
    { icon: Radar, title: "Live tracking", text: "Every stage of the delivery, with the rider on a map." },
    { icon: RotateCcw, title: "Book again in a tap", text: "Past deliveries are one tap away from repeating." },
    { icon: MapPin, title: "Saved addresses", text: "Home, office and a default address, ready at checkout." },
    { icon: Star, title: "Rate or report", text: "Leave a review, or open a dispute ticket if something goes wrong." },
];

function Customers() {
    return (
        <section id="customers" className="relative overflow-hidden bg-gradient-to-b from-white to-app-bg py-16 md:py-28">
            <div id="marketplace" className="container mx-auto grid max-w-7xl items-center gap-10 px-6 md:gap-16 lg:grid-cols-2">
                <Reveal className="relative order-2 flex justify-center lg:order-1 lg:justify-start" delay={0.1}>
                    <div className="absolute inset-0 m-auto size-[26rem] rounded-full bg-gradient-to-br from-gold/30 via-lime/30 to-emerald/10 blur-3xl" />
                    <motion.div initial={{ rotate: -6, y: 30 }} whileInView={{ rotate: -6, y: 0 }} viewport={{ once: true }} className="relative z-10">
                        <PhoneFrame>
                            <CustomerMarketplaceScreen />
                        </PhoneFrame>
                    </motion.div>
                    <motion.div initial={{ rotate: 5, y: 60 }} whileInView={{ rotate: 5, y: 40 }} viewport={{ once: true }} className="relative -ml-3 hidden sm:block">
                        <PhoneFrame>
                            <CustomerCompareScreen />
                        </PhoneFrame>
                    </motion.div>
                </Reveal>

                <div className="order-1 lg:order-2">
                    <SectionHeading
                        align="left"
                        eyebrow="The Drova app for customers"
                        title={
                            <>
                                Every courier in town, <span className="text-emerald">in one app.</span>
                            </>
                        }
                        subtitle="Customers find your business on the Drova Marketplace, compare prices side by side, and book, pay and track — without a single phone call."
                    />
                    <Stagger className="mt-7 grid grid-cols-2 gap-3 md:mt-10 md:gap-4">
                        {CUSTOMER_FEATURES.map((f) => (
                            <motion.div key={f.title} variants={fadeUp} className="rounded-2xl border border-app-border bg-white/80 p-4 md:p-5">
                                <f.icon className="h-5 w-5 text-emerald" />
                                <p className="mt-2.5 text-sm font-bold leading-snug text-forest md:mt-3 md:text-base">{f.title}</p>
                                <p className="mt-1 hidden text-sm leading-relaxed text-sage md:block">{f.text}</p>
                            </motion.div>
                        ))}
                    </Stagger>
                </div>
            </div>

            {/* Customer loyalty strip */}
            <div className="container mx-auto mt-12 max-w-7xl px-6 md:mt-28">
                <Reveal className="grid gap-6 overflow-hidden rounded-[2rem] bg-forest p-6 text-white md:grid-cols-[1.2fr_2fr] md:gap-8 md:p-12">
                    <div>
                        <Heart className="h-8 w-8 fill-gold/20 text-gold" />
                        <h3 className="mt-3 text-2xl font-bold tracking-tight md:mt-4 md:text-3xl">Customers who keep coming back.</h3>
                        <p className="mt-3 hidden text-white/65 md:block">
                            Every delivery is easy to follow and easy to repeat — so customers who find you on the Marketplace stay with you.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5 md:gap-3">
                        {CUSTOMER_PERKS.map((f) => (
                            <div key={f.title} className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5">
                                <f.icon className="h-5 w-5 text-lime" />
                                <p className="mt-2.5 text-sm font-bold leading-snug md:mt-3 md:text-base">{f.title}</p>
                                <p className="mt-1 hidden text-sm text-white/60 md:block">{f.text}</p>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

// ─── Plans ────────────────────────────────────────────────────────────────────

const PLANS = [
    {
        name: "Starter",
        price: "Free",
        period: "forever",
        description: "Perfect for getting started",
        features: ["Up to 5 riders", "100 orders / month", "Storefront & live tracking", "Escrow payments", "Basic analytics", "Weekly payouts", "Email support"],
        cta: "Start for free",
    },
    {
        name: "Professional",
        price: "₦25,000",
        period: "per month",
        description: "For growing courier companies",
        highlight: true,
        features: ["Up to 25 riders", "2,000 orders / month", "Everything in Starter", "Custom domain for your storefront", "Advanced analytics", "Daily payouts", "Priority support", "WhatsApp integration"],
        cta: "Join the waitlist",
    },
    {
        name: "Enterprise",
        price: "₦50,000",
        period: "per month",
        description: "For established fleets",
        features: ["Unlimited riders", "Unlimited orders", "Everything in Professional", "Full analytics & data export", "Real-time payouts", "Dedicated account manager", "API access"],
        cta: "Request a demo",
        href: "#demo",
    },
];

function Plans() {
    return (
        <section id="pricing" className="relative overflow-hidden bg-app-bg py-16 md:py-28">
            <div className="container relative z-10 mx-auto max-w-6xl px-6">
                <SectionHeading
                    eyebrow="Pricing"
                    title={
                        <>
                            Start free. <span className="text-emerald">Scale as you grow.</span>
                        </>
                    }
                    subtitle="No setup costs and no hidden fees. On every plan, you keep 100% of your delivery fees."
                />
                <Stagger className="rail mt-8 grid items-stretch gap-6 md:mt-16 md:grid-cols-3">
                    {PLANS.map((p) => (
                        <motion.div
                            key={p.name}
                            variants={fadeUp}
                            whileHover={{ y: -6 }}
                            className={cn(
                                "relative flex flex-col rounded-[2rem] border p-7 md:p-8",
                                p.highlight && "order-first md:order-none",
                                p.highlight ? "border-forest bg-forest text-white shadow-2xl shadow-forest/30 md:-my-4 md:py-12" : "border-app-border bg-white shadow-sm",
                            )}>
                            {p.highlight && <span className="absolute -top-3 left-8 rounded-full bg-lime px-3 py-1 text-xs font-bold text-forest">Most popular</span>}
                            <p className={cn("text-lg font-bold", p.highlight ? "text-white" : "text-forest")}>{p.name}</p>
                            <p className={cn("text-sm", p.highlight ? "text-white/60" : "text-sage")}>{p.description}</p>
                            <p className="mt-6">
                                <span className={cn("text-4xl font-bold tracking-tight md:text-5xl", p.highlight ? "text-white" : "text-forest")}>{p.price}</span>
                                <span className={cn("ml-2 text-sm", p.highlight ? "text-white/60" : "text-sage")}>{p.period}</span>
                            </p>
                            <ul className="mt-6 flex-1 space-y-3 text-sm md:mt-8">
                                {p.features.map((f) => (
                                    <FeatureItem key={f} tone={p.highlight ? "dark" : "light"}>
                                        {f}
                                    </FeatureItem>
                                ))}
                            </ul>
                            <a
                                href={p.href ?? WAITLIST_URL}
                                {...(p.href ? {} : { target: "_blank", rel: "noreferrer" })}
                                className={cn(
                                    "mt-10 rounded-full py-3 text-center font-bold transition-colors",
                                    p.highlight ? "bg-lime text-forest hover:bg-lime/90" : "border border-forest/20 text-forest hover:bg-mint",
                                )}>
                                {p.cta}
                            </a>
                        </motion.div>
                    ))}
                </Stagger>
            </div>
        </section>
    );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const FAQS = [
    {
        q: "How does escrow protect my business?",
        a: "The customer pays online before the rider sets off, and Drova holds the money. When the rider arrives, the customer gives them a 6-digit delivery PIN, and the rider enters it to complete the order. After a 24-hour window for disputes, the payment is released to your wallet automatically.",
    },
    {
        q: "Who pays Drova's fees?",
        a: "The customer. A 2.5% Drova fee and 2% payment processing are added to the delivery price at checkout — each capped at ₦2,000 — and shown before they pay. You receive 100% of the delivery fee you set.",
    },
    {
        q: "Do my customers need to download an app or create an account?",
        a: "No. Customers can book from your storefront as guests, pay by card, bank transfer or payment link, follow the delivery on a tracking link, and even raise a dispute using a ticket number.",
    },
    {
        q: "What happens if no rider accepts an order?",
        a: "Drova offers each paid order to available riders with a countdown. If the offer window expires without a taker, you're notified straight away so you can assign it to someone manually.",
    },
    {
        q: "How do I pay my riders?",
        a: "Choose commission or fixed pay for each rider, and pay them per order, daily, weekly or monthly — straight from your Drova wallet. If you pay a rider in cash, you can record it and the rider confirms receipt.",
    },
    {
        q: "Can I deliver outside my state?",
        a: "Yes. Set a flat price for each state you deliver to — any of the 36 states and the FCT — alongside distance-based pricing within your city.",
    },
    {
        q: "Can my staff use Drova without full access?",
        a: "Yes. Invite staff and give them roles with only the permissions they need — orders, riders, transactions, disputes, staff, roles or business settings.",
    },
];

function Faq() {
    const [open, setOpen] = useState<number | null>(0);
    return (
        <section id="faq" className="bg-white py-16 md:py-28">
            <div className="container mx-auto grid max-w-6xl gap-8 px-6 md:gap-14 lg:grid-cols-[1fr_1.6fr]">
                <SectionHeading
                    align="left"
                    eyebrow="FAQ"
                    title="Questions, answered."
                    subtitle={
                        <>
                            Something else on your mind?{" "}
                            <a href="mailto:product@drova.ng" className="font-semibold text-emerald underline-offset-4 hover:underline">
                                Email the team
                            </a>
                            .
                        </>
                    }
                />
                <Reveal className="divide-y divide-app-border overflow-hidden rounded-[2rem] border border-app-border bg-app-bg/50">
                    {FAQS.map((f, i) => (
                        <div key={f.q}>
                            <button
                                type="button"
                                onClick={() => setOpen(open === i ? null : i)}
                                aria-expanded={open === i}
                                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-semibold text-forest hover:bg-mint/30 md:gap-6 md:px-7 md:py-5 md:text-base">
                                {f.q}
                                <ChevronDown className={cn("h-5 w-5 shrink-0 text-emerald transition-transform duration-300", open === i && "rotate-180")} />
                            </button>
                            <AnimatePresence initial={false}>
                                {open === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden">
                                        <p className="px-5 pb-5 text-[15px] leading-relaxed text-sage md:px-7 md:pb-6 md:text-base">{f.a}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </Reveal>
            </div>
        </section>
    );
}

// ─── Final CTA & footer ───────────────────────────────────────────────────────

function FinalCta() {
    return (
        <section className="relative overflow-hidden bg-lime py-20 md:py-36">
            {/* The brand pattern, drifting slowly behind the call to action */}
            <BrandPattern className="bg-forest/[0.09]" tile={104} />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_50%,#6abd45_30%,transparent)]" />
            <div className="container relative z-10 mx-auto max-w-3xl px-6 text-center">
                <Reveal>
                    <span className="inline-flex items-center gap-2 rounded-full bg-forest/10 px-4 py-1.5 text-[13px] font-semibold text-forest">
                        <span className="size-1.5 animate-pulse rounded-full bg-forest" /> Now accepting early access
                    </span>
                    <h2 className="mt-7 text-5xl font-bold leading-[1.02] tracking-[-0.04em] text-forest md:text-7xl">Your fleet, on autopilot.</h2>
                    <p className="mx-auto mt-6 max-w-xl text-lg font-medium text-forest/75">
                        Join the waitlist for early access, priority onboarding and locked-in founding pricing.
                    </p>
                    <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <PrimaryCta className="bg-forest text-white shadow-xl shadow-forest/25 hover:bg-forest/90" />
                        <a href="#demo" className="inline-flex items-center justify-center rounded-full border-2 border-forest/25 px-7 py-3 font-bold text-forest transition-colors hover:border-forest hover:bg-forest/5">
                            Request a demo
                        </a>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

const FOOTER_LINKS: [string, [string, string][]][] = [
    ["Product", [["Tour", "#product"], ["How it works", "#how-it-works"], ["Payments", "#payments"], ["Pricing", "#pricing"]]],
    ["For", [["Businesses", "#platform"], ["Customers", "#customers"], ["Riders", "#riders"]]],
    ["Company", [["FAQ", "#faq"], ["Request a demo", "#demo"], ["Contact", "mailto:product@drova.ng"], ["Join the waitlist", WAITLIST_URL]]],
];

function Footer() {
    return (
        <footer className="bg-forest py-12 text-white md:py-14">
            <div className="container mx-auto max-w-7xl px-6">
                <div className="flex flex-col justify-between gap-10 md:flex-row">
                    <div className="max-w-xs">
                        <Logo className="bg-lime" height={34} />
                        <p className="mt-4 text-sm text-white/45">The operating system for delivery businesses in Africa.</p>
                    </div>
                    <div className="grid grid-cols-3 gap-6 text-sm md:gap-10">
                        {FOOTER_LINKS.map(([title, links]) => (
                            <div key={title}>
                                <p className="font-semibold text-white">{title}</p>
                                <ul className="mt-4 space-y-2.5 text-white/50">
                                    {links.map(([label, href]) => (
                                        <li key={label}>
                                            <a href={href} className="transition-colors hover:text-lime">
                                                {label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 md:mt-14 text-xs text-white/35 sm:flex-row">
                    <p>© 2026 Drova. All rights reserved.</p>
                    <p className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" /> Built in Nigeria, for Africa
                    </p>
                </div>
            </div>
        </footer>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Index() {
    return (
        <main className="flex flex-col overflow-x-clip">
            <Hero />
            <Problem />
            <Product />
            <Sides />
            <Customers />
            <HowItWorks />
            <Riders />
            <PricingEngine />
            <Payments />
            <Controls />
            <Plans />
            <Faq />
            <FinalCta />
            <Footer />
        </main>
    );
}
