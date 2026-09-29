import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import SectionCanvas, { BRAND, phase, sceneTime, sectionPointer } from "./SectionCanvas";

const COLS = 200;
const ROWS = 150;
const WIDTH = 26;
const DEPTH = 34;

const vertexShader = /* glsl */ `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uMouseStrength;
    uniform float uSize;
    uniform float uIntro;
    varying float vH;
    varying float vA;

    void main() {
        vec3 p = position;
        float h = sin(p.x * 0.45 + uTime * 0.6) * 0.35
                + sin(p.y * 0.6 - uTime * 0.45) * 0.3
                + sin((p.x + p.y) * 0.9 + uTime * 0.9) * 0.12;

        // Ripples radiating from the cursor, like demand pinging your storefront.
        float d = distance(p.xy, uMouse);
        h += exp(-d * 0.45) * sin(d * 2.8 - uTime * 3.5) * 0.5 * uMouseStrength;

        // Rise out of a flat sheet on first view.
        p.z += h * uIntro;
        vH = h;

        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vA = smoothstep(26.0, 7.0, -mv.z) * smoothstep(1.0, 3.5, -mv.z);
        gl_PointSize = uSize * (1.0 + max(h, 0.0) * 0.8) / -mv.z;
        gl_Position = projectionMatrix * mv;
    }
`;

const fragmentShader = /* glsl */ `
    uniform vec3 uLow;
    uniform vec3 uHigh;
    varying float vH;
    varying float vA;

    void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float a = smoothstep(0.5, 0.05, d);
        float k = smoothstep(-0.3, 0.7, vH);
        gl_FragColor = vec4(mix(uLow, uHigh, k), a * vA * (0.35 + 0.65 * k));
        #include <colorspace_fragment>
    }
`;

function Waves() {
    const points = useRef<THREE.Points>(null);
    const raycaster = useMemo(() => new THREE.Raycaster(), []);
    const ndc = useMemo(() => new THREE.Vector2(), []);
    const plane = useMemo(() => new THREE.Plane(), []);
    const hit = useMemo(() => new THREE.Vector3(), []);
    const mouse = useRef(new THREE.Vector2(0, 0));

    const geometry = useMemo(() => {
        const arr = new Float32Array(COLS * ROWS * 3);
        let i = 0;
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                arr[i++] = (c / (COLS - 1) - 0.5) * WIDTH;
                arr[i++] = (r / (ROWS - 1) - 0.5) * DEPTH;
                arr[i++] = 0;
            }
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
        return g;
    }, []);

    const material = useMemo(
        () =>
            new THREE.ShaderMaterial({
                vertexShader,
                fragmentShader,
                uniforms: {
                    uTime: { value: 0 },
                    uMouse: { value: new THREE.Vector2(0, 0) },
                    uMouseStrength: { value: 0 },
                    uSize: { value: 30 },
                    uIntro: { value: 0 },
                    uLow: { value: new THREE.Color(BRAND.teal) },
                    uHigh: { value: new THREE.Color(BRAND.mint) },
                },
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
            }),
        [],
    );

    useFrame((state) => {
        const t = sceneTime(state);
        const u = material.uniforms;
        u.uTime.value = t;
        u.uIntro.value = phase(t, 0, 2.5);
        u.uSize.value = 0.05 * (state.size.height / state.viewport.height) * state.viewport.dpr * state.camera.position.z;

        // Raycast the pointer onto the sheet, in its local (unrotated) coordinates.
        if (points.current) {
            sectionPointer(state, ndc);
            const over = Math.abs(ndc.x) <= 1 && Math.abs(ndc.y) <= 1;
            raycaster.setFromCamera(ndc, state.camera);
            plane.setFromNormalAndCoplanarPoint(
                new THREE.Vector3(0, 0, 1).applyQuaternion(points.current.quaternion),
                points.current.position,
            );
            if (over && raycaster.ray.intersectPlane(plane, hit)) {
                points.current.worldToLocal(hit);
                mouse.current.lerp(new THREE.Vector2(hit.x, hit.y), 0.08);
            }
            u.uMouse.value.copy(mouse.current);
            u.uMouseStrength.value += ((over ? 1 : 0) - u.uMouseStrength.value) * 0.04;
        }
    });

    return <points ref={points} geometry={geometry} material={material} rotation={[-1.15, 0, 0]} position={[0, -1.2, -4]} frustumCulled={false} />;
}

export default function MarketplaceWaves() {
    return (
        <SectionCanvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <Waves />
        </SectionCanvas>
    );
}
