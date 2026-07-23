"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { audienceMarkets, type AudienceMarket } from "../../data/regionalAudienceData";

const ageGoldPalette = ["#fff2a6", "#ffd95c", "#ffc400", "#d99a00", "#8f5f00"];

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
      <svg viewBox="0 0 120 120" role="img">
        <circle cx="60" cy="60" fill="none" r="42" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
        {segments.map((segment) => (
          <motion.circle
            animate={{ strokeDasharray: `${segment.value} ${100 - segment.value}` }}
            cx="60"
            cy="60"
            fill="none"
            initial={{ strokeDasharray: `0 100` }}
            key={`${market.id}-${segment.label}`}
            pathLength={100}
            r="42"
            stroke={segment.color}
            strokeDashoffset={-segment.offset}
            strokeLinecap="round"
            strokeWidth="10"
            transform="rotate(-90 60 60)"
            transition={{ duration: 0.75, ease: [0.2, 0.9, 0.25, 1] }}
          />
        ))}
      </svg>
      <div className="audienceDonutCore">
        <Users aria-hidden="true" size={24} strokeWidth={2.6} />
        <span>Age</span>
      </div>
    </div>
  );
}

const marketCodeOrder = [
  { id: "karnataka", code: "KA" },
  { id: "telugu", code: "TL" },
  { id: "tamil", code: "TN" },
  { id: "kerala", code: "KL" },
];

const mapOverlayText: Record<string, string[]> = {
  karnataka: ["Karna", "taka"],
  telugu: ["Telugu", "Market"],
  tamil: ["Tamil", "Nadu"],
  kerala: ["Kerala"],
};

function MarketCodeMarker({
  active,
  code,
  market,
}: {
  active: boolean;
  code: string;
  market: AudienceMarket;
}) {
  return (
    <motion.div
      animate={{
        opacity: active ? 1 : 0.36,
        y: active ? -4 : 0,
      }}
      aria-current={active ? "step" : undefined}
      aria-label={`${market.shortTitle} regional step`}
      className={active ? "audienceMarketCode isActive" : "audienceMarketCode"}
      transition={{ duration: 0.26, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {code}
    </motion.div>
  );
}

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
          <img
            alt=""
            aria-hidden="true"
            className="regionalAudienceHeadAsset"
            draggable={false}
            src="/maps/head.svg"
          />
          <div className="audienceCodeGrid" aria-label="South India regional markets">
            {marketCodeOrder.map(({ id, code }) => {
              const market = audienceMarkets.find((item) => item.id === id) ?? audienceMarkets[0];

              return (
                <MarketCodeMarker
                  active={market.id === activeMarket.id}
                  code={code}
                  key={id}
                  market={market}
                />
              );
            })}
          </div>
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
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="audienceMetricGrid"
              initial={{ opacity: 0, y: 14 }}
              key={`${activeMarket.id}-metrics`}
              transition={{ duration: 0.34, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <article className="audienceMetricCard audienceMetricCardYouth">
                <span>Youth pull</span>
                <strong>{youthShare}%</strong>
                <p>18-34 audience concentration</p>
              </article>
              <article className="audienceMetricCard audienceMetricCardState">
                <span>State</span>
                <h3>{activeMarket.shortTitle}</h3>
                <p>{activeMarket.primaryCity}</p>
                <strong>{activeMarket.majorHotspots.slice(0, 4).join(" / ")}</strong>
              </article>
              <article className="audienceMetricCard audienceMetricCardDonut">
                <span>Age split</span>
                <div className="audienceMetricDonutRow">
                  <DonutChart market={activeMarket} />
                  <ul>
                    {activeMarket.ageDistribution.map((age, index) => (
                      <li key={age.label}>
                        <span style={{ background: ageGoldPalette[index % ageGoldPalette.length] }} />
                        <strong>{age.label}</strong>
                        <em>{age.value}%</em>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
              <article className="audienceMetricCard audienceMetricCardCopy">
                <span>Market read</span>
                <p>{audienceSummary}</p>
                <p>{insightSummary}</p>
              </article>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
