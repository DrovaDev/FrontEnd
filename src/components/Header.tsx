// import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useScrollDirection } from "@/hooks/useScrollDirection";

export default function Header() {
    const [comingSoon, setComingSoon] = useState(false);
    const scrollDirection = useScrollDirection();

    function handleTryNow() {
        setComingSoon(true);
        // Show "Coming soon" briefly
        setTimeout(() => setComingSoon(false), 2000);
    }

    return (
        <>
            {/* Header */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: scrollDirection === "up" ? 0 : -100, opacity: scrollDirection === "up" ? 1 : 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between mx-auto px-4">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Drova web logo" className="w-20" />
                    </div>
                    <nav className="hidden md:flex items-center gap-6">
                        <a href="#services" className="text-sm font-medium hover:text-primary transition-colors">
                            Services
                        </a>
                        <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
                            How It Works
                        </a>
                        <a href="#coverage" className="text-sm font-medium hover:text-primary transition-colors">
                            Coverage
                        </a>
                        <a href="#riders" className="text-sm font-medium hover:text-primary transition-colors">
                            Become a Rider
                        </a>
                    </nav>
                    <div className="flex gap-2">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button className="gap-2" onClick={handleTryNow} disabled={comingSoon}>
                                <MessageCircle className="h-4 w-4" />
                                {comingSoon ? "Coming soon" : "Try Now"}
                            </Button>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <a
                                href="https://docs.google.com/forms/d/e/1FAIpQLSfY2JH5IuPygrrjdgvSR8Wwu6Bh9aPIsOuVdl-BsY6fR6jFBw/viewform?usp=dialog"
                                className={`${buttonVariants({ variant: "ghost" })}`}
                                target="_blank"
                                rel="noreferrer">
                                Join Waitlist
                            </a>
                        </motion.div>
                    </div>
                </div>
            </motion.header>
        </>
    );
}
