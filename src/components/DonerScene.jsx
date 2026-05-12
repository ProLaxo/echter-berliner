import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Sparkles,
  Float,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { Vector2 } from "three";
import * as THREE from "three";
import IngredientLayer from "./IngredientLayer";

/* ============================================================
   Camera Rig — subtle dolly + mouse parallax
   ============================================================ */

function CameraRig({ progress }) {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    const p = progress.get ? progress.get() : progress;
    // Slight dolly-in as the user scrolls
    const targetZ = 3.6 - p * 0.55;
    const targetY = 1.3 - p * 0.25;

    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      mouse.current.x * 0.35,
      0.045
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      targetY - mouse.current.y * 0.2,
      0.045
    );
    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      targetZ,
      0.045
    );
    camera.lookAt(0, 0.05, 0);
  });

  return null;
}

/* ============================================================
   Lighting — cinematic key + neon rim
   ============================================================ */

function Lights() {
  return (
    <>
      <ambientLight intensity={0.18} color="#2a2a45" />

      {/* Key light — warm, casts soft shadows */}
      <directionalLight
        position={[3.2, 5, 4]}
        intensity={2.6}
        color="#fff1c2"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
        shadow-bias={-0.0005}
      />

      {/* Yellow neon rim */}
      <pointLight
        position={[-3, 1.8, 2]}
        intensity={2.4}
        color="#ffd000"
        distance={9}
        decay={1.6}
      />
      {/* Warm underglow */}
      <pointLight
        position={[0, -1.5, 1.5]}
        intensity={1.1}
        color="#ff8a1a"
        distance={5}
        decay={2}
      />
      {/* Top spot */}
      <spotLight
        position={[0, 4.5, 0.5]}
        angle={0.45}
        penumbra={0.85}
        intensity={2.0}
        color="#ffe69a"
        castShadow
      />
    </>
  );
}

/* ============================================================
   Geometry — Bread + Ingredients
   ============================================================ */

function Bread() {
  // Stylized open pita: flattened ellipsoid base
  return (
    <group>
      {/* base loaf */}
      <mesh castShadow receiveShadow position={[0, 0, 0]} scale={[1.55, 0.32, 0.95]}>
        <sphereGeometry args={[0.5, 64, 32]} />
        <meshPhysicalMaterial
          color="#d4a55c"
          roughness={0.78}
          clearcoat={0.18}
          clearcoatRoughness={0.85}
          sheen={0.4}
          sheenColor="#e6c080"
        />
      </mesh>
      {/* slight inner shadow stripe for "opened pita" depth */}
      <mesh position={[0, 0.16, 0]} scale={[1.35, 0.05, 0.75]} renderOrder={1}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#3a2410"
          roughness={1}
          metalness={0}
          transparent
          opacity={0.55}
        />
      </mesh>
    </group>
  );
}

function MeatSlices() {
  // Stack of irregular dark-brown box-slices
  const slices = [];
  for (let i = 0; i < 9; i++) {
    const angle = (i / 9) * Math.PI * 0.7 - Math.PI * 0.35;
    const r = 0.32 + (i % 2 === 0 ? 0.02 : -0.02);
    slices.push({
      x: Math.sin(angle) * r,
      y: 0.22 + i * 0.018,
      z: Math.cos(angle) * 0.06,
      ry: angle * 0.7,
      rx: (Math.random() - 0.5) * 0.2,
      rz: (Math.random() - 0.5) * 0.15,
      w: 0.18 + Math.random() * 0.05,
      h: 0.045,
      d: 0.13 + Math.random() * 0.04,
    });
  }
  return (
    <>
      {slices.map((s, i) => (
        <mesh
          key={i}
          position={[s.x, s.y, s.z]}
          rotation={[s.rx, s.ry, s.rz]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[s.w, s.h, s.d]} />
          <meshPhysicalMaterial
            color={i % 3 === 0 ? "#5a2f12" : "#6e3a17"}
            roughness={0.55}
            clearcoat={0.35}
            clearcoatRoughness={0.5}
          />
        </mesh>
      ))}
    </>
  );
}

