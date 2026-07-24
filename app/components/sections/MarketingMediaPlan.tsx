"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";

const mediaImpactCards = [
  {
    label: "Different",
    value: "34",
    title: "Touch Points",
    copy: "Bus stands, hoardings, malls, metro, transit, airport, LED walls, auto, rail and city media.",
  },
  {
    label: "Sustained",
    value: "30",
    title: "Days of Promotion",
    copy: "A release-window burst designed to stay visible before, during and after the theatrical push.",
  },
  {
    label: "Core Market",
    value: "Tamil",
    title: "Core\nTN Youth",
    copy: "Built around Tamil Nadu's youth-heavy audience routes, public spaces and daily commute moments.",
  },
];

function getMediaPlanValueStyle(value: string) {
  const valueSize =
    value === "Tamil"
      ? "clamp(5.6rem, 9.6vw, 12.2rem)"
      : "clamp(7.2rem, 12.2vw, 15.2rem)";

  return {
    "--media-plan-value-size": valueSize,
  } as CSSProperties;
}

export default function MarketingMediaPlan() {
  return (
    <motion.section
      className="mediaPlan"
      aria-label="Marketing media plan highlights"
      initial="hidden"
      viewport={{ once: false, amount: 0.4 }}
      whileInView="show"
    >
      <div className="mediaPlanShell">
        <div className="mediaPlanImpactGrid" aria-label="Marketing media plan highlights">
          {mediaImpactCards.map((card, index) => (
            <motion.article
              className="mediaPlanImpactCard"
              key={card.title}
              transition={{
                delay: index * 0.18,
                duration: 0.72,
                ease: [0.16, 1, 0.3, 1],
              }}
              variants={{
                hidden: { opacity: 0, y: 54, scale: 0.96, filter: "blur(14px)" },
                show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
              }}
            >
              <motion.strong
                style={getMediaPlanValueStyle(card.value)}
                transition={{ delay: 0.22 + index * 0.18, duration: 0.64, ease: [0.18, 1.25, 0.28, 1] }}
                variants={{
                  hidden: { opacity: 0, y: 34, scale: 0.82 },
                  show: { opacity: 1, y: 0, scale: 1 },
                }}
              >
                {card.value}
              </motion.strong>
              <motion.h3
                transition={{ delay: 0.34 + index * 0.18, duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
                variants={{
                  hidden: { opacity: 0, clipPath: "inset(0% 100% 0% 0%)" },
                  show: { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" },
              }}
            >
                {card.title.split("\n").map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </motion.h3>
              <motion.p
                transition={{ delay: 0.46 + index * 0.18, duration: 0.46, ease: [0.16, 1, 0.3, 1] }}
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                {card.copy}
              </motion.p>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
