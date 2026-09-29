import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import SectionCanvas, { BRAND, clamp01, easeOutBack, glowTexture, sceneTime, sectionProgress } from "./SectionCanvas";

const FOG = "#f5f9f3"; // matches the section background (app-bg)
// Aim high so the route runs along the bottom of the section, below the step copy.
const LOOK_AT = new THREE.Vector3(0, 1.9, 0);
// Phones: the section is tall and the stage card fills its middle, so aim almost level —
// that drops the route to the bottom of the section, below the card.
const LOOK_AT_NARROW = new THREE.Vector3(0, 2.02, 0);
const ROUTE_Z = -1;

const routeMaterial = () =>
    new THREE.ShaderMaterial({
        vertexShader: /* glsl */ `
            varying vec2 vUv;
            void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
        `,
        fragmentShader: /* glsl */ `
            uniform float uDraw;
            uniform float uVan;
            uniform float uTime;
            uniform vec3 uDone;
            uniform vec3 uAhead;
            varying vec2 vUv;
            void main() {
                if (vUv.x > uDraw) discard;
                bool done = vUv.x < uVan;
                float dash = step(0.45, fract(vUv.x * 70.0 - uTime * 0.8));
                float a = done ? 0.95 : dash * 0.6;
                a *= smoothstep(0.0, 0.04, vUv.x) * smoothstep(1.0, 0.96, vUv.x);
                gl_FragColor = vec4(done ? uDone : uAhead, a);
                #include <colorspace_fragment>
            }
        `,
        uniforms: {
            uDraw: { value: 0 },
            uVan: { value: 0 },
            uTime: { value: 0 },
            uDone: { value: new THREE.Color(BRAND.accent) },
            uAhead: { value: new THREE.Color(BRAND.teal) },
        },
        transparent: true,
        depthWrite: false,
    });

