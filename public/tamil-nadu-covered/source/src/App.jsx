import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion, useInView } from "framer-motion";
import {
  MapPin, Bus, TrafficCone, TrainFront, Plane, Route, Signpost,
  Building2, Armchair, MonitorPlay, ArrowRight, Landmark, Clock,
  Layers, ChevronRight, Eye, Repeat, Users,
} from "lucide-react";
import { campaignData, cities, statewideDots } from "./data.js";

/* ============================================================================
   TAMIL NADU SILHOUETTE — a stylised, presentation-friendly outline.
   Not a surveyed boundary. viewBox: 0 0 400 520.
============================================================================ */
const TN_PATH =
  "M246 18 C270 22 300 30 320 55 C336 75 344 95 340 118 C337 140 322 152 330 176 " +
  "C338 200 320 213 318 236 C316 258 300 266 296 288 C293 305 308 312 300 330 " +
  "C292 346 270 344 262 360 C254 378 262 392 248 408 C236 424 224 420 214 438 " +
  "C204 456 206 472 190 488 C178 500 168 506 158 500 C150 495 156 480 148 468 " +
  "C138 452 120 448 112 428 C104 408 114 392 100 374 C88 356 78 348 78 326 " +
  "C78 306 92 298 86 278 C80 258 66 250 68 228 C70 206 86 198 82 176 " +
  "C78 154 64 144 70 122 C76 100 96 90 110 74 C126 56 148 48 168 36 " +
  "C190 24 218 16 246 18 Z";

const pct = (v, max) => (v / max) * 100;
const xPct = (x) => pct(x, 400);
const yPct = (y) => pct(y, 520);

/* Indian-format shorthand for large audience numbers: 70,00,000 -> "70L",
   3,15,00,000 -> "3.15Cr". Matches how these figures are quoted in the
   underlying media-planning sheet. */
function formatIndian(num) {
  if (num >= 1e7) {
    const v = num / 1e7;
    return (v % 1 === 0 ? v.toFixed(0) : v.toFixed(2)) + "Cr";
  }
  if (num >= 1e5) {
    const v = num / 1e5;
    return (v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)) + "L";
  }
  return num.toLocaleString("en-IN");
}

/* Sample points along a quadratic bezier for route/flight-path animation */
function sampleQuad(p0, p1, p2, steps = 24) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t ** 2 * p2.x;
    const y = (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t ** 2 * p2.y;
    pts.push({ x, y });
  }
  return pts;
}

function quadPath(p0, p1, p2) {
  return "M" + p0.x + " " + p0.y + " Q " + p1.x + " " + p1.y + " " + p2.x + " " + p2.y;
}

/* Bend control point out from the straight line between two cities, used to
   fake a highway-corridor / flight-arc curve without real geodata. */
function arcControl(a, b, bend = 0.28) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return { x: mx - dy * bend, y: my + dx * bend };
}

/* ============================================================================
   ANIMATED NUMBER — counts up when scrolled into view
============================================================================ */
function AnimatedNumber({ value, suffix = "", duration = 1.3, className = "", decimals = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [display, setDisplay] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(value);
      return;
    }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      const raw = eased * value;
      setDisplay(decimals > 0 ? Number(raw.toFixed(decimals)) : Math.round(raw));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduce, decimals]);

  return (
    <span ref={ref} className={className}>
      {decimals > 0 ? display.toFixed(decimals) : display}
      {suffix}
    </span>
  );
}

