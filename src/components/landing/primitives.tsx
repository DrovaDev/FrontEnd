import type { ReactNode } from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

export const WAITLIST_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSfY2JH5IuPygrrjdgvSR8Wwu6Bh9aPIsOuVdl-BsY6fR6jFBw/viewform?usp=dialog";

const EASE = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export const stagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

/** Fades its children up once they scroll into view. */
export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay, ease: EASE }}>
            {children}
        </motion.div>
    );
}

/** Staggers direct `motion` children that use the `fadeUp` variant. */
export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <motion.div className={className} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
            {children}
        </motion.div>
    );
}

export function Eyebrow({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "dark" }) {
    return (
        <span className={cn("inline-flex items-center gap-2 text-[13px] font-semibold", tone === "dark" ? "text-lime" : "text-emerald")}>
            <span className={cn("size-1.5 rounded-full", tone === "dark" ? "bg-lime" : "bg-emerald")} />
            {children}
        </span>
    );
}

export function SectionHeading({
    eyebrow,
    title,
    subtitle,
    tone = "light",
    align = "center",
    className,
}: {
    eyebrow: ReactNode;
    title: ReactNode;
    subtitle?: ReactNode;
    tone?: "light" | "dark";
    align?: "center" | "left";
    className?: string;
}) {
    return (
        <Reveal className={cn(align === "center" && "md:mx-auto md:text-center", "max-w-3xl", className)}>
            <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
            <h2
                className={cn(
                    "mt-3 text-[2.05rem] leading-[1.08] md:mt-4 md:text-5xl md:leading-[1.05] lg:text-[3.25rem] font-bold tracking-[-0.035em] text-balance",
                    tone === "dark" ? "text-white" : "text-forest",
                )}>
                {title}
            </h2>
            {subtitle && (
                <p className={cn("mt-4 text-base leading-relaxed text-pretty md:mt-5 md:text-xl md:leading-relaxed", tone === "dark" ? "text-white/60" : "text-sage", align === "center" && "md:mx-auto md:max-w-2xl")}>
                    {subtitle}
                </p>
            )}
        </Reveal>
    );
}

/** Desktop browser chrome around a product screen. */
export function BrowserFrame({ url, children, className }: { url: string; children: ReactNode; className?: string }) {
    return (
        <div className={cn("overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl shadow-forest/25", className)}>
            <div className="flex items-center gap-3 border-b border-app-border bg-[#f1f4f1] px-4 py-2.5">
                <div className="flex gap-1.5">
                    <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="size-2.5 rounded-full bg-[#febc2e]" />
                    <span className="size-2.5 rounded-full bg-[#28c840]" />
                </div>
                <div className="mx-auto flex max-w-sm flex-1 items-center justify-center gap-1.5 truncate rounded-md bg-white px-3 py-1 text-[11px] text-sage">
                    <svg viewBox="0 0 16 16" className="size-3 shrink-0 fill-emerald" aria-hidden>
                        <path d="M8 1a4 4 0 0 0-4 4v2H3v8h10V7h-1V5a4 4 0 0 0-4-4Zm-2 6V5a2 2 0 1 1 4 0v2H6Z" />
                    </svg>
                    <span className="truncate">{url}</span>
                </div>
                <div className="w-10" />
            </div>
            {children}
        </div>
    );
}

/** Phone chrome around a mobile screen. */
export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={cn("relative w-[280px] rounded-[2.6rem] border-[10px] border-forest-deep bg-forest-deep shadow-2xl shadow-forest/40", className)}>
            <div className="absolute left-1/2 top-1.5 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-forest-deep" />
            <div className="relative h-[560px] overflow-hidden rounded-[2rem] bg-white">{children}</div>
        </div>
    );
}
