"use client";

import {
  AnimatePresence,
  motion,
  MotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Armchair,
  Bus,
  ChevronRight,
  Eye,
  Landmark,
  Plane,
  Repeat,
  Route,
  Signpost,
  TrafficCone,
  TrainFront,
  Users,
} from "lucide-react";

/* ==================================================================
   OFFLINE — scroll-stacking sub-deck for HistorySection's Offline panel.
   Reuses the panel's existing chrome (title + close button), so this
   renders only the scrollport + stacked slides — no header/nav/footer
   of its own. Typography maps onto the site's existing --font-figtree
   instead of loading Archivo/Inter.
   ================================================================== */

const AMBER = "#FFC53D";
const RED = "#E23B2E";

const CSS = `
.tnd, .tnd *, .tnd *::before, .tnd *::after { box-sizing: border-box; }
.tnd {
  --ink:#2A0505; --maroon:#4A0A0A; --maroon-2:#5C1010;
  --red:#C5121B; --ember:#E23B2E; --amber:#FFC53D; --gold:#FFE08A;
  --paper:#FFFFFF; --muted:#F0C9C9; --dim:#C89A9A;
  --stack-h: clamp(460px, 66vh, 720px);
  color:var(--paper);
  font-family:var(--font-figtree), sans-serif;
}
.tnd h1,.tnd h2,.tnd h3 { font-family:var(--font-figtree), sans-serif; }
.tnd p { margin:0; }
.tnd button { font-family:inherit; }
.tnd :focus-visible { outline:2px solid var(--amber); outline-offset:3px; border-radius:4px; }

/* ---- scrollport / track ------------------------------------------ */
.tnd-scrollport {
  position:relative; height:var(--stack-h);
  overflow-x:hidden; overflow-y:auto;
  border-radius:clamp(18px, 1.6vw, 28px);
  scroll-snap-type:y mandatory;
  overscroll-behavior:contain;
  scrollbar-width:none;
}
.tnd-scrollport::-webkit-scrollbar { display:none; }
.tnd-track { position:relative; }

.tnd-slide {
  position:sticky; top:0; height:var(--stack-h); overflow:hidden;
  scroll-snap-align:start;
  scroll-snap-stop:always;
  border-radius:clamp(18px, 1.6vw, 28px);
  border:1px solid rgba(255,197,61,.2);
  background:radial-gradient(125% 95% at 10% 0%,
    var(--maroon-2) 0%, var(--maroon) 45%, #370606 100%);
  box-shadow:0 -14px 70px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,224,138,.12);
}
/* diagonal ribbon watermark */
.tnd-slide::after { content:''; position:absolute; inset:0; pointer-events:none;
  background:repeating-linear-gradient(115deg,
    rgba(255,197,61,.05) 0 2px, transparent 2px 46px); }
.tnd-count { position:absolute; right:22px; top:20px; z-index:30;
  font-family:var(--font-figtree), sans-serif; font-size:11px; font-weight:700;
  font-variant-numeric:tabular-nums; letter-spacing:.2em;
  color:rgba(255,224,138,.5); }

.tnd-pane { position:relative; z-index:2; height:100%; padding:26px 22px;
  display:flex; flex-direction:column; }
@media (min-width:768px){ .tnd-pane { padding:38px 44px; } }
.tnd-mid { justify-content:center; }

/* ---- type ---------------------------------------------------------- */
.tnd-eyebrow { font-family:var(--font-figtree), sans-serif; font-size:10px; font-weight:700;
  text-transform:uppercase; letter-spacing:.28em; color:var(--amber); }
.tnd-h1 { margin:14px 0 0; font-size:clamp(32px,6.8vw,76px); font-weight:900;
  line-height:.94; letter-spacing:-.03em; color:var(--paper); }
.tnd-h1 em { font-style:normal; color:var(--amber);
  text-shadow:0 0 46px rgba(255,197,61,.4); }
.tnd-h2 { margin:8px 0 0; font-size:clamp(20px,2.8vw,32px); font-weight:800;
  line-height:1.1; letter-spacing:-.015em; color:var(--paper); }
.tnd-h3 { margin:8px 0 0; font-size:clamp(22px,2.6vw,32px); font-weight:800;
  line-height:1.05; color:var(--paper); }
.tnd-eyeline { margin:2px 0 0; font-family:var(--font-figtree), sans-serif; font-size:15px;
  font-weight:600; color:var(--gold); }
.tnd-lead { margin:16px 0 0; max-width:34rem; font-size:14px;
  line-height:1.6; color:var(--muted); }
.tnd-sub { margin:5px 0 0; font-size:12px; color:var(--dim); }
.tnd-note { margin:16px 0 0; font-size:11px; color:var(--dim); }

/* ---- buttons -------------------------------------------------------- */
.tnd-cta { display:inline-flex; align-items:center; gap:9px; margin-top:22px;
  padding:13px 26px; border:0; border-radius:99px; cursor:pointer;
  background:var(--amber); color:#3A0707;
  font-family:var(--font-figtree), sans-serif; font-size:13px; font-weight:800;
  box-shadow:0 0 34px rgba(255,197,61,.34);
  transition:transform .2s, box-shadow .2s; }
.tnd-cta:hover { transform:scale(1.035); box-shadow:0 0 48px rgba(255,197,61,.52); }
.tnd-cta:active { transform:scale(.97); }
.tnd-cta svg { transition:transform .2s; }
.tnd-cta:hover svg { transform:translateX(4px); }
.tnd-cta.ghost { background:transparent; color:var(--amber);
  border:1px solid rgba(255,197,61,.5); box-shadow:none; }
.tnd-cta.ghost:hover { background:rgba(255,197,61,.13); box-shadow:none; }

/* ---- tabs ------------------------------------------------------------ */
.tnd-tabs { display:flex; gap:8px; margin-top:18px; overflow-x:auto;
  padding-bottom:8px; scrollbar-width:none; flex:0 0 auto; }
.tnd-tabs::-webkit-scrollbar { display:none; }
.tnd-tab { flex:0 0 auto; white-space:nowrap; cursor:pointer;
  padding:8px 16px; border-radius:99px; font-family:var(--font-figtree), sans-serif;
  font-size:12px; font-weight:600; transition:all .28s;
  border:1px solid rgba(255,255,255,.16);
  background:rgba(0,0,0,.2); color:var(--muted); }
.tnd-tab:hover { border-color:rgba(255,197,61,.45); color:var(--paper); }
.tnd-tab[aria-selected="true"] { background:var(--amber); color:#3A0707;
  border-color:var(--amber); box-shadow:0 0 22px rgba(255,197,61,.35); }

/* ---- data -------------------------------------------------------------- */
.tnd-aud { display:grid; grid-template-columns:repeat(3,1fr); gap:10px;
  margin-top:18px; padding:14px; border-radius:16px;
  border:1px solid rgba(255,197,61,.24); background:rgba(255,197,61,.07); }
.tnd-aud svg { color:var(--amber); }
.tnd-aud .v { margin-top:6px; font-family:var(--font-figtree), sans-serif;
  font-size:clamp(16px,2vw,22px); font-weight:800; color:var(--amber); line-height:1; }
.tnd-aud .k { margin-top:4px; font-size:10px; line-height:1.3; color:var(--muted); }

.tnd-grid { display:grid; gap:10px; margin-top:14px;
  grid-template-columns:repeat(auto-fit,minmax(100px,1fr)); }
.tnd-stat { padding:13px; border-radius:14px;
  border:1px solid rgba(255,255,255,.11); background:rgba(0,0,0,.22); }
.tnd-stat .v { font-family:var(--font-figtree), sans-serif; font-size:clamp(19px,2.4vw,27px);
  font-weight:800; color:var(--paper); line-height:1; }
.tnd-stat .k { margin-top:6px; font-size:10px; line-height:1.35; color:var(--muted); }

.tnd-chips { display:flex; flex-wrap:wrap; gap:7px; margin-top:14px; }
.tnd-chip { padding:5px 12px; border-radius:99px; font-size:11px;
  border:1px solid rgba(255,197,61,.34); background:rgba(255,197,61,.09);
  color:var(--gold); }

/* ---- hero --------------------------------------------------------------- */
.tnd-hero-stats { display:grid; grid-template-columns:repeat(2,1fr);
  gap:16px; margin-top:30px; }
@media (min-width:640px){ .tnd-hero-stats { grid-template-columns:repeat(4,1fr); gap:22px; } }
.tnd-hero-stats .v { font-family:var(--font-figtree), sans-serif; font-size:clamp(24px,3.6vw,38px);
  font-weight:900; color:var(--amber); line-height:1; }
.tnd-hero-stats .k { margin-top:7px; font-size:11px; line-height:1.35; color:var(--muted); }

/* ---- split -------------------------------------------------------------- */
.tnd-split { display:grid; gap:20px; margin-top:14px; min-height:0; flex:1;
  grid-template-columns:1fr; align-items:center; }
@media (min-width:1024px){ .tnd-split { grid-template-columns:1fr 1fr; gap:36px; } }
.tnd-scroll { min-height:0; overflow-y:auto; padding-right:6px; scrollbar-width:none; }
.tnd-scroll::-webkit-scrollbar { display:none; }
.tnd-mapwrap { position:relative; width:100%; max-width:260px; margin:0 auto;
  aspect-ratio:400/520; display:none; }
@media (min-width:1024px){ .tnd-mapwrap { display:block; } }

/* ---- journey -------------------------------------------------------------- */
.tnd-journey { position:relative; margin-top:36px; overflow-x:auto;
  padding-bottom:14px; scrollbar-width:none; }
.tnd-journey::-webkit-scrollbar { display:none; }
.tnd-journey-inner { position:relative; display:flex; min-width:560px;
  align-items:flex-start; justify-content:space-between; gap:8px; }
@media (min-width:768px){ .tnd-journey-inner { min-width:0; } }
.tnd-line { position:absolute; left:0; right:0; top:25px; height:1px;
  background:rgba(255,197,61,.24); }
.tnd-spark { position:absolute; top:22px; width:7px; height:7px; border-radius:99px;
  background:var(--amber); box-shadow:0 0 14px 4px rgba(255,197,61,.7); }
.tnd-stage { position:relative; z-index:2; display:flex; flex:1;
  flex-direction:column; align-items:center; gap:10px;
  text-align:center; min-width:88px; }
.tnd-ring { display:flex; width:50px; height:50px; align-items:center;
  justify-content:center; border-radius:99px; background:var(--ink);
  border:1px solid rgba(255,197,61,.32); }
.tnd-ring svg { color:var(--amber); }
.tnd-stage-lbl { font-family:var(--font-figtree), sans-serif; font-size:10px; font-weight:600;
  text-transform:uppercase; letter-spacing:.1em; color:var(--muted); }

/* ---- impact ------------------------------------------------------------------ */
.tnd-glow { position:absolute; left:50%; top:-40px; width:400px; height:400px;
  transform:translateX(-50%); border-radius:99px; pointer-events:none;
  background:radial-gradient(circle, rgba(197,18,27,.55), transparent 68%);
  filter:blur(90px); }
.tnd-impact-h { margin:0; font-family:var(--font-figtree), sans-serif;
  font-size:clamp(21px,3.6vw,42px); font-weight:900; line-height:1.06;
  letter-spacing:-.02em; color:var(--paper); }
.tnd-impact-h em { font-style:normal; color:var(--amber); }
.tnd-cards { display:grid; grid-template-columns:repeat(2,1fr);
  gap:10px; margin-top:26px; }
@media (min-width:1024px){ .tnd-cards { grid-template-columns:repeat(4,1fr); } }
.tnd-card { padding:16px; border-radius:16px; text-align:left;
  border:1px solid rgba(255,255,255,.12); background:rgba(0,0,0,.22); }
.tnd-card .v { font-family:var(--font-figtree), sans-serif; font-size:clamp(20px,2.4vw,26px);
  font-weight:800; color:var(--amber); line-height:1; }
.tnd-card .k { margin-top:6px; font-size:11px; line-height:1.35; color:var(--muted); }
.tnd-totals { display:grid; grid-template-columns:repeat(3,1fr); gap:14px;
  margin:16px auto 0; max-width:560px; padding:18px; text-align:left;
  border-radius:18px; border:1px solid rgba(255,197,61,.26);
  background:rgba(255,197,61,.07); }
.tnd-totals svg { color:var(--amber); }
.tnd-totals .v { margin-top:7px; font-family:var(--font-figtree), sans-serif;
  font-size:clamp(16px,2.1vw,22px); font-weight:800; color:var(--amber); line-height:1; }
.tnd-totals .k { margin-top:4px; font-size:10px; color:var(--muted); }

@media (prefers-reduced-motion: reduce){
  .tnd *, .tnd *::before, .tnd *::after {
    animation-duration:.001ms !important; transition-duration:.001ms !important; }
}
`;

