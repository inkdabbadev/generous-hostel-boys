"use client";

import { motion } from "framer-motion";
import { MapPin, Target, TrendingUp, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { audienceMarkets, type AudienceMarket } from "./regionalAudienceData";

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

function MarketMapCard({
  active,
  market,
  onSelect,
}: {
  active: boolean;
  market: AudienceMarket;
  onSelect: (market: AudienceMarket) => void;
}) {
  const youthShare = market.ageDistribution
    .filter((age) => age.label === "18-24" || age.label === "25-34")
    .reduce((total, age) => total + age.value, 0);

  return (
    <motion.button
      animate={{
        opacity: active ? 1 : 0.48,
        y: active ? -5 : 0,
      }}
      aria-label={`${market.title}. Select to view regional metrics.`}
      className={active ? "audienceMarketTab isActive" : "audienceMarketTab"}
      onClick={() => onSelect(market)}
      onFocus={() => onSelect(market)}
      transition={{ duration: 0.26, ease: [0.2, 0.8, 0.2, 1] }}
      type="button"
      whileTap={{ scale: 0.99 }}
    >
      <span className="audienceMarketTabIcon">{market.icon}</span>
      <div>
        <strong>{market.shortTitle}</strong>
        <small>Shows {market.shortTitle}</small>
      </div>
      <em>{youthShare}% youth</em>
    </motion.button>
  );
}

export default function RegionalAudience() {
  const [activeMarket, setActiveMarket] = useState(audienceMarkets[0]);
  const youthShare = activeMarket.ageDistribution
    .filter((age) => age.label === "18-24" || age.label === "25-34")
    .reduce((total, age) => total + age.value, 0);

  return (
    <section
      className="regionalAudience relative min-h-screen text-white"
      aria-labelledby="regional-audience-title"
    >
      <div className="regionalAudienceShell mx-auto w-full">
        <motion.div
          className="regionalAudienceHeader"
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: [0.2, 0.9, 0.25, 1] }}
          viewport={{ once: false, amount: 0.35 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 id="regional-audience-title">South India Regional Audience Overview</h2>
          <p>Regional demand signals, youth concentration, and city-level audience opportunity.</p>
        </motion.div>

        <div className="audienceMarketTabs" aria-label="South India regional markets">
          {audienceMarkets.map((market) => (
            <MarketMapCard
              active={market.id === activeMarket.id}
              key={market.id}
              market={market}
              onSelect={setActiveMarket}
            />
          ))}
        </div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="audienceExecutiveBoard"
          initial={{ opacity: 0, y: 18 }}
          key={activeMarket.id}
          transition={{ duration: 0.38, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="audienceHeroMap">
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

          <div className="audienceExecutiveCopy">
            <div className="audiencePanelCopy">
              <h3>{activeMarket.shortTitle}</h3>
              <p>{activeMarket.marketInsight}</p>
            </div>

            <div className="audienceKpiGrid">
              <div>
                <Target aria-hidden="true" size={22} strokeWidth={2.8} />
                <span>Selected Market</span>
                <strong>{activeMarket.shortTitle}</strong>
              </div>
              <div>
                <TrendingUp aria-hidden="true" size={22} strokeWidth={2.8} />
                <span>18-34 Audience</span>
                <strong>{youthShare}%</strong>
              </div>
              <div>
                <MapPin aria-hidden="true" size={22} strokeWidth={2.8} />
                <span>Key Hotspots</span>
                <strong>{activeMarket.majorHotspots.length}</strong>
              </div>
            </div>

            <dl className="audiencePanelDetails">
              <div>
                <dt>Major Hotspots</dt>
                <dd>{activeMarket.majorHotspots.join(" / ")}</dd>
              </div>
              <div>
                <dt>Audience Profile</dt>
                <dd>{activeMarket.audienceProfile}</dd>
              </div>
            </dl>
          </div>

          <div className="audienceAgeBlock">
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
        </motion.div>
      </div>
    </section>
  );
}
