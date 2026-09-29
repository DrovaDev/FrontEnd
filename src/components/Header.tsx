import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { WAITLIST_URL } from "@/components/landing/primitives";
import { Logo } from "@/components/landing/Brand";

const LINKS = [
    { label: "Product", href: "#product" },
    { label: "Customer app", href: "#customers" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Payments", href: "#payments" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
];

/** Id of the nav section currently in the middle of the viewport. */
function useActiveSection() {
    const [active, setActive] = useState<string | null>(null);
    useEffect(() => {
        const sections = LINKS.map((l) => document.querySelector(l.href)).filter(Boolean) as Element[];
        const observer = new IntersectionObserver(
            (entries) => {
                for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`);
            },
            { rootMargin: "-45% 0px -50% 0px" },
        );
        sections.forEach((s) => observer.observe(s));
        return () => observer.disconnect();
    }, []);
    return active;
}

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const scrollDirection = useScrollDirection();
    const active = useActiveSection();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const visible = open || scrollDirection === "up" || !scrolled;

    // Close the mobile menu first, then scroll — the link unmounts with the menu,
    // so the browser's own anchor navigation can't be relied on.
    const goTo = (e: React.MouseEvent, href: string) => {
        e.preventDefault();
        setOpen(false);
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
        history.replaceState(null, "", href);
    };

    return (
        <motion.header
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
            <div
                className={cn(
                    "w-full max-w-5xl rounded-[1.75rem] border transition-[background-color,box-shadow,border-color] duration-300",
                    scrolled || open ? "border-white/10 bg-forest/90 shadow-xl shadow-black/20 backdrop-blur-xl" : "border-white/[0.07] bg-white/[0.04] backdrop-blur-md",
                )}>
                <div className="flex h-14 items-center justify-between pl-5 pr-2">
                    <a href="#" aria-label="Drova home" onClick={() => setOpen(false)}>
                        <Logo className="bg-lime" height={26} />
                    </a>

                    <nav className="hidden items-center gap-1 md:flex">
                        {LINKS.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                                    active === link.href ? "text-white" : "text-white/60 hover:text-white",
                                )}>
                                {active === link.href && (
                                    <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-white/10" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                                )}
                                <span className="relative">{link.label}</span>
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center gap-1.5">
                        <a href="#demo" className="hidden rounded-full px-3.5 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white lg:inline-flex">
                            Request a demo
                        </a>
                        <a
                            href={WAITLIST_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="group hidden items-center gap-1.5 rounded-full bg-lime px-4 py-2 text-sm font-semibold text-forest transition-colors hover:bg-lime/90 sm:inline-flex">
                            Join the waitlist
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </a>
                        <button
                            type="button"
                            onClick={() => setOpen((o) => !o)}
                            aria-expanded={open}
                            aria-label={open ? "Close menu" : "Open menu"}
                            className="grid size-10 place-items-center rounded-full text-white hover:bg-white/10 md:hidden">
                            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                <AnimatePresence initial={false}>
                    {open && (
                        <motion.nav
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden md:hidden">
                            <div className="flex flex-col gap-1 border-t border-white/10 p-3">
                                {LINKS.map((link) => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        onClick={(e) => goTo(e, link.href)}
                                        className={cn("rounded-2xl px-4 py-3 text-base font-medium", active === link.href ? "bg-white/10 text-white" : "text-white/70")}>
                                        {link.label}
                                    </a>
                                ))}
                                <a
                                    href="#demo"
                                    onClick={() => setOpen(false)}
                                    className="mt-2 flex items-center justify-center gap-2 rounded-2xl border border-white/20 px-4 py-3 font-semibold text-white">
                                    Request a demo
                                </a>
                                <a
                                    href={WAITLIST_URL}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center gap-2 rounded-2xl bg-lime px-4 py-3 font-semibold text-forest">
                                    Join the waitlist <ArrowRight className="h-4 w-4" />
                                </a>
                            </div>
                        </motion.nav>
                    )}
                </AnimatePresence>
            </div>
        </motion.header>
    );
}
