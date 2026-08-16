"use client";

import { motion } from "framer-motion";

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
        <motion.img
          alt="34 touch points, 60 days of promotion, and Tamil youth first market"
          className="mediaPlanTextArtwork"
          draggable={false}
          src="/marketingmedia/texts.png"
          transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
          variants={{
            hidden: { opacity: 0, y: 44, scale: 0.96, filter: "blur(calc(12*var(--u)))" },
            show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
          }}
        />
      </div>
    </motion.section>
  );
}
