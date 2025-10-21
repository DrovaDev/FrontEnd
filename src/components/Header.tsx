// import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Bike, MessageCircle } from "lucide-react";

export default function Header() {
    return (
        <>
            {/* Header */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between mx-auto px-4">
                    <div className="flex items-center gap-2">
                        <Bike className="h-6 w-6 text-primary" />
                        <span className="font-bold text-xl">Drova</span>
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
                            <Button className="gap-2">
                                <MessageCircle className="h-4 w-4" />
                                Try Now
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button className="gap-2" variant="ghost">
                                {/* <MessageCircle className="h-4 w-4" /> */}
                                Join Waitlist
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </motion.header>
        </>
    );
}
