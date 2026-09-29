import type { ReactNode } from "react";
import {
    ArrowRight,
    Bell,
    Bike,
    CheckCircle2,
    CreditCard,
    Flag,
    Gavel,
    Hourglass,
    LayoutDashboard,
    MapPin,
    MapPinned,
    Phone,
    Plus,
    Search,
    Settings,
    Shield,
    ShieldCheck,
    SlidersHorizontal,
    Star,
    Truck,
    UserPlus,
    Users,
    Wallet,
    XCircle,
    Scale,
    Map as MapIcon,
    BadgeCheck,
    Clock,
    Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import CityMap from "./CityMap";

// Recreations of screens from the Drova business web app, filled with sample data.
// Each screen is laid out at a fixed 1120px design width and scaled to fit by <ScaledScreen>.

export const SCREEN_WIDTH = 1120;
export const SCREEN_HEIGHT = 700;

const NAV = [
    { icon: LayoutDashboard, title: "Overview" },
    { icon: Truck, title: "Orders" },
    { icon: Users, title: "Riders" },
    { icon: CreditCard, title: "Transactions" },
    { icon: Gavel, title: "Disputes" },
    { icon: Shield, title: "Roles" },
    { icon: Settings, title: "Settings" },
    { icon: Users, title: "Staff" },
];

function AppShell({ active, children }: { active: string; children: ReactNode }) {
    return (
        <div className="flex h-full bg-app-bg text-forest">
            <aside className="flex w-[210px] shrink-0 flex-col border-r border-app-border bg-white p-5">
                <img src="/logo.png" alt="" className="h-7 w-auto self-start" />
                <p className="mt-0.5 text-[11px] text-sage">Management portal</p>
                <nav className="mt-9 flex flex-col gap-1.5">
                    {NAV.map(({ icon: Icon, title }) => (
                        <div
                            key={title}
                            className={cn("flex items-center gap-2.5 rounded-2xl px-4 py-2 text-[13px] font-medium text-sage", title === active && "bg-leaf text-forest")}>
                            <Icon size={16} />
                            {title}
                        </div>
                    ))}
                </nav>
                <div className="mt-auto rounded-2xl bg-mint p-3">
                    <p className="text-[11px] font-bold text-forest">Swiftline Logistics</p>
                    <p className="text-[10px] text-sage">Professional plan</p>
                </div>
            </aside>
            <div className="flex min-w-0 flex-1 flex-col">
                <header className="flex h-14 shrink-0 items-center justify-between border-b border-app-border bg-white px-8">
                    <div className="flex w-72 items-center gap-2 rounded-full bg-app-bg px-3.5 py-1.5 text-[12px] text-sage">
                        <Search size={13} /> Search orders, riders…
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="relative">
                            <Bell size={17} className="text-sage" />
                            <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-gold ring-2 ring-white" />
                        </span>
                        <span className="grid size-8 place-items-center rounded-full bg-forest text-[11px] font-bold text-white">SL</span>
                    </div>
                </header>
                <div className="min-h-0 flex-1 overflow-hidden px-8 py-6">{children}</div>
            </div>
        </div>
    );
}

function Panel({ title, subtitle, icon: Icon, badge, children, className }: { title: string; subtitle?: string; icon?: typeof Truck; badge?: ReactNode; children: ReactNode; className?: string }) {
    return (
        <section className={cn("rounded-2xl border border-app-border bg-white p-4 shadow-sm", className)}>
            <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                    {Icon && (
                        <span className="grid size-7 place-items-center rounded-lg bg-forest/10">
                            <Icon size={14} className="text-forest" />
                        </span>
                    )}
                    <div>
                        <h3 className="text-[13px] font-bold">{title}</h3>
                        {subtitle && <p className="text-[11px] text-sage">{subtitle}</p>}
                    </div>
                </div>
                {badge}
            </div>
            {children}
        </section>
    );
}

function LivePill({ children }: { children: ReactNode }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald/10 px-2 py-0.5 text-[10px] font-bold text-emerald">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald" />
            {children}
        </span>
    );
}

// ─── Status badges (mirror components/orders/order-status-badge) ────────────

type Status = "pending" | "assigned" | "picked_up" | "in_transit" | "completed" | "cancelled";
const STATUS: Record<Status, { label: string; cls: string }> = {
    pending: { label: "Pending", cls: "bg-gold/20 text-gold-ink" },
    assigned: { label: "Assigned", cls: "bg-forest/10 text-forest" },
    picked_up: { label: "Picked up", cls: "bg-lime/20 text-forest" },
    in_transit: { label: "In transit", cls: "bg-forest text-white" },
    completed: { label: "Delivered", cls: "bg-emerald/15 text-emerald" },
    cancelled: { label: "Cancelled", cls: "bg-red-100 text-red-700" },
};

