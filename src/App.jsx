import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  Flame,
  Beef,
  Pizza,
  Utensils,
  MessageSquare,
  Globe,
  Clock,
  Star,
  MapPin,
  Phone,
  ChevronDown,
  Sparkles,
  Check,
  Send,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import DonerExperience from "./components/DonerExperience";
import "./App.css";

/* ============================================================
   Globale Effekt-Layer
   ============================================================ */

function NoiseOverlay() {
  return (
    <div className="noise" aria-hidden="true">
      <svg width="100%" height="100%">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" opacity="0.55" />
      </svg>
    </div>
  );
}

function GlowOrbs() {
  return (
    <div className="orbs" aria-hidden="true">
      <motion.div
        className="orb orb--a"
        animate={{ x: [0, 60, -40, 0], y: [0, -50, 30, 0] }}
        transition={{ duration: 22, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        className="orb orb--b"
        animate={{ x: [0, -80, 50, 0], y: [0, 40, -60, 0] }}
        transition={{ duration: 28, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        className="orb orb--c"
        animate={{ x: [0, 40, -30, 0], y: [0, 60, -20, 0] }}
        transition={{ duration: 34, ease: "easeInOut", repeat: Infinity }}
      />
    </div>
  );
}

function Vignette() {
  return <div className="vignette" aria-hidden="true" />;
}

/* ============================================================
   1. Intro — Cinematic Reveal
   ============================================================ */

function Intro() {
  return (
    <motion.div
      className="intro"
      initial={{ opacity: 1 }}
      exit={{
        y: "-100%",
        opacity: 0,
        transition: { duration: 1.0, ease: [0.76, 0, 0.24, 1] },
      }}
    >
      <div className="intro__inner">
        <motion.div
          className="intro__bar"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        />
        <motion.div
          className="intro__mono"
          initial={{ opacity: 0, y: 24, letterSpacing: "1.5em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.25em" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
        >
          E B
        </motion.div>
        <motion.div
          className="intro__label"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          STREETFOOD · DORTMUND · EST. 2026
        </motion.div>
      </div>
      <motion.div
        className="intro__sweep"
        initial={{ y: "100%" }}
        animate={{ y: "-100%" }}
        transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1], delay: 1.6 }}
      />
    </motion.div>
  );
}

/* ============================================================
   Helpers
   ============================================================ */

const revealVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

function SectionLabel({ children }) {
  return (
    <motion.div
      className="section-label"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="section-label__dot" />
      {children}
    </motion.div>
  );
}

/* ============================================================
   2. Hero
   ============================================================ */

function Hero() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const headlineY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });

  useEffect(() => {
    const handler = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      mx.set(x);
      my.set(y);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [mx, my]);

  const headline = "ECHTER BERLINER";
  const letters = headline.split("");

  return (
    <section ref={heroRef} className="hero">
      <motion.div className="hero__bg" style={{ y: bgY, scale: bgScale }}>
        <motion.div className="hero__bg-inner" style={{ x: sx, y: sy }}>
          <div className="hero__gradient" />
          <div className="hero__grid" />
        </motion.div>
      </motion.div>

      <motion.div
        className="hero__content"
        style={{ y: headlineY, opacity: headlineOpacity }}
      >
        <motion.div
          className="hero__eyebrow"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <Sparkles size={14} strokeWidth={2} />
          <span>DORTMUND · LIVE GEÖFFNET</span>
        </motion.div>

        <h1 className="hero__headline">
          {letters.map((c, i) => (
            <motion.span
              key={i}
              className="hero__letter"
              initial={{ y: 120, opacity: 0, filter: "blur(14px)", rotate: -3 }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)", rotate: 0 }}
              transition={{
                duration: 1.1,
                delay: 0.35 + i * 0.045,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {c === " " ? " " : c}
            </motion.span>
          ))}
        </h1>

        <motion.div
          className="hero__underline"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
        />

        <motion.p
          className="hero__sub"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.9 }}
        >
          Dortmunds urbaner <span className="acc">Streetfood-Spot.</span>
          <br />
          Echt. Schnell. Ohne Anrufen.
        </motion.p>

        <motion.div
          className="hero__ctas"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.75, duration: 0.8 }}
        >
          <a href="#order" className="btn btn--primary">
            <span>Jetzt vorbestellen</span>
            <ArrowRight size={18} strokeWidth={2.4} />
          </a>
          <a href="#menu" className="btn btn--ghost">
            <span>Menü ansehen</span>
          </a>
        </motion.div>

        <motion.div
          className="hero__meta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.1, duration: 1 }}
        >
          <div className="hero__meta-item">
            <span className="hero__meta-num">12 min</span>
            <span className="hero__meta-lbl">Ø Wartezeit</span>
          </div>
          <div className="hero__meta-divider" />
          <div className="hero__meta-item">
            <span className="hero__meta-num">4.9★</span>
            <span className="hero__meta-lbl">218 Bewertungen</span>
          </div>
          <div className="hero__meta-divider" />
          <div className="hero__meta-item">
            <span className="hero__meta-num">24/7</span>
            <span className="hero__meta-lbl">AI-Bestellung</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1 }}
      >
        <span>SCROLL</span>
        <motion.div
          className="hero__scroll-line"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <ChevronDown size={14} />
      </motion.div>
    </section>
  );
}

