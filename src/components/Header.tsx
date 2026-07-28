import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useScrollDirection } from "@/hooks/useScrollDirection";

export default function Header() {
    const [comingSoon, setComingSoon] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const scrollDirection = useScrollDirection();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    function handleTryNow() {
        setComingSoon(true);
        setTimeout(() => setComingSoon(false), 2000);
    }

    return (
        <motion.header
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: scrollDirection === "up" ? 0 : -100, opacity: scrollDirection === "up" ? 1 : 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4">
            <div
                className={`w-full max-w-5xl flex h-14 items-center justify-between px-5 rounded-full border transition-all duration-300 ${
                    scrolled
                        ? "bg-primary/80 backdrop-blur-xl border-white/10 shadow-lg shadow-black/20"
                        : "bg-primary/40 backdrop-blur-md border-white/8"
                }`}>
                {/* Logo */}
                <div className="flex items-center">
                    <img src="/logo.png" alt="Drova" className="h-7 w-auto brightness-0 invert" />
                </div>

                {/* Nav */}
                <nav className="hidden md:flex items-center gap-7">
                    {[
                        { label: "Services", href: "#services" },
                        { label: "How It Works", href: "#how-it-works" },
                        { label: "Marketplace", href: "#marketplace" },
                    ].map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-white/75 hover:text-accent transition-colors duration-200">
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            size="sm"
                            className="gap-1.5 bg-accent! text-primary! border-0! hover:opacity-85! font-semibold"
                            onClick={handleTryNow}
                            disabled={comingSoon}>
                            <MessageCircle className="h-3.5 w-3.5" />
                            {comingSoon ? "Coming soon" : "Try Now"}
                        </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <a
                            href="https://docs.google.com/forms/d/e/1FAIpQLSfY2JH5IuPygrrjdgvSR8Wwu6Bh9aPIsOuVdl-BsY6fR6jFBw/viewform?usp=dialog"
                            className={`${buttonVariants({ variant: "ghost", size: "sm" })} text-white! border border-white/25 hover:bg-white/10! hover:text-white!`}
                            target="_blank"
                            rel="noreferrer">
                            Join Waitlist
                        </a>
                    </motion.div>
                </div>
            </div>
        </motion.header>
    );
}