function StatusBadge({ status }: { status: Status }) {
    const s = STATUS[status];
    return <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold", s.cls)}>{s.label}</span>;
}

const ORDERS: { ref: string; customer: string; from: string; to: string; rider: string; amount: string; status: Status; time: string }[] = [
    { ref: "DRV-ORD4827315", customer: "Adaeze Okafor", from: "Lekki Phase 1", to: "Yaba", rider: "Tunde A.", amount: "₦3,200", status: "in_transit", time: "2 min ago" },
    { ref: "DRV-ORD4827290", customer: "Guest · Ibrahim", from: "Ikeja GRA", to: "Surulere", rider: "Chidi E.", amount: "₦2,500", status: "picked_up", time: "9 min ago" },
    { ref: "DRV-ORD4827244", customer: "Funmi Adeyemi", from: "Victoria Island", to: "Ajah", rider: "—", amount: "₦4,100", status: "pending", time: "12 min ago" },
    { ref: "DRV-ORD4827198", customer: "Kelechi Nwosu", from: "Magodo", to: "Ogba", rider: "Musa B.", amount: "₦1,800", status: "assigned", time: "20 min ago" },
    { ref: "DRV-ORD4827102", customer: "Blessing Eze", from: "Yaba", to: "Abeokuta, Ogun", rider: "Sade O.", amount: "₦6,000", status: "completed", time: "41 min ago" },
    { ref: "DRV-ORD4827066", customer: "Guest · Tobi", from: "Gbagada", to: "Maryland", rider: "Tunde A.", amount: "₦2,200", status: "completed", time: "1 hr ago" },
    { ref: "DRV-ORD4826991", customer: "Ngozi Umeh", from: "Ikoyi", to: "Lekki Phase 1", rider: "Chidi E.", amount: "₦2,900", status: "completed", time: "1 hr ago" },
    { ref: "DRV-ORD4826950", customer: "Emeka Obi", from: "Festac", to: "Apapa", rider: "—", amount: "₦2,400", status: "cancelled", time: "2 hr ago" },
];

// ─── Overview ────────────────────────────────────────────────────────────────