/* ================================================================== */
/* DATA                                                               */
/* ================================================================== */

const campaignData = {
  statewide: {
    screens: 196, playsPerDay: 150,
    reach: 7_000_000, impressions: 31_500_000, avgFrequency: 4.5,
    subtitle: "Across 35 Districts",
    copy: "From daily commuters to waiting passengers, the campaign remains visible across Tamil Nadu.",
    majorCities: ["chennai", "coimbatore", "madurai", "trichy", "salem", "tirunelveli"],
  },
  chennai: {
    premiumHoardings: 8, cityHoardings: 22, busShelters: 40,
    trafficSignalLEDs: 35, metroTrains: 1,
    reach: 9_900_000, impressions: 42_800_000, avgFrequency: 4.3,
    title: "Chennai Takeover", subtitle: "Every stage of the daily commute",
    copy: "Chennai sees the campaign at every stage of the commute — from arterial roads and junctions to shelters and metro travel.",
  },
  restOfTamilNadu: {
    premiumHoardings: 26, hoardings: 40, busShelters: 80,
    reach: 10_800_000, impressions: 41_500_000, avgFrequency: 3.8,
    title: "146 Roadside & Transit Assets",
    subtitle: "Tamil Nadu's largest urban centres & corridors",
    copy: "High-frequency visibility across Tamil Nadu's largest urban centres and commuter corridors.",
    cities: ["Coimbatore", "Madurai", "Trichy", "Salem", "Tiruppur", "Erode"],
  },
  airports: {
    screens: 150,
    reach: 1_500_000, impressions: 4_700_000, avgFrequency: 3.1,
    subtitle: "Across 3 Major Airports",
    copy: "The campaign reaches high-intent travellers across Tamil Nadu's key aviation gateways.",
    hoverCopy: "Departing, arriving and waiting passengers",
    cities: ["Chennai", "Coimbatore", "Trichy"],
  },
  totals: {
    touchpoints: 597, districts: 35, airports: 3, metroTrains: 1,
    reach: 29_200_000, impressions: 120_500_000, avgFrequency: 4.1,
  },
};