/* ============================================================================
   AUDIENCE STATS — Estimated Reach / Impressions / Avg. Frequency
   Shown as a distinct "outcome" strip, separate from the asset-count grid.
============================================================================ */
function AudienceStats({ reach, impressions, avgFrequency }) {
  const items = [
    { icon: Users, value: formatIndian(reach), label: "Estimated Reach" },
    { icon: Eye, value: formatIndian(impressions), label: "Estimated Impressions" },
    { icon: Repeat, value: null, label: "Avg. Frequency", freq: avgFrequency },
  ];
  return (
    <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-[#4f9dff]/15 bg-[#4f9dff]/[0.04] p-4">
      {items.map(({ icon: Icon, value, label, freq }) => (
        <div key={label} className="flex flex-col items-start gap-1.5">
          <Icon size={15} className="text-[#4f9dff]" />
          <p className="font-display text-xl font-bold text-white sm:text-2xl">
            {freq !== undefined ? <AnimatedNumber value={freq} decimals={1} suffix="x" /> : value}
          </p>
          <p className="text-[11px] leading-snug text-slate-500">{label}</p>
        </div>
      ))}
    </div>
  );
}

/* ============================================================================
   MAP MARKER — HTML button positioned over the SVG (keyboard accessible)
============================================================================ */
function MapMarker({ id, x, y, size = "md", tone = "blue", label, sub, icon: Icon,
  active = true, onHover, delay = 0 }) {
  const reduce = useReducedMotion();
  const dims = { sm: 6, md: 10, lg: 16 }[size];
  const toneColor = tone === "orange" ? "#f7a83e" : tone === "white" ? "#f8fafc" : "#4f9dff";

  return (
    <button
      type="button"
      aria-label={label || "Location marker"}
      className="absolute -translate-x-1/2 -translate-y-1/2 outline-none group"
      style={{
        left: xPct(x) + "%",
        top: yPct(y) + "%",
        width: dims + 18,
        height: dims + 18,
        opacity: active ? 1 : 0.12,
        transition: "opacity 0.6s ease",
        zIndex: active ? 10 : 1,
      }}
      onMouseEnter={() => onHover && onHover(id)}
      onMouseLeave={() => onHover && onHover(null)}
      onFocus={() => onHover && onHover(id)}
      onBlur={() => onHover && onHover(null)}
      onClick={() => onHover && onHover(id)}
    >
      <span className="relative flex items-center justify-center w-full h-full">
        {!reduce && active && (
          <motion.span
            className="absolute rounded-full"
            style={{ background: toneColor, width: dims, height: dims }}
            initial={{ opacity: 0.5, scale: 1 }}
            animate={{ opacity: [0.45, 0, 0.45], scale: [1, 2.4, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut", delay }}
          />
        )}
        <motion.span
          className="relative rounded-full ring-2 ring-white/30 focus-visible:ring-white"
          style={{
            width: dims,
            height: dims,
            background: toneColor,
            boxShadow: "0 0 " + (dims * 1.4) + "px " + toneColor,
          }}
          initial={reduce ? false : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay }}
        />
        {Icon && (
          <span className="absolute opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity -top-6 text-white/90">
            <Icon size={14} strokeWidth={2} />
          </span>
        )}
      </span>
    </button>
  );
}

/* ============================================================================
   TOOLTIP — small floating card near the hovered marker
============================================================================ */
function MarkerTooltip({ marker }) {
  if (!marker) return null;
  const left = xPct(marker.x);
  const top = yPct(marker.y);
  const flip = left > 62;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.18 }}
      className="pointer-events-none absolute z-30 w-48 rounded-lg border border-white/10 bg-[#0b1120]/95 px-3 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-sm"
      style={{
        left: left + "%",
        top: top + "%",
        transform: "translate(" + (flip ? "-104%" : "4%") + ", -50%)",
      }}
    >
      <p className="font-display text-sm font-semibold text-white">{marker.label}</p>
      {marker.audience && <p className="mt-0.5 text-[11px] leading-snug text-slate-400">{marker.audience}</p>}
    </motion.div>
  );
}

