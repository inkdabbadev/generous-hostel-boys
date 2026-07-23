"use client";

import { motion } from "framer-motion";

const askWords = ["OK", "NOW", "Let's", "talk", "the", "actual", "ASK", "..."];

export default function ActualAskIntro() {
  return (
    <motion.section
      aria-label="Actual ask intro"
      className="actualAskIntro"
      initial="hidden"
      viewport={{ once: false, amount: 0.46 }}
      whileInView="show"
    >
      <div className="actualAskIntroShell">
        <h2>
          {askWords.map((word, index) => (
            <motion.span
              className={word === "ASK" ? "isGold" : undefined}
              key={`${word}-${index}`}
              transition={{
                delay: index * 0.11,
                duration: 0.54,
                ease: [0.16, 1, 0.3, 1],
              }}
              variants={{
                hidden: {
                  opacity: 0,
                  y: 42,
                  scale: 0.82,
                  rotateZ: index % 2 === 0 ? -2.5 : 2.5,
                  filter: "blur(12px)",
                },
                show: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  rotateZ: 0,
                  filter: "blur(0px)",
                },
              }}
            >
              {word}
            </motion.span>
          ))}
        </h2>
      </div>
    </motion.section>
  );
}