type City = { x: number; y: number; label: string; audience: string };

const cities: Record<string, City> = {
  chennai:     { x: 322, y: 96,  label: "Chennai",     audience: "Metro riders, commuters & business traffic" },
  vellore:     { x: 250, y: 70,  label: "Vellore",     audience: "Highway commuters" },
  coimbatore:  { x: 92,  y: 224, label: "Coimbatore",  audience: "Industrial & commuter corridor" },
  tiruppur:    { x: 118, y: 246, label: "Tiruppur",    audience: "Textile-belt daily workforce" },
  erode:       { x: 138, y: 214, label: "Erode",       audience: "Highway & market-town traffic" },
  salem:       { x: 178, y: 188, label: "Salem",       audience: "Cross-state highway commuters" },
  trichy:      { x: 224, y: 268, label: "Trichy",      audience: "Central Tamil Nadu transit hub" },
  thanjavur:   { x: 268, y: 288, label: "Thanjavur",   audience: "Delta-region commuters" },
  madurai:     { x: 200, y: 344, label: "Madurai",     audience: "Southern Tamil Nadu's commercial hub" },
  tirunelveli: { x: 188, y: 420, label: "Tirunelveli", audience: "Southern-belt daily commuters" },
};

const statewideDots = [
  { x: 300, y: 130 }, { x: 270, y: 150 }, { x: 240, y: 110 }, { x: 210, y: 150 },
  { x: 160, y: 130 }, { x: 130, y: 170 }, { x: 105, y: 260 }, { x: 140, y: 290 },
  { x: 170, y: 250 }, { x: 200, y: 220 }, { x: 245, y: 210 }, { x: 260, y: 240 },
  { x: 290, y: 200 }, { x: 250, y: 320 }, { x: 220, y: 360 }, { x: 180, y: 380 },
  { x: 150, y: 350 }, { x: 205, y: 400 }, { x: 175, y: 440 }, { x: 195, y: 460 },
  { x: 240, y: 340 }, { x: 130, y: 320 }, { x: 110, y: 200 }, { x: 280, y: 170 },
];

const TN_PATH =
  "M246 18 C270 22 300 30 320 55 C336 75 344 95 340 118 C337 140 322 152 330 176 C338 200 320 213 318 236 C316 258 300 266 296 288 C293 305 308 312 300 330 C292 346 270 344 262 360 C254 378 262 392 248 408 C236 424 224 420 214 438 C204 456 206 472 190 488 C178 500 168 506 158 500 C150 495 156 480 148 468 C138 452 120 448 112 428 C104 408 114 392 100 374 C88 356 78 348 78 326 C78 306 92 298 86 278 C80 258 66 250 68 228 C70 206 86 198 82 176 C78 154 64 144 70 122 C76 100 96 90 110 74 C126 56 148 48 168 36 C190 24 218 16 246 18 Z";

