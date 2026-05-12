import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* easing — easeOutCubic gives a satisfying decel-curve */
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/**
 * IngredientLayer
 * Wraps any 3D content and reveals it based on scroll progress.
 * - range: [startProgress, endProgress] in [0..1] scroll space
 * - floatY: vertical offset the layer drops from while revealing
 * - rotateIn: extra Y-rotation while revealing
 * - bob: per-axis floating amplitude when fully revealed
 */
export default function IngredientLayer({
  progress,
  range = [0, 1],
  floatY = 1.2,
  rotateIn = Math.PI * 0.5,
  bob = 0.04,
  bobSpeed = 1.3,
  seed = 0,
  children,
}) {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const p = progress.get ? progress.get() : progress;
    const [start, end] = range;
    const raw = (p - start) / (end - start);
    const t = THREE.MathUtils.clamp(raw, 0, 1);
    const eased = easeOutCubic(t);

    const g = groupRef.current;
    // Scale & opacity-replacement (scale 0 hides cleanly without per-material work)
    g.scale.setScalar(0.001 + eased * 0.999);
    // Drop-in
    g.position.y = (1 - eased) * floatY;
    // Subtle rotational entry
    g.rotation.y = (1 - eased) * rotateIn;

    // Cinematic floating once revealed
    if (eased > 0.95) {
      const time = clock.elapsedTime + seed;
      g.position.y += Math.sin(time * bobSpeed) * bob;
      g.rotation.z = Math.sin(time * 0.5) * 0.03;
    }

    g.visible = t > 0.005;
  });

  return <group ref={groupRef}>{children}</group>;
}
