import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import SectionCanvas, { BRAND, easeOutCubic, glowTexture, phase, pointer, sceneTime, scrolledPast } from "./SectionCanvas";

// ─── Geography ────────────────────────────────────────────────────────────────

const deg = THREE.MathUtils.degToRad;

/** lon 0 faces +z, east is +x, north is +y. */
function latLonToVec3(lat: number, lon: number, r = 1) {
    return new THREE.Vector3(r * Math.cos(deg(lat)) * Math.sin(deg(lon)), r * Math.sin(deg(lat)), r * Math.cos(deg(lat)) * Math.cos(deg(lon)));
}

// Rough [lon, lat] coastlines — enough for the continent to read at dot-matrix resolution.
const AFRICA: [number, number][] = [
    [-17.5, 14.7], [-16.8, 21], [-13, 27.5], [-9.8, 30], [-6, 35.8], [0, 35.8], [10, 37.2], [11, 33.5],
    [20, 30.5], [25, 31.8], [32.3, 31.3], [34.5, 28], [37.5, 18], [43.3, 12.5], [51.2, 11.8], [48, 5],
    [40, -2.5], [39.5, -7], [40.5, -15], [35, -24], [32.5, -28.5], [27, -34], [20, -34.8], [18.4, -34],
    [17.5, -29], [14.5, -22.5], [11.8, -17], [13.5, -11], [12, -5], [9.5, 0], [9.5, 4], [6, 4.3],
    [3.4, 6.4], [-2, 4.8], [-7.5, 4.4], [-13, 8.5], [-16.5, 12.3],
];
const MADAGASCAR: [number, number][] = [[49.3, -12], [50.5, -15.5], [47, -25], [44, -25], [43.3, -21], [44.3, -16], [47, -13.5]];

function insidePolygon(lon: number, lat: number, poly: [number, number][]) {
    let hit = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const [xi, yi] = poly[i];
        const [xj, yj] = poly[j];
        if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) hit = !hit;
    }
    return hit;
}
const isAfrica = (lat: number, lon: number) => insidePolygon(lon, lat, AFRICA) || insidePolygon(lon, lat, MADAGASCAR);

const CITIES: Record<string, [number, number]> = {
    lagos: [6.52, 3.38],
    abuja: [9.08, 7.4],
    kano: [12.0, 8.52],
    accra: [5.6, -0.19],
    dakar: [14.72, -17.47],
    casablanca: [33.57, -7.59],
    cairo: [30.04, 31.24],
    addis: [9.03, 38.74],
    nairobi: [-1.29, 36.82],
    daressalaam: [-6.79, 39.21],
    kinshasa: [-4.44, 15.27],
    luanda: [-8.84, 13.23],
    johannesburg: [-26.2, 28.05],
};

const ROUTES: [string, string][] = [
    ["lagos", "abuja"], ["lagos", "accra"], ["lagos", "kinshasa"], ["lagos", "nairobi"], ["lagos", "johannesburg"],
    ["lagos", "cairo"], ["abuja", "kano"], ["accra", "dakar"], ["dakar", "casablanca"], ["kano", "cairo"],
    ["abuja", "addis"], ["nairobi", "daressalaam"], ["nairobi", "johannesburg"], ["kinshasa", "luanda"], ["cairo", "addis"],
];

// Rotation that turns Africa (≈17°E, 5°N) to face the camera.
const BASE_ROT_Y = -deg(17);
const BASE_ROT_X = deg(5);

// ─── Dot-matrix sphere ────────────────────────────────────────────────────────

