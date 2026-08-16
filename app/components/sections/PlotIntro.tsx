"use client";

import { motion } from "framer-motion";

const titleWords = [
  { className: "plotIntroTitleWhite", text: "THE" },
  { className: "plotIntroTitleGold", text: "PLOT" },
];

export default function PlotIntro() {
  return (
    <motion.section
      aria-labelledby="plot-title"
      className="plotIntro"
      initial="hidden"
      viewport={{ once: false, amount: 0.48 }}
      whileInView="show"
    >
      <motion.h2
        id="plot-title"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.08,
              delayChildren: 0.12,
            },
          },
        }}
      >
        {titleWords.map((word, index) => (
          <motion.span
            aria-hidden="true"
            className={word.className}
            key={word.text}
            variants={{
              hidden: {
                opacity: 0,
                y: 36,
                rotateX: -22,
                scale: 0.96,
                filter: "blur(calc(10*var(--u)))",
              },
              show: {
                opacity: 1,
                y: 0,
                rotateX: 0,
                scale: 1,
                filter: "blur(0px)",
              },
            }}
            transition={{
              duration: 0.86,
              delay: index * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word.text}
          </motion.span>
        ))}
        <span className="srOnly">THE PLOT</span>
      </motion.h2>
      <motion.img
        alt=""
        aria-hidden="true"
        className="plotIntroComic"
        draggable={false}
        initial={{
          opacity: 0,
          y: 120,
          scale: 0.74,
          rotate: -4,
          rotateX: 18,
          filter: "blur(calc(18*var(--u))) saturate(1.35)",
          clipPath: "inset(18% 12% 18% 12% round calc(18*var(--u)))",
        }}
        src="/plot/comic.png"
        transition={{
          delay: 0.28,
          duration: 1.18,
          ease: [0.16, 1.18, 0.3, 1],
        }}
        viewport={{ once: false, amount: 0.45 }}
        whileInView={{
          opacity: 1,
          y: 0,
          scale: 1,
          rotate: 0,
          rotateX: 0,
          filter: "blur(0px) saturate(1)",
          clipPath: "inset(0% 0% 0% 0% round 0px)",
        }}
      />
    </motion.section>
  );
}