/* ================================================================== */
/* HELPERS                                                            */
/* ================================================================== */

const xPct = (x: number) => (x / 400) * 100;
const yPct = (y: number) => (y / 520) * 100;

function formatIndian(num: number): string {
  if (num >= 10_000_000) {
    const v = num / 10_000_000;
    return (v % 1 === 0 ? v.toFixed(0) : v.toFixed(2)) + "Cr";
  }
  if (num >= 100_000) {
    const v = num / 100_000;
    return (v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)) + "L";
  }
  return num.toLocaleString("en-IN");
}

type Pt = { x: number; y: number };

const quadPath = (p0: Pt, p1: Pt, p2: Pt) =>
  `M${p0.x} ${p0.y} Q ${p1.x} ${p1.y} ${p2.x} ${p2.y}`;

const arcControl = (a: Pt, b: Pt, bend = 0.28): Pt => ({
  x: (a.x + b.x) / 2 - (b.y - a.y) * bend,
  y: (a.y + b.y) / 2 + (b.x - a.x) * bend,
});

function sampleQuad(p0: Pt, p1: Pt, p2: Pt, steps = 30): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    pts.push({
      x: (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t ** 2 * p2.x,
      y: (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t ** 2 * p2.y,
    });
  }
  return pts;
}

/* ================================================================== */
/* ANIMATED NUMBER                                                    */
/* ================================================================== */

function Num({
  value, suffix = "", decimals = 0, active, duration = 1.2,
}: {
  value: number; suffix?: string; decimals?: number;
  active: boolean; duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!active) return;
    if (reduce) { setDisplay(value); return; }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const raw = (1 - Math.pow(1 - t, 3)) * value;
      setDisplay(decimals > 0 ? Number(raw.toFixed(decimals)) : Math.round(raw));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, value, duration, reduce, decimals]);

  return <>{decimals > 0 ? display.toFixed(decimals) : display}{suffix}</>;
}

/* ================================================================== */
/* MAP PIECES                                                         */
/* ================================================================== */

type MarkerProps = {
  id: string; x: number; y: number;
  size?: "sm" | "md" | "lg"; tone?: "amber" | "red";
  label?: string; audience?: string;
  active?: boolean; animate?: boolean; delay?: number;
  onHover?: (id: string | null) => void;
};

function Marker({
  id, x, y, size = "md", tone = "amber",
  label, active = true, animate = true, delay = 0, onHover,
}: MarkerProps) {
  const reduce = useReducedMotion();
  const d = { sm: 6, md: 10, lg: 16 }[size];
  const c = tone === "red" ? RED : AMBER;

  return (
    <button
      type="button"
      aria-label={label || "Location marker"}
      onMouseEnter={() => onHover?.(id)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(id)}
      onBlur={() => onHover?.(null)}
      style={{
        position: "absolute", left: `${xPct(x)}%`, top: `${yPct(y)}%`,
        transform: "translate(-50%,-50%)",
        width: d + 18, height: d + 18,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "none", border: 0, padding: 0, cursor: "pointer",
        opacity: active ? 1 : 0.14,
        transition: "opacity .6s ease",
        zIndex: active ? 10 : 1,
      }}
    >
      <span style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {!reduce && active && animate && (
          <motion.span
            style={{ position: "absolute", borderRadius: 99, background: c, width: d, height: d }}
            animate={{ opacity: [0.5, 0, 0.5], scale: [1, 2.5, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut", delay }}
          />
        )}
        <span
          style={{
            position: "relative", width: d, height: d, borderRadius: 99,
            background: c, border: "2px solid rgba(255,255,255,.35)",
            boxShadow: `0 0 ${d * 1.5}px ${c}`,
            transition: "width .5s ease, height .5s ease, background .5s ease",
          }}
        />
      </span>
    </button>
  );
}

function Tooltip({ m }: { m: { x: number; y: number; label: string; audience?: string } }) {
  const left = xPct(m.x);
  const flip = left > 62;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.18 }}
      style={{
        position: "absolute", zIndex: 30, width: 190,
        left: `${left}%`, top: `${yPct(m.y)}%`,
        transform: `translate(${flip ? "-104%" : "4%"}, -50%)`,
        borderRadius: 12, padding: "10px 12px", pointerEvents: "none",
        border: "1px solid rgba(255,197,61,.32)",
        background: "rgba(42,5,5,.96)",
        boxShadow: "0 8px 30px rgba(0,0,0,.6)",
      }}
    >
      <p style={{ fontFamily: "var(--font-figtree), sans-serif", fontSize: 13, fontWeight: 700, color: AMBER }}>
        {m.label}
      </p>
      {m.audience && (
        <p style={{ marginTop: 3, fontSize: 11, lineHeight: 1.35, color: "#F0C9C9" }}>
          {m.audience}
        </p>
      )}
    </motion.div>
  );
}