function fibonacciDots(count: number, keep?: (lat: number, lon: number) => boolean) {
    const pos: number[] = [];
    const scatter: number[] = [];
    const seed: number[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const x = Math.cos(golden * i) * r;
        const z = Math.sin(golden * i) * r;
        if (keep && !keep(THREE.MathUtils.radToDeg(Math.asin(y)), THREE.MathUtils.radToDeg(Math.atan2(x, z)))) continue;
        const spread = 2.5 + Math.random() * 4;
        pos.push(x, y, z);
        scatter.push(x * spread + (Math.random() - 0.5) * 3, y * spread + (Math.random() - 0.5) * 3, z * spread + (Math.random() - 0.5) * 3);
        seed.push(Math.random());
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geometry.setAttribute("aScatter", new THREE.Float32BufferAttribute(scatter, 3));
    geometry.setAttribute("aSeed", new THREE.Float32BufferAttribute(seed, 1));
    return geometry;
}

const dotVertex = /* glsl */ `
    uniform float uTime;
    uniform float uIntro;
    uniform float uSize;
    uniform float uScan;
    attribute vec3 aScatter;
    attribute float aSeed;
    varying float vAlpha;
    varying float vScan;

    void main() {
        // Each dot flies in from a scattered cloud to its place on the sphere.
        float t = clamp((uIntro - aSeed * 0.45) / 0.55, 0.0, 1.0);
        t = 1.0 - pow(1.0 - t, 3.0);
        vec3 pos = mix(aScatter, position, t);
        vec4 mv = modelViewMatrix * vec4(pos, 1.0);

        // Fade dots on the far hemisphere.
        vec3 n = normalize(normalMatrix * position);
        float facing = smoothstep(-0.1, 0.45, dot(n, normalize(-mv.xyz)));

        // Diagonal scan-lines sweeping across the continent.
        float wave = sin(dot(position, normalize(vec3(1.0, 0.35, 0.2))) * 9.0 - uTime * 1.6);
        vScan = smoothstep(0.93, 1.0, wave) * uScan;

        float twinkle = 0.7 + 0.3 * sin(uTime * 2.2 + aSeed * 60.0);
        vAlpha = mix(1.0, facing, t) * twinkle * (0.25 + 0.75 * t);

        gl_PointSize = uSize * (1.0 + vScan * 0.9) / -mv.z;
        gl_Position = projectionMatrix * mv;
    }
`;

const dotFragment = /* glsl */ `
    uniform vec3 uColor;
    uniform vec3 uHot;
    uniform float uOpacity;
    varying float vAlpha;
    varying float vScan;

    void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float a = smoothstep(0.5, 0.1, d);
        gl_FragColor = vec4(mix(uColor, uHot, vScan), a * vAlpha * uOpacity);
        #include <colorspace_fragment>
    }
`;

function makeDotMaterial(color: string, hot: string, opacity: number, scan: number) {
    return new THREE.ShaderMaterial({
        vertexShader: dotVertex,
        fragmentShader: dotFragment,
        uniforms: {
            uTime: { value: 0 },
            uIntro: { value: 0 },
            uSize: { value: 10 },
            uScan: { value: scan },
            uColor: { value: new THREE.Color(color) },
            uHot: { value: new THREE.Color(hot) },
            uOpacity: { value: opacity },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });
}

// ─── Atmosphere ───────────────────────────────────────────────────────────────

const bodyMaterial = () =>
    new THREE.ShaderMaterial({
        vertexShader: /* glsl */ `
            varying vec3 vN;
            varying vec3 vV;
            void main() {
                vec4 mv = modelViewMatrix * vec4(position, 1.0);
                vN = normalize(normalMatrix * normal);
                vV = normalize(-mv.xyz);
                gl_Position = projectionMatrix * mv;
            }
        `,
        fragmentShader: /* glsl */ `
            uniform vec3 uDeep;
            uniform vec3 uRim;
            varying vec3 vN;
            varying vec3 vV;
            void main() {
                float f = 1.0 - max(dot(normalize(vN), normalize(vV)), 0.0);
                gl_FragColor = vec4(mix(uDeep, uRim, pow(f, 3.0)), 0.72 + 0.28 * f);
                #include <colorspace_fragment>
            }
        `,
        uniforms: { uDeep: { value: new THREE.Color(BRAND.deep) }, uRim: { value: new THREE.Color(BRAND.accent) } },
        transparent: true,
    });

const HALO_SIZE = 5;
const haloMaterial = () =>
    new THREE.ShaderMaterial({
        vertexShader: /* glsl */ `
            varying vec2 vUv;
            void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
        `,
        fragmentShader: /* glsl */ `
            uniform vec3 uColor;
            uniform float uIntro;
            uniform float uTime;
            varying vec2 vUv;
            void main() {
                vec2 p = (vUv - 0.5) * ${HALO_SIZE.toFixed(1)};
                float r = length(p);
                float glow = exp(-max(r - 1.0, 0.0) * 4.0) * smoothstep(0.9, 1.02, r);
                float light = 0.55 + 0.45 * dot(normalize(p + 1e-4), normalize(vec2(-0.6, 0.8)));
                float breathe = 0.9 + 0.1 * sin(uTime * 0.8);
                gl_FragColor = vec4(uColor, glow * light * breathe * uIntro * 0.85);
                #include <colorspace_fragment>
            }
        `,
        uniforms: { uColor: { value: new THREE.Color(BRAND.accent) }, uIntro: { value: 0 }, uTime: { value: 0 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });

// ─── Delivery routes ──────────────────────────────────────────────────────────

const arcMaterial = () =>
    new THREE.ShaderMaterial({
        vertexShader: /* glsl */ `
            varying vec2 vUv;
            void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
        `,
        fragmentShader: /* glsl */ `
            uniform float uHead;
            uniform float uDraw;
            uniform vec3 uColor;
            varying vec2 vUv;
            void main() {
                if (vUv.x > uDraw) discard;
                float d = uHead - vUv.x;
                float trail = d >= 0.0 ? exp(-d * 9.0) : 0.0;
                float head = smoothstep(0.04, 0.0, abs(d));
                vec3 col = mix(uColor, vec3(1.0), head * 0.7);
                gl_FragColor = vec4(col, 0.16 + trail * 0.9);
                #include <colorspace_fragment>
            }
        `,
        uniforms: { uHead: { value: -1 }, uDraw: { value: 0 }, uColor: { value: new THREE.Color(BRAND.accent) } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });

function Routes() {
    const packets = useRef<(THREE.Sprite | null)[]>([]);
    const arcs = useMemo(
        () =>
            ROUTES.map(([a, b], i) => {
                const va = latLonToVec3(...CITIES[a]);
                const vb = latLonToVec3(...CITIES[b]);
                const ctrl = va.clone().add(vb).normalize().multiplyScalar(1 + va.angleTo(vb) * 0.55);
                const curve = new THREE.QuadraticBezierCurve3(va, ctrl, vb);
                return {
                    key: `${a}-${b}`,
                    curve,
                    geometry: new THREE.TubeGeometry(curve, 64, 0.0045, 6, false),
                    material: arcMaterial(),
                    speed: 0.16 + (i % 4) * 0.035,
                    offset: (i * 0.37) % 1,
                };
            }),
        [],
    );
    const packetMaterial = useMemo(
        () =>
            new THREE.SpriteMaterial({
                map: glowTexture(),
                color: BRAND.mint,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
            }),
        [],
    );

    useFrame((state) => {
        const t = sceneTime(state);
        arcs.forEach((arc, i) => {
            const draw = easeOutCubic(phase(t, 1.8 + i * 0.12, 0.9));
            const head = ((t * arc.speed + arc.offset) % 1) * 1.4 - 0.2;
            arc.material.uniforms.uDraw.value = draw;
            arc.material.uniforms.uHead.value = draw >= 1 ? head : -1;

            const packet = packets.current[i];
            if (!packet) return;
            packet.visible = draw >= 1 && head >= 0 && head <= 1;
            if (packet.visible) packet.position.copy(arc.curve.getPoint(head));
        });
    });

    return (
        <>
            {arcs.map((arc, i) => (
                <group key={arc.key}>
                    <mesh geometry={arc.geometry} material={arc.material} renderOrder={2} />
                    <sprite
                        ref={(el) => {
                            packets.current[i] = el;
                        }}
                        material={packetMaterial}
                        scale={0.07}
                        visible={false}
                    />
                </group>
            ))}
        </>
    );
}

function Cities() {
    const rings = useRef<THREE.Mesh[]>([]);
    const cities = useMemo(
        () =>
            Object.entries(CITIES).map(([name, [lat, lon]], i) => {
                const normal = latLonToVec3(lat, lon);
                return {
                    name,
                    hub: name === "lagos",
                    position: normal.clone().multiplyScalar(1.002),
                    quaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal),
                    delay: 1.4 + i * 0.08,
                };
            }),
        [],
    );
    const ringGeometry = useMemo(() => new THREE.RingGeometry(0.018, 0.024, 48), []);

    useFrame((state) => {
        const t = sceneTime(state);
        rings.current.forEach((ring, i) => {
            if (!ring) return;
            const city = cities[Math.floor(i / 2)];
            const appear = phase(t, city.delay, 0.6);
            const p = (t * 0.55 + (i % 2) * 0.5 + city.delay) % 1;
            ring.scale.setScalar((1 + p * (city.hub ? 3.5 : 2.4)) * appear);
            (ring.material as THREE.MeshBasicMaterial).opacity = (1 - p) * 0.8 * appear;
        });
    });

    return (
        <>
            {cities.map((city, ci) => (
                <group key={city.name} position={city.position} quaternion={city.quaternion}>
                    <mesh renderOrder={3}>
                        <circleGeometry args={[city.hub ? 0.02 : 0.012, 24]} />
                        <meshBasicMaterial color={BRAND.mint} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
                    </mesh>
                    {[0, 1].map((r) => (
                        <mesh
                            key={r}
                            ref={(el) => {
                                if (el) rings.current[ci * 2 + r] = el;
                            }}
                            geometry={ringGeometry}
                            renderOrder={3}>
                            <meshBasicMaterial color={BRAND.accent} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
                        </mesh>
                    ))}
                    {city.hub && (
                        <mesh position={[0, 0, 0.16]} rotation={[Math.PI / 2, 0, 0]} renderOrder={3}>
                            <cylinderGeometry args={[0.004, 0.012, 0.32, 12, 1, true]} />
                            <meshBasicMaterial color={BRAND.accent} transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} />
                        </mesh>
                    )}
                </group>
            ))}
        </>
    );
}

// ─── Orbits & star dust ───────────────────────────────────────────────────────

function OrbitRing({ radius, tilt, speed }: { radius: number; tilt: [number, number, number]; speed: number }) {
    const spinner = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (spinner.current) spinner.current.rotation.z = sceneTime(state) * speed;
    });
    return (
        <group rotation={tilt}>
            <mesh>
                <torusGeometry args={[radius, 0.0022, 6, 256]} />
                <meshBasicMaterial color={BRAND.accent} transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
            <group ref={spinner}>
                <sprite position={[radius, 0, 0]} scale={0.14}>
                    <spriteMaterial map={glowTexture()} color={BRAND.mint} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
                </sprite>
            </group>
        </group>
    );
}

function StarDust() {
    const ref = useRef<THREE.Points>(null);
    const positions = useMemo(() => {
        const arr = new Float32Array(900 * 3);
        for (let i = 0; i < arr.length; i += 3) {
            arr[i] = (Math.random() - 0.5) * 24;
            arr[i + 1] = (Math.random() - 0.5) * 14;
            arr[i + 2] = -2 - Math.random() * 10;
        }
        return arr;
    }, []);
    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.z = sceneTime(state) * 0.01;
        ref.current.position.x += (pointer.x * 0.3 - ref.current.position.x) * 0.03;
        ref.current.position.y += (pointer.y * 0.2 - ref.current.position.y) * 0.03;
    });
    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial
                map={glowTexture()}
                color={BRAND.mint}
                size={0.06}
                transparent
                opacity={0.5}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