/* ============================================================
   3. MenuCards — Beliebte Gerichte
   ============================================================ */

const DISHES = [
  {
    name: "Döner Hähnchen",
    price: "7,50 €",
    tag: "BESTSELLER",
    icon: Flame,
    desc: "Knusprig vom Spieß. Hausgemachte Soßen. Frisches Brot.",
  },
  {
    name: "Dürüm Beef",
    price: "9,00 €",
    tag: "NEU",
    icon: Beef,
    desc: "Saftiges Beef im warmen Yufka, knackiges Gemüse.",
  },
  {
    name: "Lahmacun XL",
    price: "5,50 €",
    tag: "CLASSIC",
    icon: Pizza,
    desc: "Dünn, würzig, frisch aus dem Steinofen.",
  },
  {
    name: "Pommes Spezial",
    price: "4,90 €",
    tag: "LATE-NIGHT",
    icon: Utensils,
    desc: "Doppelt frittiert. Hausgewürz. Yo Sauce.",
  },
];

function MenuCards() {
  return (
    <section id="menu" className="section menu">
      <div className="container">
        <SectionLabel>01 · DIE KARTE</SectionLabel>
        <motion.h2
          className="section__title"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={revealVariants}
        >
          Beliebte <span className="acc">Gerichte.</span>
        </motion.h2>
        <motion.p
          className="section__lead"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={revealVariants}
          custom={1}
        >
          Streetfood ohne Kompromisse. Täglich frisch aus Dortmund.
        </motion.p>

        <div className="menu__grid">
          {DISHES.map((dish, i) => {
            const Icon = dish.icon;
            return (
              <motion.article
                key={dish.name}
                className="card"
                initial={{ opacity: 0, y: 60, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -10, rotate: -0.4 }}
              >
                <div className="card__top">
                  <span className="card__tag">{dish.tag}</span>
                  <span className="card__price">{dish.price}</span>
                </div>
                <div className="card__visual">
                  <Icon size={72} strokeWidth={1.1} />
                  <div className="card__glow" />
                </div>
                <div className="card__bottom">
                  <h3 className="card__name">{dish.name}</h3>
                  <p className="card__desc">{dish.desc}</p>
                  <div className="card__cta">
                    <span>Hinzufügen</span>
                    <ArrowRight size={16} strokeWidth={2.4} />
                  </div>
                </div>
                <div className="card__border" />
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   4. ValueProp — Bestellen ohne Anrufen
   ============================================================ */

const VALUE_ITEMS = [
  {
    icon: MessageSquare,
    title: "WhatsApp",
    desc: "Schreib uns einfach. Unsere AI versteht deine Bestellung sofort.",
  },
  {
    icon: Globe,
    title: "Online",
    desc: "Tippen, anpassen, fertig. Kein Login, kein Schnickschnack.",
  },
  {
    icon: Clock,
    title: "Abholzeit",
    desc: "Wähle deinen Slot. Bei Abholung schon eingepackt.",
  },
];

function ValueProp() {
  return (
    <section className="section value">
      <div className="container">
        <SectionLabel>02 · DAS PRINZIP</SectionLabel>
        <motion.h2
          className="section__title section__title--xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={revealVariants}
        >
          Bestellen <span className="acc">ohne Anrufen.</span>
        </motion.h2>
        <motion.p
          className="section__lead"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={revealVariants}
          custom={1}
        >
          Du hast Hunger. Wir haben die Tools. Keine Warteschleife, keine Missverständnisse.
        </motion.p>

        <div className="value__grid">
          {VALUE_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                className="value__item"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.9,
                  delay: i * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="value__icon">
                  <Icon size={28} strokeWidth={1.6} />
                </div>
                <div className="value__num">0{i + 1}</div>
                <h3 className="value__title">{item.title}</h3>
                <p className="value__desc">{item.desc}</p>
                <motion.div
                  className="value__line"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1.2,
                    delay: 0.4 + i * 0.15,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   5. OrderSystem — AI Demo
   ============================================================ */

function Typewriter({ text, speed = 28 }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    setShown("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return (
    <span>
      {shown}
      <span className="typer-caret">|</span>
    </span>
  );
}

function TypingDots() {
  return (
    <div className="typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="typing__dot"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

function OrderSystem() {
  const [step, setStep] = useState(0);

  const start = () => {
    setStep(0);
    setTimeout(() => setStep(1), 200);
  };

  useEffect(() => {
    if (step === 1) {
      const t = setTimeout(() => setStep(2), 2400);
      return () => clearTimeout(t);
    }
    if (step === 2) {
      const t = setTimeout(() => setStep(3), 1400);
      return () => clearTimeout(t);
    }
    if (step === 3) {
      const t = setTimeout(() => setStep(4), 1800);
      return () => clearTimeout(t);
    }
  }, [step]);

  return (
    <section id="order" className="section order">
      <div className="container order__container">
        <div className="order__copy">
          <SectionLabel>03 · AI-BESTELLUNG</SectionLabel>
          <motion.h2
            className="section__title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={revealVariants}
          >
            Schreib's <span className="acc">in normalem Deutsch.</span>
          </motion.h2>
          <motion.p
            className="section__lead"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={revealVariants}
            custom={1}
          >
            Unsere AI versteht Produkt, Extras, Wünsche und Abholzeit —
            in einem Satz. Probier's aus.
          </motion.p>

          <div className="order__bullets">
            {[
              "Erkennt Produkt + Variante",
              "Filtert Extras & Allergien",
              "Plant Abholzeit automatisch",
              "Bestätigung in unter 5 Sekunden",
            ].map((b, i) => (
              <motion.div
                key={b}
                className="order__bullet"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <Check size={16} strokeWidth={2.6} /> <span>{b}</span>
              </motion.div>
            ))}
          </div>

          <button className="btn btn--primary order__btn" onClick={start}>
            <Sparkles size={16} strokeWidth={2.4} />
            <span>{step === 0 ? "Demo starten" : "Demo neu starten"}</span>
          </button>
        </div>

        <motion.div
          className="phone"
          initial={{ opacity: 0, y: 40, rotateY: -8 }}
          whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="phone__notch" />
          <div className="phone__screen">
            <div className="phone__header">
              <div className="phone__avatar">
                <Sparkles size={14} />
              </div>
              <div className="phone__header-text">
                <strong>Echter Berliner AI</strong>
                <span>online · antwortet sofort</span>
              </div>
              <div className="phone__pulse" />
            </div>

            <div className="phone__chat">
              <AnimatePresence>
                {step >= 1 && (
                  <motion.div
                    key="user"
                    className="bubble bubble--user"
                    initial={{ opacity: 0, y: 18, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Typewriter text="1x Döner Hähnchen, scharf, ohne Zwiebeln. Abholung 19:30." />
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="typing"
                    className="bubble bubble--ai bubble--typing"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <TypingDots />
                  </motion.div>
                )}

                {step >= 3 && (
                  <motion.div
                    key="ai"
                    className="bubble bubble--ai"
                    initial={{ opacity: 0, y: 18, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    Verstanden — hier ist deine Bestellung.
                  </motion.div>
                )}

                {step >= 4 && (
                  <motion.div
                    key="card"
                    className="order-card"
                    initial={{ opacity: 0, y: 24, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="order-card__head">
                      <ShoppingBag size={14} />
                      <span>BESTELLUNG ERFASST</span>
                      <div className="order-card__check">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    </div>
                    <div className="order-card__row">
                      <span className="order-card__lbl">Produkt</span>
                      <span className="order-card__val">1× Döner Hähnchen</span>
                    </div>
                    <div className="order-card__row">
                      <span className="order-card__lbl">Extras</span>
                      <span className="order-card__val">scharf · ohne Zwiebeln</span>
                    </div>
                    <div className="order-card__row">
                      <span className="order-card__lbl">Abholung</span>
                      <span className="order-card__val acc">heute 19:30</span>
                    </div>
                    <div className="order-card__row order-card__row--total">
                      <span className="order-card__lbl">Total</span>
                      <span className="order-card__val acc">7,50 €</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {step === 0 && (
                <div className="phone__empty">
                  <Sparkles size={32} strokeWidth={1.2} />
                  <p>Tippe „Demo starten" um die AI zu sehen.</p>
                </div>
              )}
            </div>

            <div className="phone__input">
              <input placeholder="Schreib deine Bestellung…" readOnly />
              <button className="phone__send" aria-label="senden">
                <Send size={14} strokeWidth={2.4} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================
   6. Reviews
   ============================================================ */

const REVIEWS = [
  {
    text: "Bester Döner in Dortmund. Punkt. Die AI-Bestellung ist Gamechanger.",
    name: "Mert K.",
    sub: "Dortmund · Kreuzviertel",
  },
  {
    text: "Endlich nicht mehr anrufen. Tipp ich kurz rein, ist alles fertig wenn ich da bin.",
    name: "Lena M.",
    sub: "Dortmund · Hörde",
  },
  {
    text: "Schmeckt wie Berlin Kreuzberg, mitten in Dortmund. Krass.",
    name: "Yusuf A.",
    sub: "Dortmund · Nordstadt",
  },
  {
    text: "Late-Night-Pommes mit Yo-Sauce. Mehr muss man nicht sagen.",
    name: "Carla R.",
    sub: "Dortmund · City",
  },
  {
    text: "Hab in WhatsApp einfach 'das übliche' geschrieben — und es hat funktioniert.",
    name: "Daniel B.",
    sub: "Dortmund · Innenstadt-West",
  },
];

function Reviews() {
  return (
    <section className="section reviews">
      <div className="container">
        <SectionLabel>04 · CREW SAGT</SectionLabel>
        <motion.h2
          className="section__title"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={revealVariants}
        >
          218 Reviews. <span className="acc">4,9 ★.</span>
        </motion.h2>
      </div>

      <motion.div
        className="reviews__track"
        drag="x"
        dragConstraints={{ left: -1400, right: 0 }}
        dragElastic={0.08}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        {REVIEWS.map((r, i) => (
          <motion.div
            key={i}
            className="review"
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
          >
            <div className="review__stars">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} size={14} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <p className="review__text">„{r.text}"</p>
            <div className="review__meta">
              <div className="review__avatar">{r.name.charAt(0)}</div>
              <div>
                <strong>{r.name}</strong>
                <span>{r.sub}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ============================================================
   7. Hours
   ============================================================ */

const HOURS = [
  ["Montag", "11:00 – 23:00"],
  ["Dienstag", "11:00 – 23:00"],
  ["Mittwoch", "11:00 – 23:00"],
  ["Donnerstag", "11:00 – 23:00"],
  ["Freitag", "11:00 – 02:00"],
  ["Samstag", "12:00 – 02:00"],
  ["Sonntag", "12:00 – 23:00"],
];

function Hours() {
  return (
    <section className="section hours">
      <div className="container hours__container">
        <div className="hours__left">
          <SectionLabel>05 · GEÖFFNET</SectionLabel>
          <motion.h2
            className="section__title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={revealVariants}
          >
            Heute <span className="acc">offen.</span>
          </motion.h2>
          <motion.div
            className="hours__badge"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="hours__dot" />
            JETZT GEÖFFNET · BIS 02:00
          </motion.div>
          <p className="section__lead">
            Wir kochen, wenn andere schließen. Late-Night-Slot ab 22 Uhr.
          </p>
        </div>

        <div className="hours__right">
          {HOURS.map(([day, time], i) => (
            <motion.div
              key={day}
              className="hours__row"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <span className="hours__day">{day}</span>
              <span className="hours__line" />
              <span className="hours__time">{time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   8. Footer
   ============================================================ */

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <motion.div
          className="footer__cta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <span className="footer__cta-eyebrow">BEREIT?</span>
            <h2 className="footer__cta-title">
              Schreib uns — wir machen den Rest.
            </h2>
          </div>
          <a href="#" className="btn btn--primary btn--large">
            <MessageSquare size={18} strokeWidth={2.2} />
            <span>WhatsApp bestellen</span>
          </a>
        </motion.div>

        <div className="footer__grid">
          <div className="footer__col">
            <div className="footer__logo">ECHTER BERLINER</div>
            <p className="footer__desc">
              Dortmunds urbaner Streetfood-Spot. Echt. Schnell. Ohne Anrufen.
            </p>
          </div>
          <div className="footer__col">
            <span className="footer__label">Kontakt</span>
            <div className="footer__item">
              <MapPin size={14} /> Hauptstr. 1 · 44137 Dortmund
            </div>
            <div className="footer__item">
              <Phone size={14} /> +49 231 555 0123
            </div>
            <div className="footer__item">
              <MessageSquare size={14} /> WhatsApp · +49 152 555 0123
            </div>
          </div>
          <div className="footer__col">
            <span className="footer__label">Folge uns</span>
            <div className="footer__socials">
              <a href="#" aria-label="Instagram">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="#" aria-label="TikTok">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© 2026 Echter Berliner</span>
          <span>Made with ♥ in Dortmund</span>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   App
   ============================================================ */

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowIntro(false), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="app">
      <NoiseOverlay />
      <GlowOrbs />
      <Vignette />

      <AnimatePresence mode="wait">
        {showIntro && <Intro key="intro" />}
      </AnimatePresence>

      <DonerExperience />
      <MenuCards />
      <ValueProp />
      <OrderSystem />
      <Reviews />
      <Hours />
      <Footer />
    </div>
  );
}