export function DashboardScreen() {
    const tiles = [
        { icon: Hourglass, label: "Pending", value: 6, hint: "Awaiting payment or a rider", tone: "bg-gold/20 text-gold-ink", dot: "bg-gold" },
        { icon: Truck, label: "In transit", value: 14, hint: "On the road now", tone: "bg-forest/10 text-forest", dot: "bg-forest" },
        { icon: CheckCircle2, label: "Delivered", value: 38, hint: "Completed today", tone: "bg-emerald/10 text-emerald", dot: "bg-emerald" },
        { icon: XCircle, label: "Cancelled", value: 1, hint: "Cancelled today", tone: "bg-red-100 text-red-600", dot: "bg-red-500" },
    ];
    return (
        <AppShell active="Overview">
            <div className="flex items-end justify-between">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-sage">Tuesday, 29 September</p>
                    <h1 className="mt-0.5 text-[22px] font-extrabold tracking-tight">Good morning, Swiftline Logistics</h1>
                    <p className="text-[12px] text-sage">Here's how your deliveries are doing today.</p>
                </div>
                <div className="flex gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-app-border bg-white px-3.5 py-1.5 text-[12px] font-medium">
                        <SlidersHorizontal size={13} /> Pricing
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-app-border bg-white px-3.5 py-1.5 text-[12px] font-medium">
                        <UserPlus size={13} /> Add rider
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-forest px-3.5 py-1.5 text-[12px] font-semibold text-white">
                        <Plus size={13} /> Create order
                    </span>
                </div>
            </div>

            <div className="mt-5 grid grid-cols-12 gap-4">
                <section className="relative col-span-5 overflow-hidden rounded-2xl bg-forest p-5 text-white">
                    <div className="absolute -right-12 -top-12 size-44 rounded-full bg-lime/25 blur-3xl" />
                    <div className="relative flex items-center gap-2">
                        <span className="grid size-8 place-items-center rounded-xl bg-white/15">
                            <Wallet size={15} />
                        </span>
                        <p className="text-[12px] font-semibold text-white/80">Wallet balance</p>
                    </div>
                    <p className="relative mt-6 text-[38px] font-extrabold tracking-tight">₦1,284,500</p>
                    <p className="relative text-[12px] text-white/70">₦4,920,300 earned in total</p>
                    <span className="relative mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-[12px] font-semibold">
                        Withdraw or view transactions <ArrowRight size={12} />
                    </span>
                </section>
                <section className="col-span-7 rounded-2xl border border-app-border bg-white p-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-[13px] font-bold">Today's operations</h3>
                            <p className="text-[11px] text-sage">59 dispatched today · 14 active right now</p>
                        </div>
                        <LivePill>Live</LivePill>
                    </div>
                    <div className="mt-3 grid grid-cols-4 gap-2.5">
                        {tiles.map(({ icon: Icon, label, value, hint, tone, dot }) => (
                            <div key={label} className="rounded-xl border border-app-border p-3">
                                <div className="flex items-center justify-between">
                                    <span className={cn("grid size-7 place-items-center rounded-lg", tone)}>
                                        <Icon size={13} />
                                    </span>
                                    <span className={cn("size-1.5 rounded-full", dot)} />
                                </div>
                                <p className="mt-2 text-[20px] font-bold">{value}</p>
                                <p className="text-[12px] font-medium">{label}</p>
                                <p className="text-[10px] leading-tight text-sage">{hint}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
                <Panel className="col-span-2" icon={MapPinned} title="Live rider map" subtitle="Where your online riders are right now" badge={<LivePill>9 online</LivePill>}>
                    <div className="h-[250px] overflow-hidden rounded-xl">
                        <CityMap
                            riders={[
                                { x: 180, y: 140, name: "Tunde A." },
                                { x: 420, y: 250, name: "Chidi E.", busy: true },
                                { x: 610, y: 120, name: "Sade O." },
                                { x: 300, y: 390, name: "Musa B.", busy: true },
                                { x: 660, y: 330, name: "Ada K." },
                            ]}
                        />
                    </div>
                </Panel>
                <Panel icon={Users} title="Online riders" subtitle="Ready for new orders">
                    <ul className="space-y-2.5">
                        {[
                            ["Tunde Adewale", "Bike · 2 active", true],
                            ["Chidi Eze", "Bike · 1 active", true],
                            ["Sade Ogun", "Van · available", false],
                            ["Musa Bello", "Bike · 3 active", true],
                            ["Ada Kalu", "Car · available", false],
                        ].map(([name, meta, busy]) => (
                            <li key={name as string} className="flex items-center gap-2.5">
                                <span className="grid size-8 place-items-center rounded-full bg-mint text-[10px] font-bold text-forest">
                                    {(name as string).split(" ").map((p) => p[0]).join("")}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-[12px] font-semibold">{name}</p>
                                    <p className="text-[10px] text-sage">{meta}</p>
                                </div>
                                <span className={cn("size-2 rounded-full", busy ? "bg-gold" : "bg-emerald")} />
                            </li>
                        ))}
                    </ul>
                </Panel>
            </div>
        </AppShell>
    );
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export function OrdersScreen() {
    return (
        <AppShell active="Orders">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-[22px] font-extrabold tracking-tight">Orders</h1>
                    <p className="text-[12px] text-sage">Every delivery, from booking to drop-off.</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-forest px-3.5 py-1.5 text-[12px] font-semibold text-white">
                    <Plus size={13} /> Create order
                </span>
            </div>
            <div className="mt-4 flex gap-2">
                {["All · 212", "Pending · 6", "In transit · 14", "Delivered · 188", "Cancelled · 4"].map((f, i) => (
                    <span key={f} className={cn("rounded-full px-3 py-1 text-[11px] font-semibold", i === 0 ? "bg-forest text-white" : "border border-app-border bg-white text-sage")}>
                        {f}
                    </span>
                ))}
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-app-border bg-white">
                <table className="w-full text-left text-[12px]">
                    <thead className="bg-app-bg text-[10px] uppercase tracking-wider text-sage">
                        <tr>
                            {["Reference", "Customer", "Route", "Rider", "Amount", "Status", ""].map((h) => (
                                <th key={h} className="px-4 py-2.5 font-semibold">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {ORDERS.map((o) => (
                            <tr key={o.ref} className="border-t border-app-border">
                                <td className="px-4 py-3 font-mono text-[11px] font-semibold text-forest">{o.ref}</td>
                                <td className="px-4 py-3">{o.customer}</td>
                                <td className="px-4 py-3 text-sage">
                                    {o.from} <span className="text-forest">→</span> {o.to}
                                </td>
                                <td className="px-4 py-3">{o.rider}</td>
                                <td className="px-4 py-3 font-semibold">{o.amount}</td>
                                <td className="px-4 py-3">
                                    <StatusBadge status={o.status} />
                                </td>
                                <td className="px-4 py-3 text-right text-[10px] text-sage">{o.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppShell>
    );
}

// ─── Delivery pricing ────────────────────────────────────────────────────────

function Toggle({ on }: { on: boolean }) {
    return (
        <span className={cn("relative inline-flex h-4 w-7 rounded-full transition-colors", on ? "bg-emerald" : "bg-app-border")}>
            <span className={cn("absolute top-0.5 size-3 rounded-full bg-white shadow transition-all", on ? "left-3.5" : "left-0.5")} />
        </span>
    );
}

export function PricingScreen() {
    return (
        <AppShell active="Settings">
            <h1 className="text-[22px] font-extrabold tracking-tight">Delivery pricing</h1>
            <p className="text-[12px] text-sage">Set your prices once — every order is quoted automatically.</p>
            <div className="mt-4 grid grid-cols-12 gap-4">
                <div className="col-span-8 grid grid-cols-2 gap-4">
                    <Panel icon={MapIcon} title="Within your city" subtitle="Priced by distance">
                        {[
                            ["0 – 5 km", "₦1,500"],
                            ["5 – 10 km", "₦2,500"],
                            ["10 – 20 km", "₦3,800"],
                            ["20 km +", "₦5,500"],
                        ].map(([range, fee], i) => (
                            <div key={range} className="mb-2 flex items-center gap-2 text-[12px]">
                                <span className="grid size-5 place-items-center rounded-md bg-mint text-[10px] font-bold text-forest">{i + 1}</span>
                                <span className="flex-1 rounded-lg border border-app-border px-2.5 py-1.5">{range}</span>
                                <span className="w-20 rounded-lg border border-app-border px-2.5 py-1.5 font-semibold">{fee}</span>
                            </div>
                        ))}
                        <p className="mt-1 text-[11px] font-semibold text-emerald">+ Add tier</p>
                    </Panel>
                    <Panel icon={Truck} title="To other states" subtitle="A flat price per state">
                        {[
                            ["Lagos", "Home state", true],
                            ["Ogun", "₦6,000", true],
                            ["Oyo", "₦8,500", true],
                            ["FCT Abuja", "₦15,000", true],
                            ["Rivers", "₦14,000", true],
                            ["Kano", "Not delivering", false],
                        ].map(([state, fee, on]) => (
                            <div key={state as string} className="flex items-center justify-between border-b border-app-border py-1.5 text-[12px] last:border-0">
                                <span className="font-medium">{state}</span>
                                <span className="flex items-center gap-2.5">
                                    <span className={cn("text-[11px]", on ? "font-semibold" : "text-sage")}>{fee}</span>
                                    <Toggle on={on as boolean} />
                                </span>
                            </div>
                        ))}
                    </Panel>
                    <Panel className="col-span-2" icon={Scale} title="Extra for heavy packages" badge={<Toggle on />}>
                        <div className="grid grid-cols-3 gap-2 text-[12px]">
                            {[
                                ["Up to 5 kg", "No extra charge"],
                                ["5 – 20 kg", "+ ₦1,000"],
                                ["20 kg +", "+ ₦2,500"],
                            ].map(([w, fee]) => (
                                <div key={w} className="rounded-xl border border-app-border p-2.5">
                                    <p className="text-[11px] text-sage">{w}</p>
                                    <p className="font-semibold">{fee}</p>
                                </div>
                            ))}
                        </div>
                    </Panel>
                </div>
                <div className="col-span-4 rounded-2xl bg-forest p-5 text-white">
                    <p className="text-[13px] font-bold">Price checker</p>
                    <p className="text-[11px] text-white/60">Test your prices before customers see them.</p>
                    <div className="mt-4 space-y-3">
                        {[
                            ["Distance", "8 km"],
                            ["Destination", "Within Lagos"],
                            ["Package weight", "12 kg"],
                        ].map(([label, value]) => (
                            <label key={label} className="block">
                                <span className="text-[10px] text-white/60">{label}</span>
                                <span className="mt-1 block rounded-lg bg-white/10 px-3 py-2 text-[12px] font-semibold">{value}</span>
                            </label>
                        ))}
                    </div>
                    <div className="mt-5 rounded-xl bg-white p-4 text-forest">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-sage">Your delivery fee</p>
                        <p className="text-[28px] font-extrabold">₦3,500</p>
                        <p className="text-[10px] text-sage">Tier 2 · 5 – 10 km + ₦1,000 heavy package</p>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}

// ─── Public storefront ───────────────────────────────────────────────────────

export function StorefrontScreen() {
    return (
        <div className="flex h-full flex-col bg-app-bg text-forest">
            <header className="flex h-14 shrink-0 items-center justify-between border-b border-app-border bg-white px-10">
                <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="" className="h-6" />
                    <span className="text-[11px] text-sage">Business storefront</span>
                </div>
                <div className="flex items-center gap-4 text-[12px] font-semibold text-sage">
                    Track an order
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-forest/20 bg-forest/5 px-3 py-1 text-forest">
                        <Flag size={12} /> Report a problem
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-forest px-3.5 py-1.5 text-white">
                        Book a delivery <ArrowRight size={12} />
                    </span>
                </div>
            </header>
            <section className="relative overflow-hidden bg-forest px-10 py-10 text-white">
                <div className="absolute -right-20 -top-24 size-80 rounded-full bg-lime/25 blur-[90px]" />
                <div className="relative flex items-center gap-8">
                    <div className="grid size-24 shrink-0 place-items-center rounded-3xl bg-white text-[28px] font-black text-forest shadow-xl">SL</div>
                    <div className="flex-1">
                        <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full border border-lime/40 bg-lime/20 px-2.5 py-0.5 text-[11px] font-semibold">
                                <span className="size-1.5 rounded-full bg-lime" /> Open now · closes 20:00
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold">
                                <BadgeCheck size={12} /> Verified business
                            </span>
                        </div>
                        <h1 className="mt-2 text-[34px] font-black tracking-tight">Swiftline Logistics</h1>
                        <p className="text-[13px] text-white/70">Same-day deliveries across Lagos, and to 12 states.</p>
                        <div className="mt-3 flex items-center gap-4 text-[12px]">
                            <span className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} size={13} className="fill-gold text-gold" />
                                ))}
                                <b className="ml-1">4.9</b> <span className="text-white/60">(312 reviews)</span>
                            </span>
                            <span className="flex items-center gap-1.5 text-white/80">
                                <Bike size={14} /> Bike · <Truck size={14} /> Van
                            </span>
                        </div>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3 text-[14px] font-bold text-forest">
                        Book a delivery <ArrowRight size={15} />
                    </span>
                </div>
            </section>
            <div className="grid grid-cols-3 gap-4 px-10 py-6">
                {[
                    { icon: ShieldCheck, title: "Secure payments", text: "Your money is held safely until the delivery is complete — no cash disputes." },
                    { icon: MapPin, title: "Live tracking", text: "Follow your rider in real time from pickup to drop-off." },
                    { icon: BadgeCheck, title: "Verified riders", text: "Every rider is vetted, and every delivery is rated." },
                ].map(({ icon: Icon, title, text }) => (
                    <div key={title} className="rounded-2xl border border-app-border bg-white p-4">
                        <span className="grid size-9 place-items-center rounded-xl bg-emerald/10">
                            <Icon size={16} className="text-emerald" />
                        </span>
                        <p className="mt-3 text-[13px] font-bold">{title}</p>
                        <p className="text-[11px] leading-relaxed text-sage">{text}</p>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-4 px-10">
                {[
                    ["Adaeze O.", "Rider was at my door in 35 minutes and the tracking link was spot on. My go-to now."],
                    ["Guest customer", "Paid online, gave the rider my PIN, done. No back-and-forth about transfers."],
                ].map(([name, text]) => (
                    <div key={name} className="rounded-2xl border border-app-border bg-white p-4">
                        <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} size={11} className="fill-gold text-gold" />
                            ))}
                        </div>
                        <p className="mt-2 text-[12px] leading-relaxed">“{text}”</p>
                        <p className="mt-2 text-[11px] font-semibold text-sage">{name}</p>
                    </div>
                ))}
            </div>
            <div className="mx-10 mt-4 grid grid-cols-3 gap-4 rounded-2xl bg-forest p-5 text-white">
                {[
                    ["01", "Book in minutes", "Tell us where to pick up and deliver. No account needed."],
                    ["02", "See the price, pay securely", "Your payment is held until delivery."],
                    ["03", "Track it live", "Follow your rider until the package arrives."],
                ].map(([n, title, text]) => (
                    <div key={n}>
                        <p className="text-[11px] font-bold text-lime">{n}</p>
                        <p className="text-[13px] font-bold">{title}</p>
                        <p className="text-[11px] text-white/60">{text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Customer tracking ───────────────────────────────────────────────────────

export const JOURNEY = [
    { label: "Order placed", time: "10:02" },
    { label: "Payment confirmed", time: "10:03" },
    { label: "Rider assigned", time: "10:04" },
    { label: "Rider heading to pickup", time: "10:05" },
    { label: "Package picked up", time: "10:19" },
    { label: "On the way", time: "10:21" },
    { label: "Arrived at drop-off", time: "" },
    { label: "Delivered", time: "" },
];

export function TrackingScreen() {
    const current = 5;
    return (
        <div className="flex h-full flex-col bg-app-bg text-forest">
            <header className="flex h-14 shrink-0 items-center justify-between border-b border-app-border bg-white px-10">
                <img src="/logo.png" alt="" className="h-6" />
                <div className="flex w-80 items-center gap-2 rounded-full border border-app-border bg-app-bg px-3.5 py-1.5 font-mono text-[12px]">
                    <Search size={13} className="text-sage" /> DRV-ORD4827315
                </div>
            </header>
            <div className="grid min-h-0 flex-1 grid-cols-12 gap-5 px-10 py-6">
                <div className="col-span-7 flex flex-col gap-4">
                    <section className="rounded-2xl border border-app-border bg-white p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[11px] text-sage">Swiftline Logistics · DRV-ORD4827315</p>
                                <h2 className="mt-1 text-[24px] font-extrabold tracking-tight">Your package is on the way</h2>
                                <p className="text-[12px] text-sage">Lekki Phase 1 → Yaba · arriving in about 18 min</p>
                            </div>
                            <span className="rounded-full bg-forest px-3 py-1 text-[11px] font-bold text-white">On the way</span>
                        </div>
                        <div className="mt-4 flex gap-1">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <span key={i} className={cn("h-1.5 flex-1 rounded-full", i < 3 ? "bg-emerald" : "bg-app-border")} />
                            ))}
                        </div>
                    </section>
                    <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-app-border">
                        <CityMap route movingRider />
                        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 rounded-xl bg-white/95 p-3 shadow-lg backdrop-blur">
                            <span className="grid size-10 place-items-center rounded-full bg-mint text-[12px] font-bold text-forest">TA</span>
                            <div className="flex-1">
                                <p className="text-[13px] font-bold">Tunde Adewale</p>
                                <p className="text-[11px] text-sage">Bike · LSR-482-KJ · ★ 4.9</p>
                            </div>
                            <span className="grid size-9 place-items-center rounded-full bg-emerald text-white">
                                <Phone size={14} />
                            </span>
                        </div>
                    </div>
                </div>
                <section className="col-span-5 rounded-2xl border border-app-border bg-white p-5">
                    <h3 className="mb-4 flex items-center gap-2 text-[13px] font-bold">
                        <span className="grid size-7 place-items-center rounded-lg bg-forest/10">
                            <Clock size={14} className="text-forest" />
                        </span>
                        Delivery timeline
                    </h3>
                    <ol className="relative">
                        <span className="absolute bottom-2 left-[11px] top-2 w-0.5 bg-app-border" />
                        {JOURNEY.map((step, i) => (
                            <li key={step.label} className={cn("relative pb-4 pl-9 last:pb-0", i > current && "opacity-45")}>
                                <span
                                    className={cn(
                                        "absolute left-0 top-0 grid size-6 place-items-center rounded-full ring-4 ring-white",
                                        i <= current ? "bg-emerald" : "bg-[#f3f3f3]",
                                        i === current && "ring-emerald/25",
                                    )}>
                                    {i < current ? <Check size={12} strokeWidth={3} className="text-white" /> : <span className={cn("size-2 rounded-full", i === current ? "bg-white" : "bg-app-border")} />}
                                </span>
                                <p className={cn("text-[12px] font-semibold", i === current && "text-forest")}>{step.label}</p>
                                {step.time && <p className={cn("text-[11px]", i === current ? "font-semibold text-emerald" : "text-sage")}>{step.time}</p>}
                            </li>
                        ))}
                    </ol>
                    <div className="mt-4 rounded-xl bg-mint p-3 text-[11px] text-forest">
                        <p className="font-bold">Your delivery PIN: 4 8 2 7 1 5</p>
                        <p className="text-sage">Give it to the rider only once you have your package.</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
