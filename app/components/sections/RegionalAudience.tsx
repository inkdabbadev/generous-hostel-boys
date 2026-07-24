"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { audienceMarkets, type AudienceMarket } from "../../data/regionalAudienceData";

const ageGoldPalette = ["#ffe88a", "#ffd64a", "#ffc400", "#c88700", "#744500"];
const ageStripPalette = ["#ffe88a", "#ffd64a", "#ffc400", "#c88700", "#744500"];

type AudienceAgeStyle = CSSProperties & {
  "--age-color": string;
  "--age-glow": string;
  "--age-height": string;
};

type RegionalAudienceControls = CSSProperties & {
  "--regional-card-cols": string;
  "--regional-card-gap": string;
  "--regional-card-pad": string;
  "--regional-card-rows": string;
  "--regional-donut-col": string;
  "--regional-donut-width": string;
  "--regional-main-cols": string;
  "--regional-main-gap": string;
  "--regional-map-max-height": string;
  "--regional-map-width": string;
  "--regional-market-copy-size": string;
  "--regional-region-title-size": string;
  "--regional-shell-gap": string;
  "--regional-shell-rows": string;
  "--regional-title-offset": string;
  "--regional-title-size": string;
  "--regional-watermark-left": string;
  "--regional-watermark-size": string;
  "--regional-watermark-width": string;
  "--regional-youth-copy-size": string;
  "--regional-youth-size": string;
};

const regionalAudienceControls = {
  "--regional-card-cols": "minmax(280px, 0.82fr) minmax(460px, 1.18fr)",
  "--regional-card-gap": "clamp(18px, 1.7vw, 28px)",
  "--regional-card-pad": "clamp(24px, 2vw, 38px)",
  "--regional-card-rows": "minmax(176px, 23vh) minmax(260px, 34vh)",
  "--regional-donut-col": "clamp(165px, 14vw, 230px)",
  "--regional-donut-width": "clamp(162px, 13.2vw, 218px)",
  "--regional-main-cols": "minmax(390px, 0.82fr) minmax(720px, 1.18fr)",
  "--regional-main-gap": "clamp(28px, 3.4vw, 62px)",
  "--regional-map-max-height": "min(60vh, 620px)",
  "--regional-map-width": "min(90%, 570px)",
  "--regional-market-copy-size": "clamp(0.9rem, 1.08vw, 1.3rem)",
  "--regional-region-title-size": "clamp(3.8rem, 5.6vw, 7.45rem)",
  "--regional-shell-gap": "clamp(12px, 1.6vh, 22px)",
  "--regional-shell-rows": "clamp(88px, 14.2vh, 154px) minmax(0, 1fr)",
  "--regional-title-offset": "clamp(34px, 4.4vh, 58px)",
  "--regional-title-size": "clamp(3.4rem, 4.75vw, 6.45rem)",
  "--regional-watermark-left": "44%",
  "--regional-watermark-size": "clamp(5.9rem, 8.2vw, 10.9rem)",
  "--regional-watermark-width": "min(690px, 40vw)",
  "--regional-youth-copy-size": "clamp(1.25rem, 1.72vw, 2.25rem)",
  "--regional-youth-size": "clamp(5rem, 6.75vw, 8.7rem)",
} satisfies RegionalAudienceControls;

function getAgeStripStyle(value: number, index: number): AudienceAgeStyle {
  const normalized = Math.min(Math.max(value / 34, 0.32), 1);
  const alpha = 0.18 + normalized * 0.22;

  return {
    "--age-color": ageStripPalette[index % ageStripPalette.length],
    "--age-glow": `rgba(255, 196, 0, ${alpha.toFixed(2)})`,
    "--age-height": `${Math.round(44 + normalized * 46)}px`,
  };
}