function Salad() {
  // Multiple crumpled icospheres in green
  const bits = [];
  for (let i = 0; i < 12; i++) {
    bits.push({
      x: (Math.random() - 0.5) * 0.9,
      y: 0.32 + Math.random() * 0.04,
      z: (Math.random() - 0.5) * 0.4,
      r: 0.05 + Math.random() * 0.04,
      s: (Math.random() - 0.5) * 0.6,
    });
  }
  return (
    <>
      {bits.map((b, i) => (
        <mesh
          key={i}
          position={[b.x, b.y, b.z]}
          rotation={[b.s, b.s * 2, b.s]}
          castShadow
        >
          <icosahedronGeometry args={[b.r, 0]} />
          <meshPhysicalMaterial
            color={i % 2 === 0 ? "#4d8a2a" : "#5fa235"}
            roughness={0.65}
            clearcoat={0.25}
            clearcoatRoughness={0.5}
          />
        </mesh>
      ))}
    </>
  );
}

function RedCabbage() {
  // Small purple spheres
  const bits = [];
  for (let i = 0; i < 14; i++) {
    bits.push({
      x: (Math.random() - 0.5) * 1.0,
      y: 0.36 + Math.random() * 0.03,
      z: (Math.random() - 0.5) * 0.45,
      r: 0.025 + Math.random() * 0.025,
    });
  }
  return (
    <>
      {bits.map((b, i) => (
        <mesh key={i} position={[b.x, b.y, b.z]} castShadow>
          <sphereGeometry args={[b.r, 12, 12]} />
          <meshPhysicalMaterial
            color={i % 2 === 0 ? "#6a1f55" : "#7a2864"}
            roughness={0.4}
            clearcoat={0.5}
            clearcoatRoughness={0.3}
          />
        </mesh>
      ))}
    </>
  );
}

function TomatoSlices() {
  // Thin red cylinders for tomato discs
  const slices = [];
  for (let i = 0; i < 5; i++) {
    slices.push({
      x: -0.45 + i * 0.22,
      y: 0.345,
      z: (Math.random() - 0.5) * 0.2,
      tilt: (Math.random() - 0.5) * 0.3,
    });
  }
  return (
    <>
      {slices.map((s, i) => (
        <mesh
          key={i}
          position={[s.x, s.y, s.z]}
          rotation={[Math.PI / 2 + s.tilt, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.085, 0.085, 0.018, 24]} />
          <meshPhysicalMaterial
            color="#c43030"
            roughness={0.35}
            clearcoat={0.7}
            clearcoatRoughness={0.25}
            sheen={0.4}
            sheenColor="#ff7070"
          />
        </mesh>
      ))}
    </>
  );
}

function Sauce() {
  // Glossy off-white drips — transmissive material for premium "liquid" feel
  const drips = [];
  for (let i = 0; i < 9; i++) {
    drips.push({
      x: (Math.random() - 0.5) * 0.95,
      y: 0.38 + Math.random() * 0.02,
      z: (Math.random() - 0.5) * 0.4,
      r: 0.03 + Math.random() * 0.025,
      stretch: 0.6 + Math.random() * 0.8,
    });
  }
  return (
    <>
      {drips.map((d, i) => (
        <mesh
          key={i}
          position={[d.x, d.y, d.z]}
          scale={[1, d.stretch, 1]}
          castShadow
        >
          <sphereGeometry args={[d.r, 18, 18]} />
          <meshPhysicalMaterial
            color="#f6e9c8"
            roughness={0.08}
            metalness={0.0}
            clearcoat={1.0}
            clearcoatRoughness={0.08}
            transmission={0.45}
            thickness={0.4}
            ior={1.3}
            sheen={0.6}
            sheenColor="#fff5d0"
          />
        </mesh>
      ))}
    </>
  );
}

