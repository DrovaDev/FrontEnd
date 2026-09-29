import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

// Brand assets from the Drova brand guide. The logo PNG is used as a mask so it can be
// rendered in the guide's single-colour variants (lime or white on forest, forest on lime).

const LOGO_RATIO = 1510 / 646;

function masked(src: string, extra?: CSSProperties): CSSProperties {
    return {
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "left center",
        maskPosition: "left center",
        ...extra,
    };
}

/** Drova wordmark. Colour it with a `bg-*` class, e.g. `bg-lime` on forest backgrounds. */
export function Logo({ className, height = 28 }: { className?: string; height?: number }) {
    return <span role="img" aria-label="Drova" className={cn("inline-block shrink-0", className)} style={masked("/logo.png", { height, width: height * LOGO_RATIO })} />;
}

/** The van-D brand mark on its own. */
export function BrandMark({ className, size = 32 }: { className?: string; size?: number }) {
    return <span aria-hidden className={cn("inline-block shrink-0", className)} style={masked("/brand-mark.png", { height: size, width: size * (415 / 390) })} />;
}

/**
 * The brand pattern: the mark tiled on a diagonal (brand guide, page 9).
 * Colour it with a `bg-*` class; it fills its positioned parent and drifts slowly.
 */
export function BrandPattern({ className, tile = 96 }: { className?: string; tile?: number }) {
    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
                className={cn("absolute -inset-1/2 animate-pattern-drift motion-reduce:animate-none", className)}
                style={{
                    WebkitMaskImage: "url(/brand-mark.png)",
                    maskImage: "url(/brand-mark.png)",
                    WebkitMaskSize: `${tile}px auto`,
                    maskSize: `${tile}px auto`,
                    WebkitMaskRepeat: "repeat",
                    maskRepeat: "repeat",
                    transform: "rotate(-18deg)",
                    ["--tile" as string]: `${tile}px`,
                }}
            />
        </div>
    );
}
