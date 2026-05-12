import { lazy, Suspense, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import "./DonerExperience.css";

/* Lazy-load the 3D scene so the page doesn't pay the three.js cost up-front */
const DonerScene = lazy(() => import("./DonerScene"));

/* ------------------------------------------------------------
   Scroll stages — each stage occupies ~20% of total scroll
   ------------------------------------------------------------ */

const STAGES = [
  {
    id: 1,
    range: [0.0, 0.15],
    eyebrow: "STAGE 01 · BROT",
    headline: "ECHTER BERLINER",
    sub: "Mehr als nur Döner.",
    cta: { label: "Entdecken", icon: "↓" },
  },
  {
    id: 2,
    range: [0.2, 0.36],
    eyebrow: "STAGE 02 · FLEISCH",
    headline: "100% urbaner\nBerliner Geschmack.",
    sub: "Frisch vom Spieß. Echtes Handwerk.",
  },
  {
    id: 3,
    range: [0.42, 0.58],
    eyebrow: "STAGE 03 · GEMÜSE",
    headline: "Frisch. Schnell.\nAuthentisch.",
    sub: "Salat. Rotkohl. Tomaten. Täglich neu.",
  },
  {
    id: 4,
    range: [0.62, 0.78],
    eyebrow: "STAGE 04 · SOSSE",
    headline: "Bestellen ohne\nAnrufen.",
    sub: "Per WhatsApp oder Web — in 30 Sekunden.",
    pillUI: true,
  },
  {
    id: 5,
    range: [0.85, 1.0],
    eyebrow: "STAGE 05 · BEREIT",
    headline: "Dein Döner\nwartet.",
    sub: "Abholen. Genießen. Wiederkommen.",
    cta: { label: "Jetzt vorbestellen", icon: "→" },
    final: true,
  },
];

/* ------------------------------------------------------------
   StageOverlay — text + glassmorphic panel per stage
   ------------------------------------------------------------ */

function StageOverlay({ stage, progress }) {
  const [start, end] = stage.range;
  const fadeIn = 0.05;
  const opacity = useTransform(
    progress,
    [start - fadeIn, start, end, end + fadeIn],
    [0, 1, 1, 0]
  );
  const y = useTransform(progress, [start, end], [60, -60]);
  const scale = useTransform(progress, [start, end], [0.96, 1.02]);
  const blur = useTransform(
    progress,
    [start - fadeIn, start, end, end + fadeIn],
    [10, 0, 0, 10]
  );
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  return (
    <motion.div
      className={`de-stage ${stage.final ? "de-stage--final" : ""}`}
      style={{ opacity, y, scale, filter }}
    >
      <div className="de-stage__inner">
        <span className="de-stage__eyebrow">{stage.eyebrow}</span>
        <h2 className="de-stage__headline">
          {stage.headline.split("\n").map((line, i) => (
            <span key={i} className="de-stage__line">
              {line}
            </span>
          ))}
        </h2>
        <p className="de-stage__sub">{stage.sub}</p>

        {stage.pillUI && <PillOrderUI />}

        {stage.cta && (
          <a href="#order" className="de-btn">
            <span>{stage.cta.label}</span>
            <span className="de-btn__icon">{stage.cta.icon}</span>
          </a>
        )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------
   PillOrderUI — mini glassmorphic preorder widget shown in stage 4
   ------------------------------------------------------------ */

function PillOrderUI() {
  return (
    <motion.div
      className="de-pill"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="de-pill__row">
        <div className="de-pill__chip">
          <span className="de-pill__dot" />
          LIVE
        </div>
        <div className="de-pill__chip de-pill__chip--ghost">
          Ø 12 min
        </div>
      </div>
      <div className="de-pill__divider" />
      <div className="de-pill__row de-pill__row--input">
        <input
          className="de-pill__input"
          placeholder="1x Döner scharf, ohne Zwiebeln…"
          readOnly
        />
        <button className="de-pill__send" aria-label="Senden">
          ➤
        </button>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------
   Progress Bar — slim accent indicator at bottom edge
   ------------------------------------------------------------ */

function ProgressIndicator({ progress }) {
  const width = useTransform(progress, [0, 1], ["0%", "100%"]);
  return (
    <div className="de-progress">
      <motion.div className="de-progress__fill" style={{ width }} />
    </div>
  );
}

/* ------------------------------------------------------------
   Scroll hint that disappears after Section 1
   ------------------------------------------------------------ */

function ScrollHint({ progress }) {
  const opacity = useTransform(progress, [0, 0.06], [1, 0]);
  return (
    <motion.div className="de-hint" style={{ opacity }}>
      <span className="de-hint__label">SCROLL</span>
      <span className="de-hint__line" />
    </motion.div>
  );
}

/* ------------------------------------------------------------
   Main export
   ------------------------------------------------------------ */

export default function DonerExperience() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth scroll → spring-eased motion value drives the scene
  const progress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 22,
    mass: 0.7,
  });

  return (
    <section ref={containerRef} className="de-root">
      <div className="de-sticky">
        <div className="de-canvas">
          <Suspense fallback={<div className="de-canvas__loader" />}>
            <DonerScene progress={progress} />
          </Suspense>
        </div>

        <div className="de-overlay">
          {STAGES.map((stage) => (
            <StageOverlay key={stage.id} stage={stage} progress={progress} />
          ))}
          <ScrollHint progress={progress} />
        </div>

        <ProgressIndicator progress={progress} />
      </div>

      {/* Scroll-spacer: 5 stages × 100vh + extra for breathing */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="de-spacer" aria-hidden="true" />
      ))}
    </section>
  );
}
