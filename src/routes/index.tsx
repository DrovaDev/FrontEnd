import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    MessageCircle,
    Leaf,
    Zap,
    DollarSign,
    Users,
    Package,
    Clock,
    Shield,
    TrendingUp,
    Bike,
    Store,
    User,
    MapPin,
    CheckCircle,
    Mail,
    Check,
} from "lucide-react";
import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";

export const Route = createFileRoute("/")({
    component: LandingPage,
});

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, easing: "ease-out" } },
};

const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, easing: "ease-out" } },
};

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={fadeInUp} className={className}>
            {children}
        </motion.div>
    );
}

function WhatsAppChatDemo() {
    const [visibleMessages, setVisibleMessages] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const messages = [
        { type: "user", text: "Hi, I need to send a package", time: "10:23" },
        { type: "bot", text: "Great! I can help you with that. 📦\n\nWhere should we pick up the package?", time: "10:23" },
        { type: "user", text: "123 Main Street, Victoria Island, Lagos", time: "10:24" },
        { type: "bot", text: "Got it! ✓\n\nAnd where should we deliver it?", time: "10:24" },
        { type: "user", text: "456 Park Avenue, Lekki, Lagos", time: "10:25" },
        { type: "bot", text: "Perfect! What are you sending?", time: "10:25" },
        { type: "user", text: "Important documents", time: "10:25" },
        {
            type: "bot",
            text: "📍 Pickup: Victoria Island\n📍 Delivery: Lekki\n📦 Item: Documents\n\n⏱️ Estimated time: 25 minutes\n💰 Cost: $3.50\n\nConfirm delivery?",
            time: "10:26",
        },
        { type: "user", text: "Yes, confirm", time: "10:26" },
        {
            type: "bot",
            text: "✅ Order confirmed!\n\n🚴 Rider assigned: James K.\n📱 Track your delivery: drova.app/track/ABC123\n\nYou'll receive updates as your package moves!",
            time: "10:26",
        },
    ];

    useEffect(() => {
        if (isInView && visibleMessages < messages.length) {
            const timer = setTimeout(() => {
                setVisibleMessages((prev) => prev + 1);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [isInView, visibleMessages, messages.length]);

    return (
        <div ref={ref} className="max-w-md mx-auto">
            <div className="bg-[#ECE5DD] rounded-2xl shadow-2xl overflow-hidden">
                {/* WhatsApp Header */}
                <div className="bg-[#075E54] text-white p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                        <Bike className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                        <div className="font-semibold">Drova Delivery</div>
                        <div className="text-xs text-white/80">Online</div>
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="p-4 space-y-3 h-[500px] overflow-y-auto">
                    {messages.slice(0, visibleMessages).map((message, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                    message.type === "user" ? "bg-[#DCF8C6] text-gray-900" : "bg-white text-gray-900 shadow-sm"
                                }`}>
                                <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                                <div className="flex items-center justify-end gap-1 mt-1">
                                    <span className="text-[10px] text-gray-500">{message.time}</span>
                                    {message.type === "user" && <Check className="h-3 w-3 text-blue-500" />}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="bg-[#F0F0F0] p-3 flex items-center gap-2">
                    <div className="flex-1 bg-white rounded-full px-4 py-2 text-sm text-gray-400">Type a message...</div>
                    <div className="h-10 w-10 rounded-full bg-[#075E54] flex items-center justify-center">
                        <MessageCircle className="h-5 w-5 text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen max-w-[1920px] mx-auto">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-secondary/20 to-background py-20 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8">
                            <motion.div variants={fadeInUp}>
                                <Badge className="w-fit gap-2 bg-primary/10 text-primary hover:bg-primary/20">
                                    <Leaf className="h-3 w-3" />
                                    Eco-Friendly Delivery
                                </Badge>
                            </motion.div>
                            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
                                Fast, Green Delivery. <span className="text-primary">Right on WhatsApp.</span>
                            </motion.h1>
                            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground leading-relaxed text-pretty">
                                Africa's most reliable bicycle delivery network. No app needed—just send a WhatsApp message and we'll handle the rest.
                                Affordable, eco-conscious, and lightning fast.
                            </motion.p>
                            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button size="lg" className="gap-2 text-lg h-12 px-8">
                                        <MessageCircle className="h-5 w-5" />
                                        Try Now!
                                    </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button size="lg" variant="outline" className="text-lg h-12 px-8 bg-transparent">
                                        For Businesses
                                    </Button>
                                </motion.div>
                            </motion.div>
                            {/* <motion.div variants={fadeInUp} className="flex items-center gap-8 pt-4">
                                <div>
                                    <div className="text-3xl font-bold text-primary">500+</div>
                                    <div className="text-sm text-muted-foreground">Active Riders</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-primary">10k+</div>
                                    <div className="text-sm text-muted-foreground">Deliveries/Month</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-primary">4.8★</div>
                                    <div className="text-sm text-muted-foreground">Customer Rating</div>
                                </div>
                            </motion.div> */}
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="relative h-[400px] lg:h-[600px] overflow-hidden rounded-2xl shadow-2xl">
                            <img
                                src="/bicycle-courier-delivering-package-in-busy-african.jpg"
                                alt="Bicycle courier delivering packages"
                                className=" object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Value Propositions */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <AnimatedSection className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Why Choose Drova?</h2>
                        <p className="text-xl text-muted-foreground text-pretty">The smart way to deliver in congested cities</p>
                    </AnimatedSection>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: DollarSign,
                                title: "Affordable Rates",
                                description: "Up to 50% cheaper than motorcycle couriers. No hidden fees, transparent pricing.",
                            },
                            {
                                icon: Leaf,
                                title: "Zero Emissions",
                                description: "100% eco-friendly bicycle fleet. Help reduce urban pollution with every delivery.",
                            },
                            {
                                icon: Zap,
                                title: "Beat the Traffic",
                                description: "Bicycles navigate congested streets faster. Average delivery time: 25 minutes.",
                            },
                            {
                                icon: MessageCircle,
                                title: "WhatsApp Simple",
                                description: "No app downloads. No registration. Just message us and we deliver.",
                            },
                        ].map((item, index) => (
                            <motion.div key={index} variants={scaleIn}>
                                <motion.div whileHover={{ y: -8, transition: { duration: 0.3 } }}>
                                    <Card className="border-2 hover:border-primary transition-colors h-full">
                                        <CardContent className="pt-6 space-y-4">
                                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <item.icon className="h-6 w-6 text-primary" />
                                            </div>
                                            <h3 className="text-xl font-bold">{item.title}</h3>
                                            <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Target Audiences */}
            <section id="services" className="py-20">
                <div className="container mx-auto px-4">
                    <AnimatedSection className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Built for Everyone</h2>
                        <p className="text-xl text-muted-foreground text-pretty">Whether you're a business or an individual, we've got you covered</p>
                    </AnimatedSection>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="grid lg:grid-cols-2 gap-8">
                        {/* For Businesses */}
                        <motion.div variants={scaleIn}>
                            <motion.div whileHover={{ y: -8, transition: { duration: 0.3 } }}>
                                <Card className="overflow-hidden border-2 h-full">
                                    <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                        <Store className="h-24 w-24 text-primary" />
                                    </div>
                                    <CardContent className="p-8 space-y-6">
                                        <div>
                                            <h3 className="text-2xl font-bold mb-2">For Businesses</h3>
                                            <p className="text-muted-foreground">Streamline your delivery operations with our reliable fleet</p>
                                        </div>
                                        <ul className="space-y-3">
                                            <li className="flex items-start gap-3">
                                                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <Package className="h-3 w-3 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold">Restaurant & Food Delivery</div>
                                                    <div className="text-sm text-muted-foreground">Hot meals delivered fresh within 30 minutes</div>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <Store className="h-3 w-3 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold">Retail & E-commerce</div>
                                                    <div className="text-sm text-muted-foreground">Same-day delivery for local orders</div>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <TrendingUp className="h-3 w-3 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold">Free Onboarding</div>
                                                    <div className="text-sm text-muted-foreground">Monthly packages with discounted rates</div>
                                                </div>
                                            </li>
                                        </ul>
                                        <Button className="w-full gap-2">
                                            <MessageCircle className="h-4 w-4" />
                                            Register Now
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>

                        {/* For Consumers */}
                        <motion.div variants={scaleIn}>
                            <motion.div whileHover={{ y: -8, transition: { duration: 0.3 } }}>
                                <Card className="overflow-hidden border-2 h-full">
                                    <div className="h-48 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                                        <User className="h-24 w-24 text-primary" />
                                    </div>
                                    <CardContent className="p-8 space-y-6">
                                        <div>
                                            <h3 className="text-2xl font-bold mb-2">For Individuals</h3>
                                            <p className="text-muted-foreground">Send parcels and packages across the city hassle-free</p>
                                        </div>
                                        <ul className="space-y-3">
                                            <li className="flex items-start gap-3">
                                                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <Package className="h-3 w-3 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold">Personal Parcels</div>
                                                    <div className="text-sm text-muted-foreground">Send documents, gifts, or packages to friends</div>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <Clock className="h-3 w-3 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold">On-Demand Pickup</div>
                                                    <div className="text-sm text-muted-foreground">Request a rider anytime via WhatsApp</div>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <Shield className="h-3 w-3 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold">No Registration Needed</div>
                                                    <div className="text-sm text-muted-foreground">Walk-in service, no account required</div>
                                                </div>
                                            </li>
                                        </ul>
                                        <Button className="w-full gap-2 bg-transparent" variant="outline">
                                            <MessageCircle className="h-4 w-4" />
                                            Send a Package Now
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <AnimatedSection className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">How It Works</h2>
                        <p className="text-xl text-muted-foreground text-pretty">Three simple steps to get your delivery moving</p>
                    </AnimatedSection>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                number: 1,
                                title: "Message on WhatsApp",
                                description: "Send us a message with your pickup and delivery locations. No app needed.",
                            },
                            {
                                number: 2,
                                title: "Rider Assigned",
                                description: "We instantly match you with the nearest available cyclist. Track in real-time.",
                            },
                            {
                                number: 3,
                                title: "Fast Delivery",
                                description: "Your package arrives quickly and safely. Get delivery confirmation via WhatsApp.",
                            },
                        ].map((step, index) => (
                            <motion.div key={index} variants={fadeInUp} className="relative">
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                                        {step.number}
                                    </motion.div>
                                    <h3 className="text-xl font-bold">{step.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                                </div>
                                {index < 2 && <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border" />}
                            </motion.div>
                        ))}
                    </motion.div>

                    <AnimatedSection className="mt-16 max-w-3xl mx-auto">
                        <Card className="overflow-hidden">
                            <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <MessageCircle className="h-8 w-8 text-primary" />
                                    <h3 className="text-2xl font-bold">Try it now on WhatsApp</h3>
                                </div>
                                <p className="text-muted-foreground mb-6 leading-relaxed">
                                    Send a message to <span className="font-bold text-foreground">+234 XXX XXX XXXX</span> with your delivery details
                                    and experience the future of urban logistics.
                                </p>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button size="lg" className="gap-2">
                                        <MessageCircle className="h-5 w-5" />
                                        Open WhatsApp
                                    </Button>
                                </motion.div>
                            </div>
                        </Card>
                    </AnimatedSection>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    <AnimatedSection className="text-center mb-16">
                        <Badge className="w-fit gap-2 bg-primary/10 text-primary hover:bg-primary/20 mb-4">
                            <MessageCircle className="h-3 w-3" />
                            See It In Action
                        </Badge>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Experience the Simplicity</h2>
                        <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
                            Watch how easy it is to request a delivery through WhatsApp. No app, no registration, just simple messaging.
                        </p>
                    </AnimatedSection>

                    <WhatsAppChatDemo />

                    <AnimatedSection className="mt-12 text-center">
                        <p className="text-muted-foreground mb-4">Ready to try it yourself? Start your first delivery now!</p>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button size="lg" className="gap-2">
                                <MessageCircle className="h-5 w-5" />
                                Open WhatsApp
                            </Button>
                        </motion.div>
                    </AnimatedSection>
                </div>
            </section>

            <section id="coverage" className="py-20">
                <div className="container mx-auto px-4">
                    <AnimatedSection className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Where We Deliver</h2>
                        <p className="text-xl text-muted-foreground text-pretty">Expanding across major African cities with reliable coverage</p>
                    </AnimatedSection>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {[
                            { city: "Abeokuta", zones: "12 zones", deliveries: "3k+/month" },
                            { city: "Lagos", zones: "15 zones", deliveries: "Coming soon" },
                            { city: "Ibadan", zones: "8 zones", deliveries: "Coming soon" },
                            { city: "Abuja", zones: "9 zones", deliveries: "Coming soon" },
                            { city: "Oshogbo", zones: "10 zones", deliveries: "Coming soon" },
                            { city: "Akure", zones: "6 zones", deliveries: "Coming soon" },
                        ].map((location, index) => (
                            <motion.div key={index} variants={scaleIn}>
                                <motion.div whileHover={{ y: -8, transition: { duration: 0.3 } }}>
                                    <Card className="border-2 hover:border-primary transition-colors">
                                        <CardContent className="pt-6 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                    <MapPin className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold">{location.city}</h3>
                                                    <p className="text-sm text-muted-foreground">{location.zones} coverage</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <CheckCircle className="h-4 w-4 text-primary" />
                                                <span>{location.deliveries} deliveries</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                    <AnimatedSection className="mt-12 text-center">
                        <p className="text-muted-foreground mb-4">Don't see your city? We're expanding rapidly!</p>
                        <Button variant="outline" className="gap-2 bg-transparent">
                            <MessageCircle className="h-4 w-4" />
                            Request Coverage in Your Area
                        </Button>
                    </AnimatedSection>
                </div>
            </section>

            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <AnimatedSection className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Safe, Simple, Secure</h2>
                        <p className="text-xl text-muted-foreground text-pretty">Your peace of mind is our priority</p>
                    </AnimatedSection>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="grid md:grid-cols-1 gap-8 max-w-4xl mx-auto">
                        {/* <motion.div variants={scaleIn}>
                            <motion.div whileHover={{ y: -8, transition: { duration: 0.3 } }}>
                                <Card className="border-2 h-full">
                                    <CardContent className="pt-6 space-y-6">
                                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <DollarSign className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold mb-2">Payment on Delivery</h3>
                                            <p className="text-muted-foreground leading-relaxed">
                                                Pay only when your package arrives. We accept cash, mobile money, and card payments at delivery. No
                                                upfront fees, no subscriptions required.
                                            </p>
                                        </div>
                                        <ul className="space-y-3">
                                            <li className="flex items-center gap-2 text-sm">
                                                <CheckCircle className="h-4 w-4 text-primary" />
                                                <span>Cash on delivery</span>
                                            </li>
                                            <li className="flex items-center gap-2 text-sm">
                                                <CheckCircle className="h-4 w-4 text-primary" />
                                                <span>Mobile money (M-Pesa, MTN, etc.)</span>
                                            </li>
                                            <li className="flex items-center gap-2 text-sm">
                                                <CheckCircle className="h-4 w-4 text-primary" />
                                                <span>Card payment via rider POS</span>
                                            </li>
                                            <li className="flex items-center gap-2 text-sm">
                                                <CheckCircle className="h-4 w-4 text-primary" />
                                                <span>Transparent pricing - no hidden fees</span>
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div> */}

                        <motion.div variants={scaleIn}>
                            <motion.div whileHover={{ y: -8, transition: { duration: 0.3 } }}>
                                <Card className="border-2 h-full">
                                    <CardContent className="pt-6 space-y-6">
                                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Shield className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold mb-2">Safety & Insurance</h3>
                                            <p className="text-muted-foreground leading-relaxed">
                                                Every delivery is insured and tracked. Our riders are verified, trained, and equipped with safety
                                                gear. Your packages are in safe hands.
                                            </p>
                                        </div>
                                        <ul className="space-y-3">
                                            <li className="flex items-center gap-2 text-sm">
                                                <CheckCircle className="h-4 w-4 text-primary" />
                                                <span>Package insurance up to $500</span>
                                            </li>
                                            <li className="flex items-center gap-2 text-sm">
                                                <CheckCircle className="h-4 w-4 text-primary" />
                                                <span>Real-time GPS tracking</span>
                                            </li>
                                            <li className="flex items-center gap-2 text-sm">
                                                <CheckCircle className="h-4 w-4 text-primary" />
                                                <span>Verified & trained riders</span>
                                            </li>
                                            <li className="flex items-center gap-2 text-sm">
                                                <CheckCircle className="h-4 w-4 text-primary" />
                                                <span>24/7 customer support</span>
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    <AnimatedSection className="text-center mb-16">
                        <Badge className="w-fit gap-2 bg-primary/10 text-primary hover:bg-primary/20 mb-4">
                            <Leaf className="h-3 w-3" />
                            Our Environmental Impact
                        </Badge>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Delivering a Greener Future</h2>
                        <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
                            Every delivery with Drova is a step towards cleaner, healthier cities. Join us in reducing urban pollution one package at
                            a time.
                        </p>
                    </AnimatedSection>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {[
                            { value: "50 tons", label: "CO₂ Saved Annually", icon: Leaf },
                            { value: "100%", label: "Zero Emissions Fleet", icon: Bike },
                            { value: "10k+", label: "Trees Equivalent Impact", icon: TrendingUp },
                            { value: "500+", label: "Green Jobs Created", icon: Users },
                        ].map((stat, index) => (
                            <motion.div key={index} variants={scaleIn}>
                                <Card className="border-2 text-center">
                                    <CardContent className="pt-6 space-y-3">
                                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                                            <stat.icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="text-3xl font-bold text-primary">{stat.value}</div>
                                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <AnimatedSection className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Frequently Asked Questions</h2>
                        <p className="text-xl text-muted-foreground text-pretty">Everything you need to know about Drova</p>
                    </AnimatedSection>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="max-w-3xl mx-auto space-y-4">
                        {[
                            {
                                question: "How do I place an order?",
                                answer: "Simply send a WhatsApp message to our number with your pickup and delivery locations. Our system will instantly assign a rider and provide you with tracking information.",
                            },
                            {
                                question: "What are your delivery hours?",
                                answer: "We operate from 7 AM to 10 PM daily, including weekends and public holidays. For businesses with special requirements, we offer extended hours.",
                            },
                            {
                                question: "How much does delivery cost?",
                                answer: "Pricing is based on distance and package size. You'll receive a quote via WhatsApp before confirming your order. Payment is made on delivery - no upfront fees.",
                            },
                            {
                                question: "What can I send?",
                                answer: "We deliver documents, food, parcels, and packages up to 15kg. Items must fit in our secure delivery bags. Prohibited items include hazardous materials and illegal goods.",
                            },
                            {
                                question: "How do I track my delivery?",
                                answer: "Once your rider is assigned, you'll receive a tracking link via WhatsApp. You can see your rider's real-time location and estimated arrival time.",
                            },
                            {
                                question: "What if my package is damaged?",
                                answer: "All deliveries are insured up to $500. If your package arrives damaged, report it immediately via WhatsApp and we'll process your claim within 24 hours.",
                            },
                        ].map((faq, index) => (
                            <motion.div key={index} variants={fadeInUp}>
                                <Card className="border-2">
                                    <CardContent className="pt-6 space-y-2">
                                        <h3 className="text-lg font-bold">{faq.question}</h3>
                                        <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                    <AnimatedSection className="mt-12 text-center">
                        <p className="text-muted-foreground mb-4">Still have questions?</p>
                        <Button className="gap-2">
                            <MessageCircle className="h-4 w-4" />
                            Chat with Support on WhatsApp
                        </Button>
                    </AnimatedSection>
                </div>
            </section>

            {/* Riders Section */}
            <section id="riders" className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative h-[400px] lg:h-[500px] order-2 lg:order-1 overflow-hidden rounded-2xl shadow-2xl">
                            <img src="/happy-bicycle-courier-with-safety-gear-and-helmet.jpg" alt="Happy bicycle courier" className="object-cover" />
                        </motion.div>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={staggerContainer}
                            className="space-y-6 order-1 lg:order-2">
                            <motion.div variants={fadeInUp}>
                                <Badge className="w-fit gap-2 bg-primary/10 text-primary hover:bg-primary/20">
                                    <Users className="h-3 w-3" />
                                    Join Our Team
                                </Badge>
                            </motion.div>
                            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold text-balance">
                                Become a Drova Rider
                            </motion.h2>
                            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground leading-relaxed text-pretty">
                                Earn flexible income while staying fit and helping the environment. We provide everything you need to succeed.
                            </motion.p>
                            <motion.ul variants={staggerContainer} className="space-y-4">
                                {[
                                    {
                                        icon: DollarSign,
                                        title: "Competitive Earnings",
                                        description: "Earn up to $500/month with flexible hours",
                                    },
                                    {
                                        icon: Shield,
                                        title: "Safety First",
                                        description: "Free safety gear, helmets, and rain protection",
                                    },
                                    {
                                        icon: Clock,
                                        title: "Flexible Schedule",
                                        description: "Work when you want, as much as you want",
                                    },
                                ].map((benefit, index) => (
                                    <motion.li key={index} variants={fadeInUp} className="flex items-start gap-3">
                                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                                            <benefit.icon className="h-3 w-3 text-primary" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-lg">{benefit.title}</div>
                                            <div className="text-muted-foreground">{benefit.description}</div>
                                        </div>
                                    </motion.li>
                                ))}
                            </motion.ul>
                            <motion.div variants={fadeInUp}>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button size="lg" className="gap-2">
                                        <MessageCircle className="h-5 w-5" />
                                        Try Now!
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-primary to-accent text-primary-foreground">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="max-w-3xl mx-auto text-center space-y-8">
                        <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold text-balance">
                            Ready to Experience the Future of Urban Delivery?
                        </motion.h2>
                        <motion.p variants={fadeInUp} className="text-xl text-primary-foreground/90 leading-relaxed text-pretty">
                            Join thousands of businesses and individuals who trust Drova for fast, affordable, and eco-friendly deliveries across the
                            city.
                        </motion.p>
                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button size="lg" variant="secondary" className="gap-2 text-lg h-12 px-8">
                                    <MessageCircle className="h-5 w-5" />
                                    Start Delivering Now
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="gap-2 text-lg h-12 px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                                    Learn More
                                </Button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t py-12 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Bike className="h-6 w-6 text-primary" />
                                <span className="font-bold text-xl">Drova</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Africa's most reliable eco-friendly bicycle delivery network. Fast, affordable, and sustainable.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Services</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>
                                    <a href="#" className="hover:text-primary transition-colors">
                                        Food Delivery
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-primary transition-colors">
                                        Parcel Delivery
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-primary transition-colors">
                                        Business Solutions
                                    </a>
                                </li>
                                <li>
                                    <a href="#coverage" className="hover:text-primary transition-colors">
                                        Coverage Areas
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>
                                    <a href="#" className="hover:text-primary transition-colors">
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <a href="#riders" className="hover:text-primary transition-colors">
                                        Become a Rider
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-primary transition-colors">
                                        Careers
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-primary transition-colors">
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Contact</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <MessageCircle className="h-4 w-4 text-primary" />
                                    <span>+234 XXX XXX XXXX</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-primary" />
                                    <span>support@drova.com</span>
                                </li>
                                <li className="pt-4">
                                    <Button className="w-full gap-2">
                                        <MessageCircle className="h-4 w-4" />
                                        Chat on WhatsApp
                                    </Button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
                        <p>&copy; 2025 Drova</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
