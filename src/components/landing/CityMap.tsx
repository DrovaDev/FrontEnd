import { cn } from "@/lib/utils";

// Stylised city map used inside the product screens (live rider map, tracking, rider app).
const ROADS = [
    "M-20 120 C 120 110, 220 150, 360 130 S 620 90, 820 120",
    "M-20 260 C 140 250, 260 280, 420 262 S 640 230, 820 250",
    "M120 -20 C 110 90, 150 200, 130 320 S 110 480, 140 520",
    "M340 -20 C 330 120, 380 220, 360 340 S 340 460, 370 520",
    "M600 -20 C 590 100, 620 200, 610 320 S 600 460, 620 520",
    "M-20 400 C 160 380, 320 420, 500 390 S 700 370, 820 395",
];
const MINOR = [
    "M40 -20 L 60 520",
    "M240 -20 L 250 520",
    "M480 -20 L 470 520",
    "M720 -20 L 700 520",
    "M-20 40 L 820 60",
    "M-20 190 L 820 180",
    "M-20 330 L 820 320",
    "M-20 470 L 820 460",
];

export const ROUTE = "M130 330 C 150 260, 250 262, 360 262 S 470 180, 610 130";

type Rider = { x: number; y: number; name: string; busy?: boolean };

export default function CityMap({
    riders = [],
    route = false,
    movingRider = false,
    className,
}: {
    riders?: Rider[];
    route?: boolean;
    movingRider?: boolean;
    className?: string;
}) {
    return (
        <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className={cn("h-full w-full", className)} aria-hidden>
            <rect width="800" height="500" fill="#eef4ec" />
            {/* Lagoon & parks */}
            <path d="M-20 440 C 120 420, 260 470, 420 450 S 700 420, 820 450 L 820 520 L -20 520 Z" fill="#cfe6f2" />
            <path d="M660 300 q 60 -20 90 30 q 10 50 -60 60 q -60 -10 -30 -90Z" fill="#dcefd2" />
            <path d="M170 40 q 70 -10 90 40 q -10 40 -70 40 q -50 -20 -20 -80Z" fill="#dcefd2" />
            {MINOR.map((d) => (
                <path key={d} d={d} stroke="#ffffff" strokeWidth="5" fill="none" opacity="0.8" />
            ))}
            {ROADS.map((d) => (
                <path key={d} d={d} stroke="#ffffff" strokeWidth="13" fill="none" strokeLinecap="round" />
            ))}
            {ROADS.slice(0, 2).map((d) => (
                <path key={`hl-${d}`} d={d} stroke="#f6e7a6" strokeWidth="4" fill="none" strokeLinecap="round" />
            ))}

            {route && (
                <>
                    <path d={ROUTE} stroke="#00a651" strokeOpacity="0.25" strokeWidth="14" fill="none" strokeLinecap="round" />
                    <path d={ROUTE} stroke="#00a651" strokeWidth="5" fill="none" strokeLinecap="round" strokeDasharray="1 10">
                        <animate attributeName="stroke-dashoffset" from="0" to="-22" dur="0.8s" repeatCount="indefinite" />
                    </path>
                    <g transform="translate(130 330)">
                        <circle r="11" fill="#004030" />
                        <circle r="4" fill="#fff" />
                    </g>
                    <g transform="translate(610 130)">
                        <path d="M0 0 C -14 -18, -14 -34, 0 -34 C 14 -34, 14 -18, 0 0Z" fill="#ddc52f" stroke="#004030" strokeWidth="2" />
                        <circle cy="-22" r="5" fill="#004030" />
                    </g>
                </>
            )}

            {movingRider && (
                <g>
                    <circle r="20" fill="#00a651" opacity="0.2">
                        <animate attributeName="r" values="12;26;12" dur="2s" repeatCount="indefinite" />
                        <animateMotion dur="9s" repeatCount="indefinite" path={ROUTE} />
                    </circle>
                    <g>
                        <circle r="10" fill="#00a651" stroke="#fff" strokeWidth="3" />
                        <animateMotion dur="9s" repeatCount="indefinite" path={ROUTE} />
                    </g>
                </g>
            )}

            {riders.map((r, i) => (
                <g key={r.name} transform={`translate(${r.x} ${r.y})`}>
                    <circle r="16" fill={r.busy ? "#ddc52f" : "#00a651"} opacity="0.22">
                        <animate attributeName="r" values="10;22;10" dur={`${2 + (i % 3) * 0.4}s`} repeatCount="indefinite" />
                    </circle>
                    <circle r="8" fill={r.busy ? "#ddc52f" : "#00a651"} stroke="#fff" strokeWidth="3" />
                    <g transform="translate(0 -30)">
                        <rect x="-34" y="-11" width="68" height="20" rx="10" fill="#004030" />
                        <text y="3.5" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff" fontFamily="Montserrat, sans-serif">
                            {r.name}
                        </text>
                    </g>
                </g>
            ))}
        </svg>
    );
}