function DonutChart({ market }: { market: AudienceMarket }) {
  const segments = useMemo(() => {
    let offset = 0;

    return market.ageDistribution.map((segment, index) => {
      const current = {
        ...segment,
        color: ageGoldPalette[index % ageGoldPalette.length],
        offset,
      };
      offset += segment.value;
      return current;
    });
  }, [market]);

  return (
    <div className="audienceDonut" aria-label={`${market.shortTitle} age audience chart`}>
      <div className="audienceDonutRing">
        <svg viewBox="0 0 120 120" role="img">
          <circle cx="60" cy="60" fill="none" r="43" stroke="rgba(255,196,0,0.14)" strokeWidth="5" />
          {segments.map((segment) => (
            <motion.circle
              animate={{
                opacity: 1,
                strokeDasharray: `${Math.max(segment.value - 1.15, 0.1)} ${100 - Math.max(segment.value - 1.15, 0.1)}`,
              }}
              cx="60"
              cy="60"
              fill="none"
              initial={{ opacity: 0, strokeDasharray: `0 100` }}
              key={`${market.id}-${segment.label}`}
              pathLength={100}
              r="42"
              stroke={segment.color}
              strokeDashoffset={-segment.offset}
              strokeLinecap="butt"
              strokeWidth="6"
              transform="rotate(-90 60 60)"
              transition={{ duration: 0.8, ease: [0.2, 0.9, 0.25, 1] }}
            />
          ))}
        </svg>
        <div className="audienceDonutCore">
          <Users aria-hidden="true" size={24} strokeWidth={2.6} />
        </div>
      </div>
      <strong className="audienceDonutLabel" aria-hidden="true">
        <span>Age</span>
      </strong>
    </div>
  );
}

const mapOverlayText: Record<string, string[]> = {
  karnataka: ["Karna", "taka"],
  telugu: ["Telugu", "Market"],
  tamil: ["Tamil", "Nadu"],
  kerala: ["Kerala"],
};

