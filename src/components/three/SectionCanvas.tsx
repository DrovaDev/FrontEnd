import { useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, type RootState } from "@react-three/fiber";
import * as THREE from "three";

// ─── Brand palette (matches --primary / --accent in styles.css) ───────────────

export const BRAND = {
    accent: "#6abd45", // brand secondary (lime)
    mint: "#c8ebb5", // light lime tint, for glints
    teal: "#00a651", // brand emerald
    deep: "#002b20", // deep forest
    gold: "#ddc52f", // brand gold
};

// ─── Shared helpers ───────────────────────────────────────────────────────────

export const REDUCED_MOTION =
    typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Scene clock. Reduced-motion users get finished intros and a heavily slowed loop. */
export function sceneTime(state: RootState) {
    const t = state.clock.elapsedTime;
    return REDUCED_MOTION ? 60 + t * 0.15 : t;
}

export const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
export const easeOutCubic = (v: number) => 1 - Math.pow(1 - clamp01(v), 3);
export const easeOutBack = (v: number) => {
    const x = clamp01(v);
    return 1 + 2.7 * Math.pow(x - 1, 3) + 1.7 * Math.pow(x - 1, 2);
};

/** 0 → 1 over [delay, delay + duration] seconds of scene time. */
export const phase = (t: number, delay: number, duration: number) => clamp01((t - delay) / duration);

/** Pointer in window pixels. Canvases are pointer-events-none, so we listen on window. */
export const pointer = { clientX: -9999, clientY: -9999, x: 0, y: 0 };
if (typeof window !== "undefined") {
    window.addEventListener(
        "pointermove",
        (e) => {
            pointer.clientX = e.clientX;
            pointer.clientY = e.clientY;
            pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
            pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
        },
        { passive: true },
    );
}

/** Pointer in the canvas' own NDC space (-1..1), for raycasting into a section's scene. */
export function sectionPointer(state: RootState, out = new THREE.Vector2()) {
    const r = state.gl.domElement.getBoundingClientRect();
    return out.set(((pointer.clientX - r.left) / r.width) * 2 - 1, -((pointer.clientY - r.top) / r.height) * 2 + 1);
}

/** 0 when the section's top enters the bottom of the viewport, 1 when its bottom leaves the top. */
export function sectionProgress(state: RootState) {
    const r = state.gl.domElement.getBoundingClientRect();
    return clamp01((window.innerHeight - r.top) / (window.innerHeight + r.height));
}

/** 0 at rest, 1 once the section has scrolled fully out the top. */
export function scrolledPast(state: RootState) {
    const r = state.gl.domElement.getBoundingClientRect();
    return clamp01(-r.top / r.height);
}

let glowTex: THREE.Texture | null = null;
/** Soft radial sprite used for glows, packets and star dust. */
export function glowTexture() {
    if (glowTex) return glowTex;
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, "rgba(255,255,255,1)");
    grd.addColorStop(0.18, "rgba(255,255,255,0.85)");
    grd.addColorStop(0.45, "rgba(255,255,255,0.18)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    glowTex = new THREE.CanvasTexture(c);
    glowTex.colorSpace = THREE.SRGBColorSpace;
    return glowTex;
}

// ─── Section canvas ───────────────────────────────────────────────────────────

type SectionCanvasProps = {
    children: ReactNode;
    className?: string;
    camera?: { position?: [number, number, number]; fov?: number };
};

/**
 * Full-bleed WebGL layer for a section. The canvas is created only once the section
 * nears the viewport, and stops rendering whenever it is scrolled out of view.
 * Place it inside a `relative` section, before content that sits at `relative z-10`.
 */
export default function SectionCanvas({ children, className = "", camera }: SectionCanvasProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                setVisible(entry.isIntersecting);
                if (entry.isIntersecting) setMounted(true);
            },
            { rootMargin: "200px 0px" },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} aria-hidden className={`absolute inset-0 pointer-events-none ${className}`}>
            {mounted && (
                <Canvas
                    dpr={[1, 1.75]}
                    gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                    camera={{ position: camera?.position ?? [0, 0, 6], fov: camera?.fov ?? 40 }}
                    frameloop={visible ? "always" : "never"}>
                    {children}
                </Canvas>
            )}
        </div>
    );
}