/* ============================================================================
   ROUTE LINE — animated dashed corridor between two points
============================================================================ */
function RouteLine({ a, b, bend = 0.22, color = "#4f9dff", delay = 0, dim = false }) {
  const c = arcControl(a, b, bend);
  const d = quadPath(a, c, b);
  return (
    <g style={{ opacity: dim ? 0.1 : 0.8, transition: "opacity 0.6s ease" }}>
      <path d={d} fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.25" />
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray="6 10"
        initial={{ strokeDashoffset: 0 }}
        animate={{ strokeDashoffset: -160 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear", delay }}
      />
    </g>
  );
}

/* ============================================================================
   FLIGHT PATH — arc with a small moving plane icon
============================================================================ */
function FlightPath({ a, b, delay = 0 }) {
  const c = arcControl(a, b, 0.32);
  const d = quadPath(a, c, b);
  const pts = useMemo(() => sampleQuad(a, c, b, 30), [a.x, a.y, b.x, b.y]);
  const reduce = useReducedMotion();
  const angle = useMemo(() => {
    const dx = b.x - a.x, dy = b.y - a.y;
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  }, [a, b]);

  return (
    <g>
      <path d={d} fill="none" stroke="#f7a83e" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="2 6" />
      {!reduce && (
        <motion.g
          animate={{ cx: pts.map((p) => p.x), cy: pts.map((p) => p.y) }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear", delay }}
        >
          <PlaneDot pts={pts} delay={delay} angle={angle} />
        </motion.g>
      )}
    </g>
  );
}

function PlaneDot({ pts, delay, angle }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    let raf, start;
    const dur = 5000;
    const frame = (t) => {
      if (!start) start = t;
      const elapsed = ((t - start) / dur + delay / 5) % 1;
      setI(Math.floor(elapsed * (pts.length - 1)));
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [pts, delay]);
  const p = pts[i] || pts[0];
  const next = pts[Math.min(i + 1, pts.length - 1)];
  const heading = (Math.atan2(next.y - p.y, next.x - p.x) * 180) / Math.PI;
  return (
    <g transform={"translate(" + p.x + "," + p.y + ") rotate(" + heading + ")"}>
      <circle r="6" fill="#f7a83e" opacity="0.18" />
      <path d="M-4 0 L4 0 M0 -4 L4 0 L0 4" stroke="#0b1120" strokeWidth="1.4" fill="#f7a83e" />
    </g>
  );
}

/* ============================================================================
   CHENNAI DETAIL BUBBLE
============================================================================ */
function ChennaiBubble() {
  const items = [
    { icon: Landmark, label: "Premium hoardings" },
    { icon: Armchair, label: "Bus shelters" },
    { icon: TrafficCone, label: "Traffic signal LEDs" },
    { icon: TrainFront, label: "Branded metro train" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="absolute z-20 rounded-full border border-[#f7a83e]/30 bg-[#0b1120]/90 backdrop-blur-sm shadow-[0_0_60px_rgba(247,168,62,0.15)]"
      style={{
        left: xPct(cities.chennai.x) + "%",
        top: yPct(cities.chennai.y) + "%",
        width: "min(58%, 260px)",
        aspectRatio: "1 / 1",
        transform: "translate(6%, -50%)",
      }}
    >
      <div className="absolute inset-3 rounded-full border border-dashed border-white/10" />
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <motion.path
          d="M 20 70 Q 50 20 80 70"
          fill="none"
          stroke="#4f9dff"
          strokeWidth="1.4"
          strokeDasharray="4 6"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -80 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </svg>
      <div className="relative grid h-full w-full grid-cols-2 place-items-center gap-1 p-6">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="group flex flex-col items-center gap-1 text-center">
            <div className="rounded-full bg-white/5 p-2 ring-1 ring-white/10">
              <Icon size={16} className="text-[#f7a83e]" />
            </div>
            <span className="text-[9px] leading-tight text-slate-400">{label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ============================================================================
   MODE CONFIG — drives filters, stats panel copy, and map behaviour
============================================================================ */
const MODES = [
  { id: "statewide", label: "Statewide Digital" },
  { id: "chennai", label: "Chennai Takeover" },
  { id: "restOfTN", label: "Rest of Tamil Nadu" },
  { id: "airports", label: "Airport Network" },
];

/* ============================================================================
   MAP SECTION
============================================================================ */
function MapSection({ id }) {
  const [mode, setMode] = useState("statewide");
  const [hovered, setHovered] = useState(null);
  const reduce = useReducedMotion();
  const tabRefs = useRef([]);

  const onTabKeyDown = (e, idx) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const dir = e.key === "ArrowRight" ? 1 : -1;
      const next = (idx + dir + MODES.length) % MODES.length;
      setMode(MODES[next].id);
      tabRefs.current[next]?.focus();
    }
  };

  const majorCityIds = campaignData.statewide.majorCities;
  const restCityIds = campaignData.restOfTamilNadu.cities.map((c) => c.toLowerCase());
  const airportCityIds = campaignData.airports.cities.map((c) => c.toLowerCase());

  // Build the marker list + tooltip metadata for the active mode
  const markers = useMemo(() => {
    const list = [];
    if (mode === "statewide") {
      statewideDots.forEach((d, i) =>
        list.push({ id: "dot-" + i, x: d.x, y: d.y, size: "sm", tone: "blue", delay: i * 0.05 })
      );
      majorCityIds.forEach((c, i) =>
        list.push({
          id: c, x: cities[c].x, y: cities[c].y, size: "lg", tone: "orange",
          label: cities[c].label, audience: "Bus stand LED screens", icon: MonitorPlay,
          delay: 0.3 + i * 0.08,
        })
      );
    } else if (mode === "chennai") {
      Object.entries(cities).forEach(([key, c]) => {
        if (key === "chennai") return;
        list.push({ id: key, x: c.x, y: c.y, size: "sm", tone: "blue", active: false });
      });
      list.push({
        id: "chennai", x: cities.chennai.x, y: cities.chennai.y, size: "lg", tone: "orange",
        label: "Chennai", audience: "Roads, shelters, signals & metro", icon: Building2,
      });
    } else if (mode === "restOfTN") {
      Object.entries(cities).forEach(([key, c]) => {
        const isHighlighted = restCityIds.includes(key);
        list.push({
          id: key, x: c.x, y: c.y,
          size: isHighlighted ? "lg" : "sm",
          tone: isHighlighted ? "orange" : "blue",
          active: isHighlighted,
          label: isHighlighted ? c.label : undefined,
          audience: isHighlighted ? c.audience : undefined,
          icon: isHighlighted ? Building2 : undefined,
        });
      });
    } else if (mode === "airports") {
      Object.entries(cities).forEach(([key, c]) => {
        const isAirport = airportCityIds.includes(key);
        list.push({
          id: key, x: c.x, y: c.y,
          size: isAirport ? "lg" : "sm",
          tone: isAirport ? "orange" : "blue",
          active: isAirport,
          label: isAirport ? c.label + " Airport" : undefined,
          audience: isAirport ? campaignData.airports.hoverCopy : undefined,
          icon: isAirport ? Plane : undefined,
        });
      });
    }
    return list;
  }, [mode]);

  const hoveredMarker = markers.find((m) => m.id === hovered && m.label);

  // Camera emphasis: gentle scale + transform-origin shift per mode
  const cameraStyle = useMemo(() => {
    if (reduce) return {};
    if (mode === "chennai") {
      return { transformOrigin: xPct(cities.chennai.x) + "% " + yPct(cities.chennai.y) + "%" };
    }
    return { transformOrigin: "50% 50%" };
  }, [mode, reduce]);
  const cameraScale = mode === "chennai" ? 1.12 : mode === "airports" ? 1.02 : 1;

  const restChain = ["coimbatore", "tiruppur", "erode", "salem", "trichy", "madurai"];
  const airportPairs = [
    ["chennai", "coimbatore"],
    ["chennai", "trichy"],
    ["coimbatore", "trichy"],
  ];

  return (
    <section id={id} className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
      <div className="mb-12 max-w-2xl">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-[#4f9dff]">
          The Network
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
          One map. Four ways to look at it.
        </h2>
      </div>

      {/* Filter tabs */}
      <div
        role="tablist"
        aria-label="Campaign view"
        className="mb-10 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {MODES.map((m, idx) => (
          <button
            key={m.id}
            ref={(el) => (tabRefs.current[idx] = el)}
            role="tab"
            aria-selected={mode === m.id}
            tabIndex={mode === m.id ? 0 : -1}
            onKeyDown={(e) => onTabKeyDown(e, idx)}
            onClick={() => { setMode(m.id); setHovered(null); }}
            className={
              "shrink-0 whitespace-nowrap rounded-full border px-5 py-2.5 font-display text-sm font-medium transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f9dff] " +
              (mode === m.id
                ? "border-[#4f9dff]/60 bg-[#4f9dff]/15 text-white shadow-[0_0_24px_rgba(79,157,255,0.25)]"
                : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-slate-200")
            }
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-14">
        {/* MAP */}
        <motion.div
          animate={{ scale: cameraScale }}
          style={cameraStyle}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative order-1 mx-auto aspect-[400/520] w-full max-w-md lg:max-w-none"
        >
          <svg viewBox="0 0 400 520" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <defs>
              <radialGradient id="mapGlow" cx="50%" cy="45%" r="65%">
                <stop offset="0%" stopColor="#1c2b4a" />
                <stop offset="100%" stopColor="#131b2e" />
              </radialGradient>
              <linearGradient id="mapFill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3a4257" />
                <stop offset="100%" stopColor="#2b3245" />
              </linearGradient>
            </defs>
            <ellipse cx="200" cy="260" rx="190" ry="230" fill="url(#mapGlow)" opacity="0.6" />
            <path d={TN_PATH} fill="url(#mapFill)" stroke="#5b6478" strokeWidth="1.5" />
            <path d={TN_PATH} fill="none" stroke="#4f9dff" strokeOpacity="0.12" strokeWidth="6" />

            {mode === "restOfTN" &&
              restChain.slice(0, -1).map((c, i) => (
                <RouteLine key={c} a={cities[c]} b={cities[restChain[i + 1]]} delay={i * 0.3} />
              ))}

            {mode === "airports" &&
              airportPairs.map(([a, b]) => (
                <FlightPath key={a + b} a={cities[a]} b={cities[b]} delay={Math.random() * 1.5} />
              ))}
          </svg>

          {markers.map((m) => (
            <MapMarker key={m.id} {...m} onHover={setHovered} />
          ))}

          {mode === "chennai" && <ChennaiBubble />}

          <AnimatePresence>
            {hoveredMarker && <MarkerTooltip marker={hoveredMarker} />}
          </AnimatePresence>

          <p className="pointer-events-none absolute bottom-1 left-1 font-display text-[9px] uppercase tracking-[0.2em] text-slate-500">
            Representative placements — not to scale
          </p>
        </motion.div>

        {/* INFO PANEL */}
        <div className="order-2 min-h-[380px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <InfoPanel mode={mode} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, suffix, label }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
      <div className="font-display text-3xl font-bold text-white sm:text-4xl">
        <AnimatedNumber value={value} suffix={suffix} />
      </div>
      <p className="mt-1 text-xs leading-snug text-slate-400">{label}</p>
    </div>
  );
}

function InfoPanel({ mode }) {
  if (mode === "statewide") {
    const d = campaignData.statewide;
    return (
      <div>
        <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-[#f7a83e]">Mode 01</p>
        <h3 className="mt-3 font-display text-4xl font-bold leading-tight text-white sm:text-5xl">{d.screens}</h3>
        <p className="font-display text-lg text-slate-300">Bus Stand LED Screens</p>
        <p className="mt-1 text-sm text-slate-500">{d.subtitle}</p>
        <AudienceStats reach={d.reach} impressions={d.impressions} avgFrequency={d.avgFrequency} />
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Stat value={d.playsPerDay} label="Plays per screen, per day" />
          <Stat value={15} suffix="-Day" label="Campaign duration" />
          <Stat value={35} label="Districts, continuous visibility" />
        </div>
        <p className="mt-8 max-w-md text-slate-400">{d.copy}</p>
      </div>
    );
  }
  if (mode === "chennai") {
    const d = campaignData.chennai;
    return (
      <div>
        <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-[#f7a83e]">Mode 02</p>
        <h3 className="mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">{d.title}</h3>
        <p className="mt-1 text-sm text-slate-500">{d.subtitle}</p>
        <AudienceStats reach={d.reach} impressions={d.impressions} avgFrequency={d.avgFrequency} />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat value={d.premiumHoardings} label="Premium Hoardings" />
          <Stat value={d.cityHoardings} label="City Hoardings" />
          <Stat value={d.busShelters} label="Bus Shelters" />
          <Stat value={d.trafficSignalLEDs} label="Traffic Signal LEDs" />
          <Stat value={d.metroTrains} label="Fully Branded Metro Train" />
        </div>
        <p className="mt-8 max-w-md text-slate-400">{d.copy}</p>
      </div>
    );
  }
  if (mode === "restOfTN") {
    const d = campaignData.restOfTamilNadu;
    return (
      <div>
        <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-[#f7a83e]">Mode 03</p>
        <h3 className="mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">{d.title}</h3>
        <p className="mt-1 text-sm text-slate-500">{d.subtitle}</p>
        <AudienceStats reach={d.reach} impressions={d.impressions} avgFrequency={d.avgFrequency} />
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Stat value={d.premiumHoardings} label="Premium Hoardings" />
          <Stat value={d.hoardings} label="Highway & City Hoardings" />
          <Stat value={d.busShelters} label="Bus Shelters" />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {d.cities.map((c) => (
            <span key={c} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-300">
              {c}
            </span>
          ))}
        </div>
        <p className="mt-8 max-w-md text-slate-400">{d.copy}</p>
      </div>
    );
  }
  // airports
  const d = campaignData.airports;
  return (
    <div>
      <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-[#f7a83e]">Mode 04</p>
      <h3 className="mt-3 font-display text-4xl font-bold leading-tight text-white sm:text-5xl">{d.screens}</h3>
      <p className="font-display text-lg text-slate-300">Airport Screens</p>
      <p className="mt-1 text-sm text-slate-500">{d.subtitle}</p>
      <AudienceStats reach={d.reach} impressions={d.impressions} avgFrequency={d.avgFrequency} />
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat value={3} label="Major Airports" />
        <Stat value={10} suffix="-Day" label="Campaign duration" />
        <Stat value={150} label="Total airport screens" />
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {d.cities.map((c) => (
          <span key={c} className="rounded-full border border-[#f7a83e]/20 bg-[#f7a83e]/5 px-3 py-1 text-xs text-[#f7a83e]/90">
            {c}
          </span>
        ))}
      </div>
      <p className="mt-8 max-w-md text-slate-400">{d.copy}</p>
    </div>
  );
}
/* ============================================================================
   HERO
============================================================================ */
function Hero({ onExplore }) {
  const reduce = useReducedMotion();
  const heroStats = [
    { value: campaignData.totals.touchpoints, suffix: "+", label: "Static & Digital Touchpoints" },
    { value: campaignData.totals.districts, suffix: "", label: "Districts Covered" },
    { value: campaignData.totals.airports, suffix: "", label: "Major Airports" },
    { value: campaignData.totals.metroTrains, suffix: "", label: "Fully Branded Metro Train" },
  ];

  return (
    <section className="relative overflow-hidden px-6 pt-28 pb-20 md:px-10 md:pt-36 md:pb-28">
      {/* Ambient background TN outline */}
      <div className="pointer-events-none absolute -right-24 top-0 h-[120%] w-[80%] opacity-[0.14] sm:opacity-20 md:-right-10">
        <svg viewBox="0 0 400 520" className="h-full w-full">
          <motion.path
            d={TN_PATH}
            fill="none"
            stroke="#4f9dff"
            strokeWidth="1.2"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.4, ease: "easeInOut" }}
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-5xl">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.35em] text-[#4f9dff]">
          Outdoor &amp; Transit Media Plan · Tamil Nadu
        </p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mt-5 font-display text-5xl font-black leading-[0.98] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
        >
          TAMIL NADU,
          <br />
          <span className="text-[#4f9dff]">COVERED</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="mt-6 max-w-xl text-lg text-slate-400"
        >
          One connected outdoor and transit media network across the state.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          onClick={onExplore}
          className="group mt-10 inline-flex items-center gap-2 rounded-full bg-[#4f9dff] px-7 py-3.5 font-display text-sm font-semibold text-[#0b1120] shadow-[0_0_30px_rgba(79,157,255,0.35)] transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-95"
        >
          Explore the Network
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </motion.button>

        <div className="mt-20 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
          {heroStats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.1, ease: "easeOut" }}
            >
              <div className="font-display text-4xl font-bold text-white sm:text-5xl">
                <AnimatedNumber value={s.value} suffix={s.suffix} />
              </div>
              <p className="mt-2 text-xs leading-snug text-slate-500 sm:text-sm">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   MEDIA JOURNEY
============================================================================ */
function JourneySection() {
  const reduce = useReducedMotion();
  const stages = [
    { icon: Route, label: "Road" },
    { icon: Signpost, label: "Bus Stop" },
    { icon: Bus, label: "Bus Stand" },
    { icon: TrafficCone, label: "Traffic Signal" },
    { icon: TrainFront, label: "Metro" },
    { icon: Plane, label: "Airport" },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
      <div className="max-w-2xl">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-[#4f9dff]">
          The Journey
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
          One Campaign. Every Part of the Journey.
        </h2>
        <p className="mt-4 text-slate-400">
          Not one advertisement in one location—a connected media network accompanying audiences
          throughout their daily movement.
        </p>
      </div>

      <div className="relative mt-16 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="relative flex min-w-[640px] items-start justify-between gap-2 sm:min-w-0">
          <div className="absolute left-0 right-0 top-7 h-px bg-white/10" />
          {!reduce && (
            <motion.div
              className="absolute top-[27px] h-1.5 w-1.5 rounded-full bg-[#4f9dff] shadow-[0_0_12px_3px_rgba(79,157,255,0.7)]"
              animate={{ left: ["0%", "97%"] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
            />
          )}
          {stages.map(({ icon: Icon, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative z-10 flex w-24 flex-col items-center gap-3 text-center sm:w-auto sm:flex-1"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-[#0e1526] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                <Icon size={22} className="text-[#4f9dff]" />
              </span>
              <span className="font-display text-xs font-medium uppercase tracking-wide text-slate-400">
                {label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   FINAL IMPACT
============================================================================ */
function FinalImpact() {
  const cards = [
    { value: "196", label: "Statewide LED Screens" },
    { value: "106", label: "Chennai Assets + Metro" },
    { value: "146", label: "Rest-of-Tamil-Nadu Assets" },
    { value: "150", label: "Airport Screens" },
  ];
  return (
    <section className="relative overflow-hidden border-t border-white/5 bg-[#080d18] px-6 py-24 md:px-10 md:py-32">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#4f9dff]/10 blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-4xl text-center">
        <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
          FROM STATEWIDE SCALE
          <br /> TO CITY-LEVEL FREQUENCY
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-slate-400">
          A campaign designed to remain visible wherever Tamil Nadu moves.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 text-left"
            >
              <p className="font-display text-3xl font-bold text-white">{c.value}</p>
              <p className="mt-1 text-sm text-slate-400">{c.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mx-auto mt-8 grid max-w-2xl grid-cols-3 gap-4 rounded-2xl border border-[#4f9dff]/15 bg-[#4f9dff]/[0.04] p-6 text-left sm:p-8"
        >
          <div>
            <Users size={16} className="text-[#4f9dff]" />
            <p className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
              {formatIndian(campaignData.totals.reach)}
            </p>
            <p className="mt-1 text-xs leading-snug text-slate-400">Projected Reach</p>
          </div>
          <div>
            <Eye size={16} className="text-[#4f9dff]" />
            <p className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
              {formatIndian(campaignData.totals.impressions)}
            </p>
            <p className="mt-1 text-xs leading-snug text-slate-400">Projected Impressions</p>
          </div>
          <div>
            <Repeat size={16} className="text-[#4f9dff]" />
            <p className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
              <AnimatedNumber value={campaignData.totals.avgFrequency} decimals={1} suffix="x" />
            </p>
            <p className="mt-1 text-xs leading-snug text-slate-400">Blended Avg. Frequency</p>
          </div>
        </motion.div>

        <button
          type="button"
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-[#f7a83e]/40 bg-[#f7a83e]/10 px-8 py-4 font-display text-sm font-semibold text-[#f7a83e] transition-all hover:bg-[#f7a83e]/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7a83e] active:scale-95"
        >
          View Complete Media Plan
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
}

/* ============================================================================
   ROOT APP
============================================================================ */
export default function App() {
  const reduce = useReducedMotion();

  const scrollToMap = useCallback(() => {
    const el = document.getElementById("map-section");
    if (el) el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [reduce]);

  return (
    <div className="min-h-screen bg-[#0b1120] font-sans text-white antialiased">
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 backdrop-blur-md md:px-10">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-[#4f9dff]" />
          <span className="font-display text-sm font-semibold tracking-wide">TN COVERED</span>
        </div>
        <span className="hidden font-display text-xs uppercase tracking-[0.2em] text-slate-500 sm:block">
          Outdoor &amp; Transit · FY26
        </span>
      </header>

      <main>
        <Hero onExplore={scrollToMap} />
        <MapSection id="map-section" />
        <JourneySection />
        <FinalImpact />
      </main>

      <footer className="border-t border-white/5 px-6 py-10 text-center md:px-10">
        <p className="font-display text-xs uppercase tracking-[0.25em] text-slate-600">
          Tamil Nadu, Covered — Outdoor &amp; Transit Media Plan
        </p>
      </footer>
    </div>
  );
}