// ─── Scene ────────────────────────────────────────────────────────────────────

function GlobeScene() {
    const rig = useRef<THREE.Group>(null);
    const globe = useRef<THREE.Group>(null);
    const body = useRef<THREE.Mesh>(null);
    const placed = useRef(false);

    const land = useMemo(() => fibonacciDots(60000, isAfrica), []);
    const ocean = useMemo(() => fibonacciDots(12000), []);
    const landMat = useMemo(() => makeDotMaterial(BRAND.accent, "#ffffff", 1, 1), []);
    const oceanMat = useMemo(() => makeDotMaterial(BRAND.teal, BRAND.accent, 0.55, 0.4), []);
    const bodyMat = useMemo(bodyMaterial, []);
    const haloMat = useMemo(haloMaterial, []);

    useFrame((state, delta) => {
        if (!rig.current || !globe.current || !body.current) return;
        const dt = Math.min(delta, 0.1);
        const t = sceneTime(state);
        const { viewport, size, camera } = state;
        const intro = phase(t, 0, 2.6);
        const scroll = scrolledPast(state);

        // Layout: right-hand side on desktop, tucked under the copy on small screens.
        const wide = size.width >= 1024;
        const baseScale = wide ? Math.min(viewport.height * 0.32, viewport.width * 0.2) : Math.min(viewport.width * 0.42, viewport.height * 0.22);
        const target = new THREE.Vector3(wide ? viewport.width * 0.25 : 0, (wide ? 0 : -viewport.height * 0.25) + scroll * viewport.height * 0.35, 0);
        const targetScale = baseScale * (1 + scroll * 0.25);
        if (!placed.current) {
            rig.current.position.copy(target);
            rig.current.scale.setScalar(targetScale);
            placed.current = true;
        }
        rig.current.position.x = THREE.MathUtils.damp(rig.current.position.x, target.x, 3, dt);
        rig.current.position.y = THREE.MathUtils.damp(rig.current.position.y, target.y, 3, dt);
        rig.current.scale.setScalar(THREE.MathUtils.damp(rig.current.scale.x, targetScale, 3, dt));

        // Spin into place, then drift gently and lean toward the pointer.
        const introSpin = (1 - easeOutCubic(intro)) * 2.4;
        const rotY = BASE_ROT_Y - introSpin + Math.sin(t * 0.12) * 0.3 + pointer.x * 0.25 + scroll * 0.9;
        const rotX = BASE_ROT_X - pointer.y * 0.12 + scroll * 0.3;
        globe.current.rotation.y = THREE.MathUtils.damp(globe.current.rotation.y, rotY, 2.5, dt);
        globe.current.rotation.x = THREE.MathUtils.damp(globe.current.rotation.x, rotX, 2.5, dt);

        body.current.scale.setScalar(0.995 * easeOutCubic(phase(t, 0.3, 1.8)));

        // Dot size tracks the globe's on-screen size so density stays constant.
        const pxPerUnit = (size.height / viewport.height) * rig.current.scale.x * viewport.dpr * camera.position.z;
        for (const [mat, k] of [
            [landMat, 0.009],
            [oceanMat, 0.006],
        ] as const) {
            mat.uniforms.uTime.value = t;
            mat.uniforms.uIntro.value = intro;
            mat.uniforms.uSize.value = k * pxPerUnit;
        }
        haloMat.uniforms.uTime.value = t;
        haloMat.uniforms.uIntro.value = easeOutCubic(phase(t, 0.8, 1.6));
    });

    return (
        <>
            <StarDust />
            <group ref={rig}>
                <mesh material={haloMat} renderOrder={1}>
                    <planeGeometry args={[HALO_SIZE, HALO_SIZE]} />
                </mesh>
                <group ref={globe} rotation={[BASE_ROT_X, BASE_ROT_Y - 2.4, 0]}>
                    <mesh ref={body} material={bodyMat} renderOrder={0} scale={0}>
                        <sphereGeometry args={[1, 64, 64]} />
                    </mesh>
                    <points geometry={ocean} material={oceanMat} frustumCulled={false} renderOrder={1} />
                    <points geometry={land} material={landMat} frustumCulled={false} renderOrder={1} />
                    <Cities />
                    <Routes />
                </group>
                <OrbitRing radius={1.38} tilt={[1.25, 0.25, 0]} speed={0.35} />
                <OrbitRing radius={1.62} tilt={[1.9, -0.45, 0.35]} speed={-0.22} />
            </group>
        </>
    );
}

export default function HeroGlobe() {
    return (
        // Desktop only: on narrow screens the globe competes with the copy.
        <SectionCanvas className="hidden lg:block">
            <GlobeScene />
        </SectionCanvas>
    );
}
