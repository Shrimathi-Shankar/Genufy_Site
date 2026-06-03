import { Suspense, Component, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

/* ---------------- Earth textures ---------------- */
const TEX = {
  map: 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
  night: 'https://unpkg.com/three-globe/example/img/earth-night.jpg',
  bump: 'https://unpkg.com/three-globe/example/img/earth-topology.png',
  clouds: 'https://unpkg.com/three-globe/example/img/earth-water.png',
};

const EARTH_R = 28;
const EARTH_Y = -42;  // only the top quarter of Earth peeks above the bottom edge
const CAM_Z = 22;

/* ---------------- Error boundary ---------------- */
class FeatureBoundary extends Component {
  constructor(p) { super(p); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(e) { console.warn('[hero] feature disabled:', e); }
  render() { return this.state.failed ? (this.props.fallback ?? null) : this.props.children; }
}

/* ---------------- Earth ---------------- */
function FallbackEarth() {
  return (
    <mesh>
      <sphereGeometry args={[EARTH_R, 96, 96]} />
      <meshStandardMaterial color="#0b3a52" roughness={0.9} metalness={0.05} emissive="#062234" emissiveIntensity={0.5} />
    </mesh>
  );
}

function TexturedEarth() {
  const [map, night, bump, clouds] = useLoader(
    THREE.TextureLoader,
    [TEX.map, TEX.night, TEX.bump, TEX.clouds],
    (loader) => { loader.setCrossOrigin('anonymous'); }
  );
  const cloudsRef = useRef();

  useMemo(() => {
    [map, night].forEach((t) => t && (t.colorSpace = THREE.SRGBColorSpace));
    [map, night, bump, clouds].forEach((t) => t && (t.anisotropy = 8));
  }, [map, night, bump, clouds]);

  useFrame((_, dt) => {
    if (cloudsRef.current) cloudsRef.current.rotation.y += dt * 0.012;
  });

  return (
    <>
      <mesh>
        <sphereGeometry args={[EARTH_R, 128, 128]} />
        <meshStandardMaterial
          map={map}
          color="#0a2440"
          bumpMap={bump}
          bumpScale={0.12}
          emissiveMap={night}
          emissive="#ffb347"
          emissiveIntensity={2.6}
          roughness={1}
          metalness={0}
        />
      </mesh>
      <mesh ref={cloudsRef} scale={1.012}>
        <sphereGeometry args={[EARTH_R, 96, 96]} />
        <meshStandardMaterial
          map={clouds}
          transparent
          opacity={0.18}
          depthWrite={false}
          roughness={1}
        />
      </mesh>
    </>
  );
}

/* Atmosphere — Fresnel rim that shifts blue (left) → cyan → green (right) */
function Atmosphere() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        opacity: 0,
        side: THREE.BackSide,
        blending: THREE.NormalBlending,
        depthWrite: false,
        uniforms: {},
        vertexShader: `
          varying vec3 vN; varying vec3 vView; varying vec3 vWorld;
          void main(){
            vec4 wp = modelMatrix * vec4(position,1.0);
            vWorld = wp.xyz;
            vec4 mv = modelViewMatrix * vec4(position,1.0);
            vN = normalize(normalMatrix * normal);
            vView = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: `
          varying vec3 vN; varying vec3 vView; varying vec3 vWorld;
          uniform vec3 uBlue; uniform vec3 uCyan; uniform vec3 uGreen;
          void main(){
            float fres = pow(1.0 - max(dot(vN, vView), 0.0), 2.2);
            float t = clamp((vWorld.x + ${EARTH_R}.0) / ${EARTH_R * 2}.0, 0.0, 1.0);
            vec3 col = mix(uBlue, uCyan, smoothstep(0.0, 0.55, t));
            col = mix(col, uGreen, smoothstep(0.55, 1.0, t));
            gl_FragColor = vec4(col * fres * 2.2, fres * 1.1);
          }`,
      }),
    []
  );
  return (
    <mesh scale={1.04}>
      <sphereGeometry args={[EARTH_R, 96, 96]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

function EarthSystem() {
  const rotateRef = useRef();
  useFrame((_, dt) => {
    if (rotateRef.current) rotateRef.current.rotation.y += dt * 0.04;
  });
  return (
    <group position={[0, EARTH_Y, 0]} rotation={[0.28, 0, 0.05]}>
      <group ref={rotateRef}>
        <FeatureBoundary fallback={<FallbackEarth />}>
          <Suspense fallback={<FallbackEarth />}>
            <TexturedEarth />
          </Suspense>
        </FeatureBoundary>
      </group>
      <FeatureBoundary><Atmosphere /></FeatureBoundary>
    </group>
  );
}

/* ---------------- Camera breathing + mouse parallax ---------------- */
function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    const breath = Math.sin(t * 0.35) * 0.5;
    const tx = mouse.current.x * 0.6;
    const ty = -mouse.current.y * 0.4;
    camera.position.x += (tx - camera.position.x) * 0.04;
    camera.position.y += (1.6 + ty + breath * 0.2 - camera.position.y) * 0.04;
    camera.position.z = CAM_Z + breath;
  });
  return null;
}

/* ---------------- 3D Scene ---------------- */
function Scene() {
  return (
    <>
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 40, 90]} />

      <ambientLight intensity={0.12} />
      <hemisphereLight args={['#1f6bff', '#02060f', 0.18]} />
      {/* Sun behind/below Earth — visible face stays in shadow (night side) */}
      <directionalLight position={[-12, -18, -30]} intensity={1.4} color="#cfe3ff" />
      {/* Lateral rim accents — feed the blue/green horizon glow */}
      <pointLight position={[26, 6, 10]} intensity={220} distance={90} color="#27ff9e" />
      <pointLight position={[-26, 8, 10]} intensity={220} distance={90} color="#2f7bff" />

      <Stars radius={120} depth={60} count={3500} factor={3} saturation={0} fade speed={0.4} />

      <EarthSystem />
      <CameraRig />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.4}
        autoRotate
        autoRotateSpeed={0.12}
        target={[0, -10, 0]}
        minPolarAngle={Math.PI * 0.46}
        maxPolarAngle={Math.PI * 0.54}
        minAzimuthAngle={-0.35}
        maxAzimuthAngle={0.35}
      />
    </>
  );
}

/* =========================================================
   SVG decoration layer — crisp rim, neural constellation
   (left), and flowing parallel curves (left + right).
   ========================================================= */

const VB_W = 1600;
const VB_H = 900;

function Decorations() {
  const stars = useMemo(
    () =>
      Array.from({ length: 150 }, () => ({
        x: Math.random() * VB_W,
        y: Math.random() * (VB_H * 0.78),
        r: Math.random() * 1.2 + 0.3,
        o: Math.random() * 0.6 + 0.25,
        d: Math.random() * 4,
      })),
    []
  );

  // Left-side blue constellation — calm, in-place floating accent (no sliding).
  const { nodes: lNodes, links: lLinks } = useMemo(() => {
    const nodes = Array.from({ length: 22 }, (_, i) => ({
      x: 20 + Math.random() * 360,
      y: 60 + Math.random() * 520,
      r: Math.random() * 2 + 1.5,
      d: i * 0.18,
    }));
    const links = [];
    for (let i = 0; i < nodes.length; i++)
      for (let j = i + 1; j < nodes.length; j++)
        if (Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y) < 170)
          links.push([nodes[i], nodes[j]]);
    return { nodes, links };
  }, []);

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Bright horizon rim gradient */}
        <linearGradient id="rim" x1="0" y1="0" x2={VB_W} y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1f6bff" />
          <stop offset="35%" stopColor="#00d4ff" />
          <stop offset="55%" stopColor="#42ffd0" />
          <stop offset="80%" stopColor="#3bff8c" />
          <stop offset="100%" stopColor="#7dff5e" />
        </linearGradient>
        {/* Soft side glows */}
        <radialGradient id="lg" cx="0%" cy="55%" r="65%">
          <stop offset="0%" stopColor="rgba(31,107,255,0.55)" />
          <stop offset="100%" stopColor="rgba(31,107,255,0)" />
        </radialGradient>
        <radialGradient id="rg" cx="100%" cy="45%" r="65%">
          <stop offset="0%" stopColor="rgba(0,255,150,0.45)" />
          <stop offset="100%" stopColor="rgba(0,255,150,0)" />
        </radialGradient>
        {/* Heavy glow */}
        <filter id="gB" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Soft glow */}
        <filter id="gS" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* No flat side washes — keep pure black background; only the strands carry color */}

      {/* Stars */}
      <g>
        {stars.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="#cfe8ff"
            opacity={s.o}
            className="hb-twinkle"
            style={{ animationDelay: `${s.d}s` }}
          />
        ))}
      </g>

      {/* Left-side blue constellation — gentle in-place float (no sliding) */}
      <g filter="url(#gS)" className="hb-floatSlow">
        {lLinks.map(([a, b], i) => (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="#2e7bff"
            strokeWidth="0.7"
            opacity="0.5"
          />
        ))}
        {lNodes.map((n, i) => (
          <circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill="#9fd2ff"
            className="hb-pulse"
            style={{ animationDelay: `${n.d}s` }}
          />
        ))}
      </g>
    </svg>
  );
}

/* ---------------- Public backdrop ---------------- */
export default function SpaceHeroBackdrop() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const c = () => setMobile(window.innerWidth < 768);
    c();
    window.addEventListener('resize', c);
    return () => window.removeEventListener('resize', c);
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-black" aria-hidden>

      {/* WebGL Earth + Stars */}
      <FeatureBoundary>
        <Canvas
          dpr={[1, mobile ? 1.5 : 2]}
          camera={{ position: [0, 1.6, CAM_Z], fov: 45 }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </FeatureBoundary>

      {/* SVG decoration: rim, constellation, flowing strands */}
      <div className="pointer-events-none absolute inset-0">
        <Decorations />
      </div>

      {/* Subtle lateral glow (very low opacity, no haze in the center) */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-screen opacity-40"
        style={{
          background:
            'radial-gradient(30% 50% at 0% 55%, rgba(31,107,255,0.35), transparent 70%),' +
            'radial-gradient(30% 50% at 100% 45%, rgba(39,255,158,0.30), transparent 70%)',
        }}
      />
      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.8)_100%)]" />
      {/* Subtle grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.9'/></svg>\")",
        }}
      />

      <style>{`
        @keyframes hb-tw{0%,100%{opacity:.25}50%{opacity:1}}
        @keyframes hb-pls{0%,100%{transform:scale(1);opacity:.85}50%{transform:scale(1.45);opacity:1}}
        @keyframes hb-fs{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes hb-drL{0%,100%{transform:translate(0,0)}50%{transform:translate(8px,-6px)}}
        @keyframes hb-drR{0%,100%{transform:translate(0,0)}50%{transform:translate(-10px,-8px)}}
        .hb-twinkle{animation:hb-tw 4s ease-in-out infinite}
        .hb-pulse{transform-box:fill-box;transform-origin:center;animation:hb-pls 3.5s ease-in-out infinite}
        .hb-floatSlow{animation:hb-fs 11s ease-in-out infinite}
        .hb-driftL{animation:hb-drL 13s ease-in-out infinite}
        .hb-driftR{animation:hb-drR 14s ease-in-out infinite}
        @media (prefers-reduced-motion: reduce){
          .hb-twinkle,.hb-pulse,.hb-floatSlow,.hb-driftL,.hb-driftR{animation:none}
        }
      `}</style>
    </div>
  );
}