function RouteLine({ a, b, delay = 0 }: { a: Pt; b: Pt; delay?: number }) {
  const c = arcControl(a, b, 0.22);
  const d = quadPath(a, c, b);
  return (
    <g>
      <path d={d} fill="none" stroke={AMBER} strokeWidth="1" strokeOpacity=".28" />
      <motion.path
        d={d} fill="none" stroke={AMBER} strokeWidth="1.6"
        strokeLinecap="round" strokeDasharray="6 10"
        animate={{ strokeDashoffset: [0, -160] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear", delay }}
      />
    </g>
  );
}

function PlaneDot({ pts, delay }: { pts: Pt[]; delay: number }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    let raf = 0;
    let start: number | undefined;
    const frame = (t: number) => {
      if (start === undefined) start = t;
      const e = ((t - start) / 5000 + delay / 5) % 1;
      setI(Math.floor(e * (pts.length - 1)));
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [pts, delay]);

  const p = pts[i] || pts[0];
  const n = pts[Math.min(i + 1, pts.length - 1)];
  const h = (Math.atan2(n.y - p.y, n.x - p.x) * 180) / Math.PI;

  return (
    <g transform={`translate(${p.x},${p.y}) rotate(${h})`}>
      <circle r="6" fill={AMBER} opacity=".2" />
      <path d="M-4 0 L4 0 M0 -4 L4 0 L0 4" stroke="#2A0505" strokeWidth="1.4" fill={AMBER} />
    </g>
  );
}

function FlightPath({ a, b, delay = 0 }: { a: Pt; b: Pt; delay?: number }) {
  const c = arcControl(a, b, 0.32);
  const d = quadPath(a, c, b);
  const pts = useMemo(() => sampleQuad(a, c, b, 30), [a.x, a.y, b.x, b.y]);
  const reduce = useReducedMotion();
  return (
    <g>
      <path d={d} fill="none" stroke={AMBER} strokeWidth="1" strokeOpacity=".34" strokeDasharray="2 6" />
      {!reduce && <PlaneDot pts={pts} delay={delay} />}
    </g>
  );
}

function ChennaiBubble() {
  const items = [
    { Icon: Landmark, label: "Premium hoardings" },
    { Icon: Armchair, label: "Bus shelters" },
    { Icon: TrafficCone, label: "Traffic signal LEDs" },
    { Icon: TrainFront, label: "Branded metro train" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "absolute", zIndex: 20,
        left: `${xPct(cities.chennai.x)}%`, top: `${yPct(cities.chennai.y)}%`,
        width: "min(58%, 210px)", aspectRatio: "1 / 1",
        transform: "translate(6%, -50%)", borderRadius: 99,
        border: "1px solid rgba(255,197,61,.38)",
        background: "rgba(42,5,5,.94)",
        boxShadow: "0 0 60px rgba(255,197,61,.22)",
      }}
    >
      <div style={{ position: "absolute", inset: 12, borderRadius: 99, border: "1px dashed rgba(255,197,61,.22)" }} />
      <div style={{
        position: "relative", height: "100%", display: "grid",
        gridTemplateColumns: "1fr 1fr", placeItems: "center", gap: 4, padding: 22,
      }}>
        {items.map(({ Icon, label }) => (
          <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, textAlign: "center" }}>
            <div style={{
              borderRadius: 99, padding: 8,
              background: "rgba(255,197,61,.13)",
              border: "1px solid rgba(255,197,61,.28)",
            }}>
              <Icon size={15} color={AMBER} />
            </div>
            <span style={{ fontSize: 9, lineHeight: 1.2, color: "#F0C9C9" }}>{label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/* SHARED BLOCKS                                                      */
/* ================================================================== */

function Audience({ reach, impressions, avgFrequency, active }: {
  reach: number; impressions: number; avgFrequency: number; active: boolean;
}) {
  return (
    <div className="tnd-aud">
      <div>
        <Users size={15} />
        <p className="v">{formatIndian(reach)}</p>
        <p className="k">Estimated Reach</p>
      </div>
      <div>
        <Eye size={15} />
        <p className="v">{formatIndian(impressions)}</p>
        <p className="k">Estimated Impressions</p>
      </div>
      <div>
        <Repeat size={15} />
        <p className="v"><Num value={avgFrequency} decimals={1} suffix="x" active={active} /></p>
        <p className="k">Avg. Frequency</p>
      </div>
    </div>
  );
}

function Stat({ value, suffix, label, active }: {
  value: number; suffix?: string; label: string; active: boolean;
}) {
  return (
    <div className="tnd-stat">
      <div className="v"><Num value={value} suffix={suffix} active={active} /></div>
      <p className="k">{label}</p>
    </div>
  );
}

/* ================================================================== */
/* SLIDE 01 — HERO                                                    */
/* ================================================================== */

function SlideHero({ active, onExplore }: { active: boolean; onExplore: () => void }) {
  const reduce = useReducedMotion();
  const stats = [
    { v: campaignData.totals.touchpoints, s: "+", k: "Static & Digital Touchpoints" },
    { v: campaignData.totals.districts, k: "Districts Covered" },
    { v: campaignData.totals.airports, k: "Major Airports" },
    { v: campaignData.totals.metroTrains, k: "Fully Branded Metro Train" },
  ];

  return (
    <div className="tnd-pane tnd-mid">
      <div style={{
        position: "absolute", right: "-6%", top: 0,
        height: "130%", width: "72%", opacity: 0.22, pointerEvents: "none",
      }}>
        <svg viewBox="0 0 400 520" style={{ height: "100%", width: "100%" }}>
          <motion.path
            d={TN_PATH} fill="none" stroke={AMBER} strokeWidth="1.3"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.4, ease: "easeInOut" }}
          />
        </svg>
      </div>

      <div style={{ position: "relative", maxWidth: 900 }}>
        <p className="tnd-eyebrow">Outdoor &amp; Transit Media Plan · Tamil Nadu</p>
        <h1 className="tnd-h1">
          TAMIL NADU,
          <br />
          <em>COVERED</em>
        </h1>
        <p className="tnd-lead">
          One connected outdoor and transit media network across the state.
        </p>
        <button className="tnd-cta" onClick={onExplore} type="button">
          Explore the Network <ArrowRight size={16} />
        </button>

        <div className="tnd-hero-stats">
          {stats.map((s) => (
            <div key={s.k}>
              <div className="v"><Num value={s.v} suffix={s.s} active={active} /></div>
              <p className="k">{s.k}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* SLIDE 02 — NETWORK                                                 */
/* ================================================================== */

const MODES = [
  { id: "statewide", label: "Statewide Digital" },
  { id: "chennai", label: "Chennai Takeover" },
  { id: "restOfTN", label: "Rest of Tamil Nadu" },
  { id: "airports", label: "Airport Network" },
] as const;

type ModeId = (typeof MODES)[number]["id"];

function SlideNetwork({ active }: { active: boolean }) {
  const [mode, setMode] = useState<ModeId>("statewide");
  const [hovered, setHovered] = useState<string | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const n = (i + (e.key === "ArrowRight" ? 1 : -1) + MODES.length) % MODES.length;
    setMode(MODES[n].id);
    tabRefs.current[n]?.focus();
  };

  const restIds = campaignData.restOfTamilNadu.cities.map((c) => c.toLowerCase());
  const airIds = campaignData.airports.cities.map((c) => c.toLowerCase());

  const markers: MarkerProps[] = useMemo(() => {
    const l: MarkerProps[] = [];
    if (mode === "statewide") {
      statewideDots.forEach((d, i) =>
        l.push({ id: `d${i}`, x: d.x, y: d.y, size: "sm", tone: "red", delay: i * 0.05 })
      );
      campaignData.statewide.majorCities.forEach((c, i) =>
        l.push({
          id: c, x: cities[c].x, y: cities[c].y, size: "lg", tone: "amber",
          label: cities[c].label, audience: "Bus stand LED screens", delay: 0.3 + i * 0.08,
        })
      );
    } else if (mode === "chennai") {
      Object.entries(cities).forEach(([k, c]) => {
        if (k !== "chennai") l.push({ id: k, x: c.x, y: c.y, size: "sm", tone: "red", active: false });
      });
      l.push({
        id: "chennai", x: cities.chennai.x, y: cities.chennai.y,
        size: "lg", tone: "amber", label: "Chennai",
        audience: "Roads, shelters, signals & metro",
      });
    } else if (mode === "restOfTN") {
      Object.entries(cities).forEach(([k, c]) => {
        const on = restIds.includes(k);
        l.push({
          id: k, x: c.x, y: c.y, size: on ? "lg" : "sm", tone: on ? "amber" : "red",
          active: on, label: on ? c.label : undefined, audience: on ? c.audience : undefined,
        });
      });
    } else {
      Object.entries(cities).forEach(([k, c]) => {
        const on = airIds.includes(k);
        l.push({
          id: k, x: c.x, y: c.y, size: on ? "lg" : "sm", tone: on ? "amber" : "red",
          active: on, label: on ? `${c.label} Airport` : undefined,
          audience: on ? campaignData.airports.hoverCopy : undefined,
        });
      });
    }
    return l;
  }, [mode, restIds, airIds]);

  const hov = markers.find((m) => m.id === hovered && m.label);
  const camScale = mode === "chennai" ? 1.12 : mode === "airports" ? 1.02 : 1;
  const chain = ["coimbatore", "tiruppur", "erode", "salem", "trichy", "madurai"];
  const pairs: [string, string][] = [
    ["chennai", "coimbatore"], ["chennai", "trichy"], ["coimbatore", "trichy"],
  ];

  return (
    <div className="tnd-pane">
      <div style={{ maxWidth: 620 }}>
        <p className="tnd-eyebrow">The Network</p>
        <h2 className="tnd-h2">One map. Four ways to look at it.</h2>
      </div>

      <div className="tnd-tabs" role="tablist" aria-label="Campaign view">
        {MODES.map((m, i) => (
          <button
            key={m.id}
            ref={(el) => { tabRefs.current[i] = el; }}
            role="tab"
            aria-selected={mode === m.id}
            tabIndex={mode === m.id ? 0 : -1}
            onKeyDown={(e) => onKey(e, i)}
            onClick={() => { setMode(m.id); setHovered(null); }}
            className="tnd-tab"
            type="button"
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="tnd-split">
        <motion.div
          className="tnd-mapwrap"
          animate={{ scale: camScale }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            transformOrigin:
              mode === "chennai"
                ? `${xPct(cities.chennai.x)}% ${yPct(cities.chennai.y)}%`
                : "50% 50%",
          }}
        >
          <svg
            viewBox="0 0 400 520"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="tndGlow" cx="50%" cy="45%" r="65%">
                <stop offset="0%" stopColor="#6B1414" />
                <stop offset="100%" stopColor="#3A0707" />
              </radialGradient>
              <linearGradient id="tndFill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7A1A1A" />
                <stop offset="100%" stopColor="#590F0F" />
              </linearGradient>
            </defs>
            <ellipse cx="200" cy="260" rx="190" ry="230" fill="url(#tndGlow)" opacity=".65" />
            <path d={TN_PATH} fill="url(#tndFill)" stroke="rgba(255,197,61,.42)" strokeWidth="1.5" />
            <path d={TN_PATH} fill="none" stroke={AMBER} strokeOpacity=".1" strokeWidth="7" />

            {mode === "restOfTN" &&
              chain.slice(0, -1).map((c, i) => (
                <RouteLine key={c} a={cities[c]} b={cities[chain[i + 1]]} delay={i * 0.3} />
              ))}
            {mode === "airports" &&
              pairs.map(([a, b], i) => (
                <FlightPath key={a + b} a={cities[a]} b={cities[b]} delay={i * 0.6} />
              ))}
          </svg>

          {markers.map((m) => (
            <Marker key={m.id} {...m} animate={active} onHover={setHovered} />
          ))}

          {mode === "chennai" && <ChennaiBubble />}

          <AnimatePresence>
            {hov && hov.label && (
              <Tooltip m={{ x: hov.x, y: hov.y, label: hov.label, audience: hov.audience }} />
            )}
          </AnimatePresence>
        </motion.div>

        <div className="tnd-scroll">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35 }}
            >
              <ModePanel mode={mode} active={active} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ModePanel({ mode, active }: { mode: ModeId; active: boolean }) {
  if (mode === "statewide") {
    const d = campaignData.statewide;
    return (
      <div>
        <p className="tnd-eyebrow">Mode 01</p>
        <h3 className="tnd-h3">{d.screens}</h3>
        <p className="tnd-eyeline">Bus Stand LED Screens</p>
        <p className="tnd-sub">{d.subtitle}</p>
        <Audience reach={d.reach} impressions={d.impressions} avgFrequency={d.avgFrequency} active={active} />
        <div className="tnd-grid">
          <Stat value={d.playsPerDay} label="Plays per screen, per day" active={active} />
          <Stat value={15} suffix="-Day" label="Campaign duration" active={active} />
          <Stat value={35} label="Districts, continuous visibility" active={active} />
        </div>
        <p className="tnd-lead" style={{ marginTop: 18, fontSize: 13 }}>{d.copy}</p>
      </div>
    );
  }

  if (mode === "chennai") {
    const d = campaignData.chennai;
    return (
      <div>
        <p className="tnd-eyebrow">Mode 02</p>
        <h3 className="tnd-h3">{d.title}</h3>
        <p className="tnd-sub">{d.subtitle}</p>
        <Audience reach={d.reach} impressions={d.impressions} avgFrequency={d.avgFrequency} active={active} />
        <div className="tnd-grid">
          <Stat value={d.premiumHoardings} label="Premium Hoardings" active={active} />
          <Stat value={d.cityHoardings} label="City Hoardings" active={active} />
          <Stat value={d.busShelters} label="Bus Shelters" active={active} />
          <Stat value={d.trafficSignalLEDs} label="Traffic Signal LEDs" active={active} />
          <Stat value={d.metroTrains} label="Fully Branded Metro Train" active={active} />
        </div>
        <p className="tnd-lead" style={{ marginTop: 18, fontSize: 13 }}>{d.copy}</p>
      </div>
    );
  }

  if (mode === "restOfTN") {
    const d = campaignData.restOfTamilNadu;
    return (
      <div>
        <p className="tnd-eyebrow">Mode 03</p>
        <h3 className="tnd-h3">{d.title}</h3>
        <p className="tnd-sub">{d.subtitle}</p>
        <Audience reach={d.reach} impressions={d.impressions} avgFrequency={d.avgFrequency} active={active} />
        <div className="tnd-grid">
          <Stat value={d.premiumHoardings} label="Premium Hoardings" active={active} />
          <Stat value={d.hoardings} label="Highway & City Hoardings" active={active} />
          <Stat value={d.busShelters} label="Bus Shelters" active={active} />
        </div>
        <div className="tnd-chips">
          {d.cities.map((c) => <span key={c} className="tnd-chip">{c}</span>)}
        </div>
        <p className="tnd-lead" style={{ marginTop: 18, fontSize: 13 }}>{d.copy}</p>
      </div>
    );
  }

  const d = campaignData.airports;
  return (
    <div>
      <p className="tnd-eyebrow">Mode 04</p>
      <h3 className="tnd-h3">{d.screens}</h3>
      <p className="tnd-eyeline">Airport Screens</p>
      <p className="tnd-sub">{d.subtitle}</p>
      <Audience reach={d.reach} impressions={d.impressions} avgFrequency={d.avgFrequency} active={active} />
      <div className="tnd-grid">
        <Stat value={3} label="Major Airports" active={active} />
        <Stat value={10} suffix="-Day" label="Campaign duration" active={active} />
        <Stat value={150} label="Total airport screens" active={active} />
      </div>
      <div className="tnd-chips">
        {d.cities.map((c) => <span key={c} className="tnd-chip">{c}</span>)}
      </div>
      <p className="tnd-lead" style={{ marginTop: 18, fontSize: 13 }}>{d.copy}</p>
    </div>
  );
}

/* ================================================================== */
/* SLIDE 03 — JOURNEY                                                 */
/* ================================================================== */

function SlideJourney({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  const stages = [
    { Icon: Route, label: "Road" },
    { Icon: Signpost, label: "Bus Stop" },
    { Icon: Bus, label: "Bus Stand" },
    { Icon: TrafficCone, label: "Traffic Signal" },
    { Icon: TrainFront, label: "Metro" },
    { Icon: Plane, label: "Airport" },
  ];

  return (
    <div className="tnd-pane tnd-mid">
      <div style={{ maxWidth: 640 }}>
        <p className="tnd-eyebrow">The Journey</p>
        <h2 className="tnd-h2">One Campaign. Every Part of the Journey.</h2>
        <p className="tnd-lead">
          Not one advertisement in one location — a connected media network
          accompanying audiences throughout their daily movement.
        </p>
      </div>

      <div className="tnd-journey">
        <div className="tnd-journey-inner">
          <div className="tnd-line" />
          {!reduce && active && (
            <motion.div
              className="tnd-spark"
              animate={{ left: ["0%", "97%"] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
            />
          )}
          {stages.map(({ Icon, label }, i) => (
            <motion.div
              key={label}
              className="tnd-stage"
              initial={{ opacity: 0, y: 12 }}
              animate={active ? { opacity: 1, y: 0 } : { opacity: 0.35, y: 6 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <span className="tnd-ring"><Icon size={20} /></span>
              <span className="tnd-stage-lbl">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* SLIDE 04 — IMPACT                                                  */
/* ================================================================== */

function SlideImpact({ active }: { active: boolean }) {
  const cards = [
    { v: "196", k: "Statewide LED Screens" },
    { v: "106", k: "Chennai Assets + Metro" },
    { v: "146", k: "Rest-of-Tamil-Nadu Assets" },
    { v: "150", k: "Airport Screens" },
  ];
  const t = campaignData.totals;

  return (
    <div className="tnd-pane tnd-mid">
      <div className="tnd-glow" />
      <div style={{ position: "relative", maxWidth: 900, margin: "0 auto", textAlign: "center", width: "100%" }}>
        <h2 className="tnd-impact-h">
          FROM STATEWIDE SCALE
          <br />
          TO <em>CITY-LEVEL FREQUENCY</em>
        </h2>
        <p className="tnd-lead" style={{ margin: "14px auto 0" }}>
          A campaign designed to remain visible wherever Tamil Nadu moves.
        </p>

        <div className="tnd-cards">
          {cards.map((c, i) => (
            <motion.div
              key={c.k}
              className="tnd-card"
              initial={{ opacity: 0, y: 20 }}
              animate={active ? { opacity: 1, y: 0 } : { opacity: 0.35, y: 10 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <p className="v">{c.v}</p>
              <p className="k">{c.k}</p>
            </motion.div>
          ))}
        </div>

        <div className="tnd-totals">
          <div>
            <Users size={16} />
            <p className="v">{formatIndian(t.reach)}</p>
            <p className="k">Projected Reach</p>
          </div>
          <div>
            <Eye size={16} />
            <p className="v">{formatIndian(t.impressions)}</p>
            <p className="k">Projected Impressions</p>
          </div>
          <div>
            <Repeat size={16} />
            <p className="v"><Num value={t.avgFrequency} decimals={1} suffix="x" active={active} /></p>
            <p className="k">Blended Avg. Frequency</p>
          </div>
        </div>

        <button className="tnd-cta ghost" type="button">
          View Complete Media Plan <ChevronRight size={16} />
        </button>
        <p className="tnd-note">
          Sums are indicative and not de-duplicated for cross-format audience overlap.
        </p>
      </div>
    </div>
  );
}

/* ================================================================== */
/* STACKING SHELL                                                     */
/* ================================================================== */

type SlideDef = {
  id: string;
  label: string;
  render: (active: boolean, goTo: (i: number) => void) => React.ReactNode;
};

const SLIDES: SlideDef[] = [
  { id: "hero", label: "Tamil Nadu, Covered", render: (a, go) => <SlideHero active={a} onExplore={() => go(1)} /> },
  { id: "network", label: "The Network", render: (a) => <SlideNetwork active={a} /> },
  { id: "journey", label: "The Journey", render: (a) => <SlideJourney active={a} /> },
  { id: "impact", label: "The Impact", render: (a) => <SlideImpact active={a} /> },
];

function StackSlide({
  slide, index, total, progress, goTo,
}: {
  slide: SlideDef; index: number; total: number;
  progress: MotionValue<number>;
  goTo: (i: number) => void;
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(index === 0);

  const band = 1 / total;
  const enter = index * band;
  const settle = enter + band * 0.4;
  const leave = (index + 1) * band;
  const gone = Math.min(1, leave + band * 0.55);

  // arrive from below → pin → recede as the next slide covers it
  const y = useTransform(progress, [enter, settle, leave, gone], [46, 0, 0, -18]);
  const scale = useTransform(progress, [enter, settle, leave, gone], [1, 1, 1, 0.94]);
  const opacity = useTransform(progress, [enter, settle, leave, gone], [1, 1, 1, 0.45]);
  const blur = useTransform(progress, [leave, gone], [0, 4]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  useEffect(() => {
    const unsub = progress.on("change", (v) => {
      const on = v >= enter - band * 0.3 && v < leave;
      setActive(on);
    });
    return () => unsub();
  }, [progress, enter, leave, band]);

  return (
    <motion.section
      className="tnd-slide"
      aria-label={`Slide ${index + 1} of ${total}: ${slide.label}`}
      style={reduce ? { zIndex: index + 1 } : { y, scale, opacity, filter, zIndex: index + 1 }}
    >
      <span className="tnd-count">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
      {slide.render(reduce ? true : active, goTo)}
    </motion.section>
  );
}

/* ================================================================== */
/* ROOT                                                               */
/* ================================================================== */

export default function OfflineDeck() {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef(0);
  const stepLockRef = useRef(false);
  const stepLockTimeoutRef = useRef<number | null>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    container: scrollportRef,
    offset: ["start start", "end end"],
  });

  const goTo = useCallback((i: number) => {
    const port = scrollportRef.current;
    if (!port) return;
    const clamped = Math.max(0, Math.min(SLIDES.length - 1, i));
    currentRef.current = clamped;
    port.scrollTo({
      top: port.clientHeight * clamped,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [reduce]);

  // Keep currentRef in sync with any scroll the intent handler below didn't
  // itself trigger (e.g. touch swipes, which the site's wheel/keydown
  // hijacker doesn't intercept).
  useEffect(() => {
    const port = scrollportRef.current;
    if (!port) return;
    const onScroll = () => {
      if (port.clientHeight === 0) return;
      currentRef.current = Math.round(port.scrollTop / port.clientHeight);
    };
    port.addEventListener("scroll", onScroll, { passive: true });
    return () => port.removeEventListener("scroll", onScroll);
  }, []);

  // The site hijacks wheel/arrow input to jump between whole <section>s.
  // While this deck is open, claim that input for itself so scrolling and
  // arrow keys step through its own slides instead of moving the page —
  // the same "section-jump:intent" escape hatch other sections use.
  useEffect(() => {
    const ownSection = rootRef.current?.closest("section");
    const onIntent = (event: Event) => {
      const detail = (event as CustomEvent<{ direction: 1 | -1; section: HTMLElement }>).detail;
      if (ownSection && detail.section !== ownSection) return;
      event.preventDefault();

      if (stepLockRef.current) return;

      stepLockRef.current = true;
      goTo(currentRef.current + detail.direction);
      stepLockTimeoutRef.current = window.setTimeout(() => {
        stepLockRef.current = false;
        stepLockTimeoutRef.current = null;
      }, 650);
    };
    window.addEventListener("section-jump:intent", onIntent);
    return () => {
      window.removeEventListener("section-jump:intent", onIntent);
      if (stepLockTimeoutRef.current !== null) {
        window.clearTimeout(stepLockTimeoutRef.current);
      }
    };
  }, [goTo]);

  return (
    <div className="tnd" ref={rootRef}>
      <style>{CSS}</style>
      <div className="tnd-scrollport" ref={scrollportRef}>
        <div
          className="tnd-track"
          ref={trackRef}
          style={{ height: `calc(var(--stack-h) * ${SLIDES.length})` }}
        >
          {SLIDES.map((s, i) => (
            <StackSlide
              key={s.id}
              slide={s}
              index={i}
              total={SLIDES.length}
              progress={scrollYProgress}
              goTo={goTo}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
