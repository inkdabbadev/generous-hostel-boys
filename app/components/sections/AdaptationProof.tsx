"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const proofSignals = [
  {
    label: "Rights",
    detail:
      "Legally acquired remake rights of the Kannada blockbuster Hostel Hudugaru Bekagiddare.",
  },
  {
    label: "90/10",
    detail:
      "Around 90% of the original footage is retained, with about 10% reshot using Tamil actors for cultural relevance.",
  },
  {
    label: "Tamilized",
    detail:
      "Kannada references are removed through CGI/VFX, with on-screen text and signage replaced in Tamil.",
  },
  {
    label: "VJ Siddhu",
    detail: "Starring VJ Siddhu, a name with a large built-in youth following.",
  },
  {
    label: "18-35",
    detail:
      "Built for Tamil audiences aged 18-35, especially college students and young professionals.",
  },
];

export default function AdaptationProof() {
  const [activeSignal, setActiveSignal] = useState(0);
  const selectedSignal = proofSignals[activeSignal];

  return (
    <section className="adaptationProof" aria-labelledby="adaptation-proof-title">
      <div className="adaptationProofShell">
        <motion.div
          className="adaptationProofHeader"
          initial={{ opacity: 0, y: 28 }}
          transition={{ duration: 0.72, ease: [0.2, 0.9, 0.25, 1] }}
          viewport={{ once: false, amount: 0.42 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 id="adaptation-proof-title">Built as a Tamil-first adaptation</h2>
          <p>Rights secured. Footage retained. Culture localized. Youth market ready.</p>
        </motion.div>

        <motion.div
          className="adaptationVisualStage"
          initial={{ opacity: 0, y: 34, scale: 0.96 }}
          transition={{ delay: 0.12, duration: 0.78, ease: [0.2, 0.9, 0.25, 1] }}
          viewport={{ once: false, amount: 0.32 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
        >
          <img
            alt="Cinematic visual montage showing remake rights, retained footage, Tamil localization, youth following, and audience fit"
            draggable={false}
            src="/adaptation-proof/strategy-visual.png"
          />
          <motion.div
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="adaptationCenterInsight"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            key={selectedSignal.label}
            transition={{ duration: 0.34, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <span>{selectedSignal.label}</span>
            <p>{selectedSignal.detail}</p>
          </motion.div>
          <div className="adaptationSignalRail" aria-label="Adaptation proof signals">
            {proofSignals.map((signal, index) => (
              <motion.button
                className={index === activeSignal ? "isActive" : undefined}
                initial={{ opacity: 0, y: 18 }}
                key={signal.label}
                onClick={() => setActiveSignal(index)}
                onFocus={() => setActiveSignal(index)}
                onMouseEnter={() => setActiveSignal(index)}
                transition={{ delay: 0.28 + index * 0.08, duration: 0.42 }}
                type="button"
                viewport={{ once: false, amount: 0.35 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                {signal.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