export default function RegionalAudience() {
  const sectionRef = useRef<HTMLElement>(null);
  const activeIndexRef = useRef(0);
  const isSteppingRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeMarket = audienceMarkets[activeIndex] ?? audienceMarkets[0];
  const youthShare = activeMarket.ageDistribution
    .filter((age) => age.label === "18-24" || age.label === "25-34")
    .reduce((total, age) => total + age.value, 0);
  const audienceSummary = activeMarket.audienceProfile.replace(/\.$/, "");
  const insightSummary = activeMarket.marketInsight.replace(/\.$/, "");

  useEffect(() => {
    const updateActiveIndex = (nextIndex: number) => {
      const clampedIndex = Math.min(Math.max(nextIndex, 0), audienceMarkets.length - 1);
      activeIndexRef.current = clampedIndex;
      setActiveIndex(clampedIndex);
    };

    const lockRegionalView = () => {
      const section = sectionRef.current;

      if (!section) {
        return;
      }

      window.scrollTo({
        top: section.offsetTop,
        behavior: "auto",
      });
    };

    const getRegionalRect = () => {
      const section = sectionRef.current;

      if (!section) {
        return null;
      }

      return section.getBoundingClientRect();
    };

    const regionalIsPinned = () => {
      const rect = getRegionalRect();

      if (!rect) {
        return false;
      }

      return rect.top <= 2 && rect.bottom >= window.innerHeight - 2;
    };

    const regionalIsInLockZone = () => {
      const rect = getRegionalRect();

      if (!rect) {
        return false;
      }

      return rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.55;
    };

    const stepMarket = (direction: 1 | -1) => {
      if (isSteppingRef.current) {
        return;
      }

      isSteppingRef.current = true;
      lockRegionalView();
      updateActiveIndex(activeIndexRef.current + direction);

      window.setTimeout(() => {
        isSteppingRef.current = false;
      }, 620);
    };

    const onSectionJumpIntent = (event: Event) => {
      const customEvent = event as CustomEvent<{
        direction: 1 | -1;
        section: HTMLElement;
      }>;

      if (customEvent.detail.section !== sectionRef.current || !regionalIsPinned()) {
        return;
      }

      const { direction } = customEvent.detail;
      const canStepForward = direction === 1 && activeIndexRef.current < audienceMarkets.length - 1;
      const canStepBackward = direction === -1 && activeIndexRef.current > 0;

      if (!canStepForward && !canStepBackward) {
        return;
      }

      customEvent.preventDefault();
      stepMarket(direction);
    };

    const onWheel = (event: WheelEvent) => {
      if (!regionalIsInLockZone() || Math.abs(event.deltaY) < 8) {
        return;
      }

      const isForward = event.deltaY > 0;
      const canStepForward = isForward && activeIndexRef.current < audienceMarkets.length - 1;
      const canStepBackward = !isForward && activeIndexRef.current > 0;

      if (!regionalIsPinned() && (canStepForward || canStepBackward)) {
        event.preventDefault();
        lockRegionalView();
        return;
      }

      if (canStepForward || canStepBackward) {
        event.preventDefault();
        stepMarket(isForward ? 1 : -1);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!regionalIsInLockZone()) {
        return;
      }

      const forwardKeys = ["ArrowDown", "PageDown", " ", "Spacebar"];
      const backwardKeys = ["ArrowUp", "PageUp"];
      const isForward = forwardKeys.includes(event.key) || forwardKeys.includes(event.code);
      const isBackward = backwardKeys.includes(event.key) || backwardKeys.includes(event.code);
      const canStepForward = isForward && activeIndexRef.current < audienceMarkets.length - 1;
      const canStepBackward = isBackward && activeIndexRef.current > 0;

      if (!regionalIsPinned() && (canStepForward || canStepBackward)) {
        event.preventDefault();
        event.stopPropagation();
        lockRegionalView();
        return;
      }

      if (canStepForward || canStepBackward) {
        event.preventDefault();
        event.stopPropagation();
        stepMarket(canStepForward ? 1 : -1);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("section-jump:intent", onSectionJumpIntent);
    document.addEventListener("keydown", onKeyDown, { capture: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("section-jump:intent", onSectionJumpIntent);
      document.removeEventListener("keydown", onKeyDown, { capture: true });
    };
  }, []);

  return (
    <section
      className="regionalAudience relative min-h-screen text-white"
      aria-labelledby="regional-audience-title"
      ref={sectionRef}
      style={regionalAudienceControls as CSSProperties}
    >
      <div className="regionalAudienceShell mx-auto w-full">
        <motion.div
          className="regionalAudienceHeader"
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: [0.2, 0.9, 0.25, 1] }}
          viewport={{ once: false, amount: 0.35 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="regionalAudienceTitleSr" id="regional-audience-title">
            Regional Audience Overview
          </h2>
          <div className="regionalAudienceMegaTitle">Regional Audience Overview</div>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="audienceExecutiveBoard"
          initial={{ opacity: 0, y: 18 }}
          key={activeMarket.id}
          transition={{ duration: 0.38, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="audienceHeroMap">
            <motion.div
              animate={{ opacity: 1 }}
              className="audienceMapWatermark"
              initial={{ opacity: 0 }}
              key={`${activeMarket.id}-watermark`}
              transition={{ duration: 0.46, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {(mapOverlayText[activeMarket.id] ?? [activeMarket.shortTitle]).map((line) => (
                <span key={line}>{line}</span>
              ))}
            </motion.div>
            <motion.img
              alt={`${activeMarket.shortTitle} regional audience map`}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              className="audienceHeroMapImage"
              draggable={false}
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              src={`/maps/${activeMarket.image}`}
              transition={{ duration: 0.48, ease: [0.2, 0.9, 0.25, 1] }}
            />
          </div>

          <div className="audienceAgeBlock">
            <motion.h3
              animate={{ opacity: 1, y: 0 }}
              className="audienceRegionTitle"
              initial={{ opacity: 0, y: 18 }}
              key={`${activeMarket.id}-title`}
              transition={{ duration: 0.34, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {activeMarket.shortTitle}
            </motion.h3>
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="audienceMetricGrid"
              initial={{ opacity: 0, y: 14 }}
              key={`${activeMarket.id}-metrics`}
              transition={{ duration: 0.34, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <article className="audienceMetricCard audienceMetricCardYouth">
                <strong>{youthShare}%</strong>
                <p>18-34 year old audience</p>
              </article>
              <article className="audienceMetricCard audienceMetricCardState">
                <span>Market read</span>
                <p>{audienceSummary}</p>
                <p>{insightSummary}</p>
              </article>
              <article className="audienceMetricCard audienceMetricCardDonut">
                <div className="audienceMetricDonutRow">
                  <DonutChart market={activeMarket} />
                  <ul>
                    {activeMarket.ageDistribution.map((age, index) => (
                      <li key={age.label}>
                        <span style={getAgeStripStyle(age.value, index)} />
                        <strong>{age.label} year old</strong>
                        <em>{age.value}%</em>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
