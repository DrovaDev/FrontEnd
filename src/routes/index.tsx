import { createFileRoute } from "@tanstack/react-router";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    LayoutDashboard,
    Store,
    Shield,
    Smartphone,
    MapPin,
    CheckCircle,
    ArrowRight,
    Zap,
    Users,
    Package,
    Clock,
    Star,
    ChevronRight,
    Bike,
    Building2,
    X,
    Check,
} from "lucide-react";

export const Route = createFileRoute("/")({
    component: Index,
});

const WAITLIST_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfY2JH5IuPygrrjdgvSR8Wwu6Bh9aPIsOuVdl-BsY6fR6jFBw/viewform?usp=dialog";

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeInUp = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeIn" } },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.93 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

// ─── Shared animated wrapper ──────────────────────────────────────────────────

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });
    return (
        <motion.div ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={fadeInUp} className={className}>
            {children}
        </motion.div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Index() {
    return (
        <main className="flex flex-col overflow-hidden">
            {/* ── HERO ─────────────────────────────────────────────────────── */}
            <section className="min-h-screen bg-[url('/hero-bg.jpg')] bg-cover bg-center flex items-center relative">
                <div className="absolute inset-0 bg-linear-to-br from-primary/92 via-primary/82 to-black/90" />

                <div className="relative z-10 container mx-auto px-6 py-36 max-w-7xl">
                    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl">
                        {/* Label */}
                        <motion.div variants={fadeInUp}>
                            <Badge className="mb-6 gap-2 bg-accent/15 text-accent border-accent/35 backdrop-blur-sm">
                                <Zap className="h-3 w-3" />
                                Africa's first Delivery-as-a-Service Platform
                            </Badge>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            variants={fadeInUp}
                            className="text-5xl md:text-[4.25rem] font-black text-white tracking-tight leading-[1.05] mb-6">
                            Run Your Delivery <span className="text-accent">Business Like a Pro</span>
                        </motion.h1>

                        {/* Sub */}
                        <motion.p variants={fadeInUp} className="text-xl text-white/70 leading-relaxed max-w-2xl mb-10">
                            Drova gives your courier company a branded storefront, smart dashboard, P2P-secured payments, and real-time rider tracking
                            — with zero technical setup required.
                        </motion.p>

                        {/* CTAs */}
                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                                <a
                                    href={WAITLIST_URL}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`${buttonVariants({ size: "lg" })} gap-2 text-base px-8 bg-accent! text-primary! border-0! hover:opacity-90! font-semibold`}>
                                    Join the Waitlist
                                    <ArrowRight className="h-4 w-4" />
                                </a>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                                <a
                                    href="#how-it-works"
                                    className={`${buttonVariants({ variant: "ghost", size: "lg" })} text-base text-white! border border-white/30 hover:bg-white/10! px-8`}>
                                    See How It Works
                                </a>
                            </motion.div>
                        </motion.div>

                        {/* Quick stats */}
                        <motion.div variants={fadeInUp} className="flex items-center gap-8 mt-14 pt-8 border-t border-white/15">
                            {[
                                { value: "Zero", label: "Technical Setup" },
                                { value: "P2P", label: "Secured Payments" },
                                { value: "Real-time", label: "Rider Tracking" },
                            ].map((stat) => (
                                <div key={stat.label}>
                                    <div className="text-xl font-bold text-accent">{stat.value}</div>
                                    <div className="text-xs text-white/55 mt-0.5">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll cue */}
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/35">
                    <ChevronRight className="h-6 w-6 rotate-90" />
                </motion.div>
            </section>

            {/* ── PROBLEM → SOLUTION ───────────────────────────────────────── */}
            <section id="services" className="py-24 bg-primary text-white overflow-hidden">
                <div className="container mx-auto px-6 max-w-7xl">
                    <AnimatedSection className="text-center mb-16">
                        <p className="text-accent font-semibold mb-3 uppercase tracking-widest text-xs">The Problem</p>
                        <h2 className="text-4xl md:text-5xl font-black text-balance">
                            African logistics is broken.
                            <br />
                            We're fixing it.
                        </h2>
                    </AnimatedSection>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        variants={staggerContainer}
                        className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
                        {/* Without Drova */}
                        <motion.div variants={scaleIn} className="rounded-2xl bg-white/5 border border-white/10 p-8">
                            <div className="flex items-center gap-3 mb-7">
                                <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                                    <X className="h-4 w-4 text-red-400" />
                                </div>
                                <h3 className="text-base font-semibold text-white/55">Without Drova</h3>
                            </div>
                            <ul className="space-y-3.5">
                                {[
                                    "WhatsApp group coordination",
                                    "No customer-facing booking",
                                    "Cash payments, frequent disputes",
                                    "No rider tracking",
                                    "No reviews or credibility",
                                    "No analytics or insights",
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-white/45">
                                        <span className="h-1.5 w-1.5 rounded-full bg-red-400/50 flex-shrink-0" />
                                        <span className="text-sm line-through decoration-red-400/35">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* With Drova */}
                        <motion.div variants={scaleIn} className="rounded-2xl bg-accent/10 border border-accent/30 p-8">
                            <div className="flex items-center gap-3 mb-7">
                                <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                                    <Check className="h-4 w-4 text-accent" />
                                </div>
                                <h3 className="text-base font-semibold text-white">With Drova</h3>
                            </div>
                            <ul className="space-y-3.5">
                                {[
                                    "Structured order management dashboard",
                                    "Branded storefront with online booking",
                                    "P2P-secured payments",
                                    "Real-time GPS rider tracking",
                                    "Verified ratings and review system",
                                    "Full business analytics dashboard",
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-3">
                                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                                        <span className="text-sm text-white/90">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ── PLATFORM FEATURES ────────────────────────────────────────── */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-6 max-w-7xl">
                    <AnimatedSection className="text-center mb-16">
                        <p className="text-accent font-semibold mb-3 uppercase tracking-widest text-xs">The Platform</p>
                        <h2 className="text-4xl md:text-5xl font-black text-balance mb-4">
                            Everything you need,
                            <br />
                            nothing you don't
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                            Four interconnected products. One subscription. Runs on any browser — no IT team required.
                        </p>
                    </AnimatedSection>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        variants={staggerContainer}
                        className="grid md:grid-cols-2 gap-6">
                        {[
                            {
                                icon: LayoutDashboard,
                                title: "Business Dashboard",
                                description:
                                    "Manage your entire operation from one clean web interface. Orders, riders, payments, analytics, and settings — all in one place.",
                                features: [
                                    "Live order management & assignment",
                                    "Rider performance scorecards",
                                    "Wallet balance & payout scheduling",
                                    "Revenue trends & peak-hour analytics",
                                ],
                                highlighted: false,
                            },
                            {
                                icon: Store,
                                title: "Branded Storefront",
                                description:
                                    "Every business gets a public page at yourname.drova.ng — where customers browse services, see pricing, read reviews, and book deliveries.",
                                features: [
                                    "Auto-generated subdomain on signup",
                                    "Custom domain support (paid plans)",
                                    "Live booking form with fee calculator",
                                    "Verified customer reviews & ratings",
                                ],
                                highlighted: true,
                            },
                            {
                                icon: Shield,
                                title: "P2P Payments",
                                description:
                                    "Money moves directly between customer and business — held by Drova until delivery is confirmed. No middleman delays, no cash disputes, no trust issues.",
                                features: [
                                    "Paystack-powered P2P escrow",
                                    "Photo proof required on delivery",
                                    "Auto-release after 2-hour window",
                                    "Structured dispute resolution (48hr SLA)",
                                ],
                                highlighted: true,
                            },
                            {
                                icon: Smartphone,
                                title: "Rider Mobile App",
                                description:
                                    "A lightweight React Native app your riders will actually use — built for low-data environments and entry-level Android phones.",
                                features: [
                                    "One-tap Online / Offline toggle",
                                    "Google Maps navigation built-in",
                                    "Daily & weekly earnings tracker",
                                    "Push notifications for new jobs",
                                ],
                                highlighted: false,
                            },
                        ].map((feature) => (
                            <motion.div key={feature.title} variants={scaleIn} className="h-full">
                                <motion.div whileHover={{ y: -5, transition: { duration: 0.22 } }} className="h-full">
                                    <Card
                                        className={`h-full border-2 transition-colors ${
                                            feature.highlighted ? "border-accent/45 bg-accent/4" : "hover:border-primary/25"
                                        }`}>
                                        <CardContent className="p-8 flex flex-col gap-5 h-full">
                                            <div
                                                className={`h-11 w-11 rounded-xl flex items-center justify-center ${
                                                    feature.highlighted ? "bg-accent/18" : "bg-primary/10"
                                                }`}>
                                                <feature.icon className={`h-5 w-5 ${feature.highlighted ? "text-accent" : "text-primary"}`} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                                            </div>
                                            <ul className="space-y-2.5 mt-auto">
                                                {feature.features.map((f) => (
                                                    <li key={f} className="flex items-center gap-2.5 text-sm">
                                                        <CheckCircle
                                                            className={`h-4 w-4 flex-shrink-0 ${
                                                                feature.highlighted ? "text-accent" : "text-primary"
                                                            }`}
                                                        />
                                                        <span>{f}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
            <section id="how-it-works" className="py-24 bg-muted/30">
                <div className="container mx-auto px-6 max-w-7xl">
                    <AnimatedSection className="text-center mb-16">
                        <p className="text-accent font-semibold mb-3 uppercase tracking-widest text-xs">How It Works</p>
                        <h2 className="text-4xl md:text-5xl font-black text-balance">
                            Live in minutes,
                            <br />
                            not months
                        </h2>
                    </AnimatedSection>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        variants={staggerContainer}
                        className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
                        {[
                            {
                                step: "01",
                                icon: Building2,
                                title: "Register Your Business",
                                description:
                                    "Sign up with your business name, city, and fleet size. Verify via phone OTP. Your public storefront is auto-generated instantly at yourname.drova.ng.",
                            },
                            {
                                step: "02",
                                icon: Users,
                                title: "Add Your Riders",
                                description:
                                    "Invite riders by phone number. They receive an SMS with the app download link, complete their profile, and they're ready to take jobs.",
                            },
                            {
                                step: "03",
                                icon: Package,
                                title: "Start Taking Orders",
                                description:
                                    "Share your storefront link. Customers book online, pay via P2P, and your riders are dispatched with step-by-step navigation.",
                            },
                        ].map((item, i) => (
                            <motion.div key={item.step} variants={fadeInUp} className="relative text-center">
                                {/* Connector line */}
                                {i < 2 && (
                                    <div className="hidden md:block absolute top-14 left-[calc(50%+3.5rem)] w-[calc(100%-7rem)] h-px bg-gradient-to-r from-primary/25 to-transparent" />
                                )}
                                <div className="space-y-4">
                                    <div className="inline-flex flex-col items-center">
                                        <span className="text-6xl font-black text-primary/8 leading-none mb-1">{item.step}</span>
                                        <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                            <item.icon className="h-7 w-7 text-white" />
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold">{item.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── PRICING ──────────────────────────────────────────────────── */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-6 max-w-7xl">
                    <AnimatedSection className="text-center mb-16">
                        <p className="text-accent font-semibold mb-3 uppercase tracking-widest text-xs">Pricing</p>
                        <h2 className="text-4xl md:text-5xl font-black text-balance mb-4">
                            Start free,
                            <br />
                            scale as you grow
                        </h2>
                        <p className="text-lg text-muted-foreground">No upfront costs. No hidden fees. Upgrade when you're ready.</p>
                    </AnimatedSection>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        variants={staggerContainer}
                        className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
                        {[
                            {
                                name: "Starter",
                                price: "Free",
                                period: "forever",
                                description: "Perfect for getting started",
                                highlight: false,
                                features: [
                                    "Up to 5 riders",
                                    "100 orders / month",
                                    "20% platform commission",
                                    "Subdomain storefront",
                                    "Basic analytics",
                                    "Weekly payouts",
                                    "Email support",
                                ],
                                cta: "Start for Free",
                            },
                            {
                                name: "Professional",
                                price: "₦15,000",
                                period: "per month",
                                description: "For growing courier companies",
                                highlight: true,
                                features: [
                                    "Up to 25 riders",
                                    "2,000 orders / month",
                                    "15% platform commission",
                                    "Subdomain + custom domain",
                                    "Advanced analytics",
                                    "Daily payouts",
                                    "Priority email support",
                                    "WhatsApp integration",
                                ],
                                cta: "Join Waitlist",
                            },
                            {
                                name: "Enterprise",
                                price: "₦45,000",
                                period: "per month",
                                description: "For established fleets",
                                highlight: false,
                                features: [
                                    "Unlimited riders",
                                    "Unlimited orders",
                                    "10% commission (negotiable)",
                                    "Subdomain + custom domain",
                                    "Full analytics + data export",
                                    "Real-time payouts",
                                    "Dedicated account manager",
                                    "API access",
                                    "WhatsApp integration",
                                ],
                                cta: "Join Waitlist",
                            },
                        ].map((plan) => (
                            <motion.div key={plan.name} variants={scaleIn} className="h-full">
                                <motion.div whileHover={{ y: -5, transition: { duration: 0.22 } }} className="h-full">
                                    <Card
                                        className={`relative overflow-hidden flex flex-col h-full ${
                                            plan.highlight ? "border-2 border-accent shadow-xl shadow-accent/10" : "border"
                                        }`}>
                                        {plan.highlight && (
                                            <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-accent via-accent/80 to-accent" />
                                        )}
                                        <CardContent className="p-8 flex flex-col gap-6 h-full">
                                            <div>
                                                {plan.highlight && (
                                                    <Badge className="mb-3 bg-accent/15 text-accent border-accent/35">Most Popular</Badge>
                                                )}
                                                <h3 className="text-lg font-bold">{plan.name}</h3>
                                                <p className="text-sm text-muted-foreground">{plan.description}</p>
                                            </div>
                                            <div>
                                                <span className="text-4xl font-black">{plan.price}</span>
                                                <span className="text-muted-foreground text-sm ml-2">{plan.period}</span>
                                            </div>
                                            <ul className="space-y-2.5 flex-1">
                                                {plan.features.map((f) => (
                                                    <li key={f} className="flex items-center gap-2.5 text-sm">
                                                        <CheckCircle
                                                            className={`h-4 w-4 flex-shrink-0 ${plan.highlight ? "text-accent" : "text-primary"}`}
                                                        />
                                                        <span>{f}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <a
                                                href={WAITLIST_URL}
                                                target="_blank"
                                                rel="noreferrer"
                                                className={`${buttonVariants({
                                                    variant: plan.highlight ? "default" : "outline",
                                                })} w-full mt-auto ${plan.highlight ? "bg-accent! text-primary! border-0! hover:opacity-90!" : ""}`}>
                                                {plan.cta}
                                            </a>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── FINAL CTA ────────────────────────────────────────────────── */}
            <section className="py-32 bg-background relative overflow-hidden">
                {/* Radial glow */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,oklch(0.72_0.18_137/0.06),transparent)]" />

                <div className="relative container mx-auto px-6 max-w-7xl text-center">
                    <AnimatedSection className="max-w-3xl mx-auto space-y-7">
                        <Badge className="bg-primary/8 text-primary border-primary/18">Now Accepting Early Access</Badge>
                        <h2 className="text-4xl md:text-6xl font-black text-balance">
                            Be the first to
                            <br />
                            <span className="text-accent">transform your fleet</span>
                        </h2>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Drova is in beta. Join the waitlist to get early access, priority onboarding, and locked-in founding pricing.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                                <a
                                    href={WAITLIST_URL}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`${buttonVariants({ size: "lg" })} gap-2 text-base px-10 font-semibold`}>
                                    Join the Waitlist
                                    <ArrowRight className="h-4 w-4" />
                                </a>
                            </motion.div>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* ── FOOTER ───────────────────────────────────────────────────── */}
            <footer className="border-t bg-primary text-white py-12">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <img src="/logo.png" alt="Drova" className="h-8 brightness-0 invert" />
                            <span className="text-white/40 text-sm">Delivery-as-a-Service</span>
                        </div>
                        <nav className="flex items-center gap-6 text-sm text-white/55">
                            <a href="#services" className="hover:text-accent transition-colors">
                                Services
                            </a>
                            <a href="#how-it-works" className="hover:text-accent transition-colors">
                                How It Works
                            </a>
                            <a href="#riders" className="hover:text-accent transition-colors">
                                Become a Rider
                            </a>
                            <a href="mailto:product@drova.ng" className="hover:text-accent transition-colors">
                                Contact
                            </a>
                        </nav>
                        <p className="text-sm text-white/35">© 2026 Drova. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