/* ============================================================
   Döner — composed scene, animated by scroll progress
   ============================================================ */

function Doner({ progress }) {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    // Slow continuous rotation for product-reveal feel
    groupRef.current.rotation.y = clock.elapsedTime * 0.08;
  });

  return (
    <group ref={groupRef}>
      {/* Bread — always visible, but lifts subtly at start */}
      <Bread />

      {/* Stage 2 — meat */}
      <IngredientLayer
        progress={progress}
        range={[0.16, 0.36]}
        floatY={1.4}
        rotateIn={Math.PI * 0.7}
        seed={1.1}
      >
        <MeatSlices />
      </IngredientLayer>

      {/* Stage 3 — vegetables (salad + cabbage + tomato) */}
      <IngredientLayer
        progress={progress}
        range={[0.36, 0.55]}
        floatY={1.2}
        rotateIn={Math.PI * 0.4}
        seed={2.2}
      >
        <Salad />
        <RedCabbage />
      </IngredientLayer>

      <IngredientLayer
        progress={progress}
        range={[0.42, 0.6]}
        floatY={1.0}
        rotateIn={Math.PI * 0.3}
        seed={3.3}
      >
        <TomatoSlices />
      </IngredientLayer>

      {/* Stage 4 — sauce */}
      <IngredientLayer
        progress={progress}
        range={[0.6, 0.78]}
        floatY={0.9}
        rotateIn={Math.PI * 0.2}
        seed={4.4}
      >
        <Sauce />
      </IngredientLayer>
    </group>
  );
}

/* ============================================================
   Final glow / particles — show toward end of scroll
   ============================================================ */

function FinalReveal({ progress }) {
  const groupRef = useRef();
  useFrame(() => {
    if (!groupRef.current) return;
    const p = progress.get ? progress.get() : progress;
    const t = THREE.MathUtils.clamp((p - 0.78) / 0.22, 0, 1);
    groupRef.current.visible = t > 0.01;
    groupRef.current.scale.setScalar(0.5 + t * 0.8);
  });

  return (
    <group ref={groupRef}>
      <Sparkles
        count={140}
        size={3.5}
        speed={0.4}
        scale={[5, 4, 5]}
        color="#ffd000"
      />
      <pointLight
        position={[0, 1.2, 1.5]}
        intensity={3.2}
        color="#ffd000"
        distance={6}
        decay={1.5}
      />
    </group>
  );
}

/* ============================================================
   Scene
   ============================================================ */

export default function DonerScene({ progress }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      shadows
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 1.3, 3.6], fov: 35 }}
    >
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 6, 14]} />

      <Suspense fallback={null}>
        <CameraRig progress={progress} />
        <Lights />
        <Environment preset="night" />

        <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.35}>
          <Doner progress={progress} />
        </Float>

        <FinalReveal progress={progress} />

        <ContactShadows
          position={[0, -0.4, 0]}
          opacity={0.7}
          scale={6}
          blur={2.8}
          far={2}
          color="#000000"
        />
        {/* yellow color-leak shadow for premium glow */}
        <ContactShadows
          position={[0, -0.395, 0]}
          opacity={0.25}
          scale={4.5}
          blur={3.5}
          far={2}
          color="#ffd000"
        />

        <Sparkles
          count={45}
          size={2}
          speed={0.25}
          scale={[7, 4, 7]}
          color="#ffd000"
          opacity={0.55}
        />
      </Suspense>

      <EffectComposer multisampling={4}>
        <Bloom
          intensity={0.95}
          luminanceThreshold={0.5}
          luminanceSmoothing={0.35}
          mipmapBlur
        />
        <ChromaticAberration offset={new Vector2(0.0006, 0.0008)} />
        <Vignette eskil={false} offset={0.28} darkness={0.78} />
      </EffectComposer>
    </Canvas>
  );
}
