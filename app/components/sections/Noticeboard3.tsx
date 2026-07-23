"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";

const papers = ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png"];
const tapes = ["1.png", "2.png"];

export default function Noticeboard3() {
  const sectionRef = useRef<HTMLElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    controls.set("hidden");

    const observer = new IntersectionObserver(
      ([entry]) => {
        const nextIsVisible = entry.isIntersecting && entry.intersectionRatio >= 0.34;

        if (nextIsVisible) {
          controls.set("hidden");
          requestAnimationFrame(() => {
            void controls.start("show");
          });
          return;
        }

        controls.set("hidden");
      },
      { threshold: [0, 0.34] },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [controls]);

  return (
    <section
      aria-label="Noticeboard layered paper sequence"
      className="noticeboardSection noticeboard3Section"
      ref={sectionRef}
    >
      <motion.h2
        animate={controls}
        className="noticeboardOverlayTitle"
        initial="hidden"
        transition={{ delay: 0.04, duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
        variants={{
          hidden: { opacity: 0, y: -34, scale: 0.94, filter: "blur(10px)" },
          show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
        }}
      >
        Noticeboard
      </motion.h2>
      <div className="noticeboard3Shell">
        {papers.map((paper, index) => (
          <motion.img
            alt=""
            animate={controls}
            aria-hidden="true"
            className="noticeboard3Paper"
            draggable={false}
            initial="hidden"
            key={paper}
            src={`/notice/board3/paper/${paper}`}
            transition={{
              delay: index * 0.22,
              duration: 0.68,
              ease: [0.16, 1, 0.3, 1],
            }}
            variants={{
              hidden: {
                opacity: 0,
                scale: 0.96,
                y: 42,
                filter: "blur(10px) brightness(1.18)",
              },
              show: {
                opacity: 1,
                scale: 1,
                y: 0,
                filter: "blur(0px) brightness(1)",
              },
            }}
          />
        ))}
        {tapes.map((tape, index) => (
          <motion.img
            alt=""
            animate={controls}
            aria-hidden="true"
            className="noticeboard3Tape"
            draggable={false}
            initial="hidden"
            key={tape}
            src={`/notice/board3/tape/${tape}`}
            transition={{
              delay: papers.length * 0.22 + 0.46 + index * 0.16,
              duration: 0.62,
              ease: [0.16, 1, 0.3, 1],
            }}
            variants={{
              hidden: {
                opacity: 0,
                scale: 1.08,
                y: -26,
                filter: "blur(8px) brightness(1.2)",
              },
              show: {
                opacity: 1,
                scale: 1,
                y: 0,
                filter: "blur(0px) brightness(1)",
              },
            }}
          />
        ))}
      </div>
    </section>
  );
}