function Journey() {
    const camera = useThree((s) => s.camera);
    const viewport = useThree((s) => s.viewport);
    const van = useRef<THREE.Group>(null);
    const pins = useRef<(THREE.Group | null)[]>([]);
    const pulses = useRef<(THREE.Mesh | null)[]>([]);
    const draw = useRef(0);

    const narrow = useThree((s) => s.size.width < 768);

    useLayoutEffect(() => {
        camera.lookAt(narrow ? LOOK_AT_NARROW : LOOK_AT);
    }, [camera, narrow]);

    // Width of the ground plane at the route's depth, so the pins sit roughly under the three step columns.
    const halfW = useMemo(() => viewport.getCurrentViewport(camera, new THREE.Vector3(0, 0, ROUTE_Z)).width / 2, [viewport, camera]);

    const { curve, geometry, pinU } = useMemo(() => {
        const a = Math.min(halfW * 0.62, 3.2);
        const pts = [
            new THREE.Vector3(-halfW - 2, 0, ROUTE_Z + 0.5),
            new THREE.Vector3(-a, 0, ROUTE_Z),
            new THREE.Vector3(-a * 0.45, 0, ROUTE_Z + 0.5),
            new THREE.Vector3(0, 0, ROUTE_Z),
            new THREE.Vector3(a * 0.45, 0, ROUTE_Z - 0.5),
            new THREE.Vector3(a, 0, ROUTE_Z),
            new THREE.Vector3(halfW + 2, 0, ROUTE_Z + 0.3),
        ];
        const c = new THREE.CatmullRomCurve3(pts, false, "centripetal");
        // Tube UVs run by arc length, so convert each pin's control-point index into arc-length u.
        const lengths = c.getLengths(600);
        const total = lengths[lengths.length - 1];
        const u = [1, 3, 5].map((i) => lengths[Math.round((i / (pts.length - 1)) * 600)] / total);
        return { curve: c, geometry: new THREE.TubeGeometry(c, 400, 0.035, 8, false), pinU: u };
    }, [halfW]);

    const material = useMemo(routeMaterial, []);
    const vanGeometry = useMemo(() => new RoundedBoxGeometry(0.34, 0.22, 0.24, 3, 0.04), []);

    const ground = useMemo(() => {
        const arr: number[] = [];
        for (let x = -12; x <= 12; x += 0.22) for (let z = -7; z <= 1.8; z += 0.22) arr.push(x, 0, z);
        return new Float32Array(arr);
    }, []);

    useFrame((state) => {
        const t = sceneTime(state);
        // Route draws itself as the section scrolls into view.
        const target = clamp01(sectionProgress(state) * 2.2 - 0.35);
        draw.current += (target - draw.current) * 0.06;
        const vanU = Math.min((t / 11) % 1, draw.current);

        material.uniforms.uDraw.value = draw.current;
        material.uniforms.uVan.value = vanU;
        material.uniforms.uTime.value = t;

        if (van.current) {
            const pos = curve.getPointAt(vanU);
            const ahead = curve.getPointAt(Math.min(vanU + 0.002, 1));
            van.current.position.copy(pos);
            van.current.lookAt(ahead);
            van.current.visible = draw.current > 0.02;
            van.current.children[0].position.y = 0.13 + Math.abs(Math.sin(t * 9)) * 0.015;
        }

        pinU.forEach((u, i) => {
            const pin = pins.current[i];
            if (pin) pin.scale.setScalar(easeOutBack((draw.current - u) * 6));
            const pulse = pulses.current[i];
            if (pulse) {
                const p = (t * 0.6 + i * 0.33) % 1;
                pulse.scale.setScalar(1 + p * 2.5);
                (pulse.material as THREE.MeshBasicMaterial).opacity = (1 - p) * 0.5 * (draw.current > u ? 1 : 0);
            }
        });
    });

    return (
        <>
            <points>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[ground, 3]} />
                </bufferGeometry>
                <pointsMaterial map={glowTexture()} color={BRAND.teal} size={0.045} transparent opacity={0.35} depthWrite={false} />
            </points>

            <mesh geometry={geometry} material={material} />

            {pinU.map((u, i) => {
                const p = curve.getPointAt(u);
                return (
                    <group key={i} position={p}>
                        <group
                            ref={(el) => {
                                pins.current[i] = el;
                            }}
                            scale={0}>
                            <mesh position={[0, 0.16, 0]}>
                                <cylinderGeometry args={[0.012, 0.012, 0.3, 8]} />
                                <meshStandardMaterial color={BRAND.teal} />
                            </mesh>
                            <mesh position={[0, 0.36, 0]}>
                                <sphereGeometry args={[0.1, 32, 32]} />
                                <meshStandardMaterial color={BRAND.accent} emissive={BRAND.accent} emissiveIntensity={0.35} roughness={0.3} />
                            </mesh>
                        </group>
                        <mesh
                            ref={(el) => {
                                pulses.current[i] = el;
                            }}
                            rotation={[-Math.PI / 2, 0, 0]}
                            position={[0, 0.01, 0]}>
                            <ringGeometry args={[0.1, 0.13, 48]} />
                            <meshBasicMaterial color={BRAND.accent} transparent depthWrite={false} />
                        </mesh>
                    </group>
                );
            })}

            <group ref={van} visible={false}>
                <mesh geometry={vanGeometry} position={[0, 0.13, 0]}>
                    <meshStandardMaterial color={BRAND.accent} roughness={0.35} />
                </mesh>
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
                    <circleGeometry args={[0.28, 32]} />
                    <meshBasicMaterial color={BRAND.teal} transparent opacity={0.12} depthWrite={false} />
                </mesh>
            </group>
        </>
    );
}

export default function RouteJourney() {
    return (
        <SectionCanvas camera={{ position: [0, 2.2, 6], fov: 40 }}>
            <fog attach="fog" args={[FOG, 5, 13]} />
            <ambientLight intensity={1.2} />
            <directionalLight position={[2, 6, 4]} intensity={2} />
            <Journey />
        </SectionCanvas>
    );
}
