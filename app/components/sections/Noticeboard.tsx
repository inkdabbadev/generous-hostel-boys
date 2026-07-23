"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";

const noticeFrameStyle = {
  left: "2%",
  top: "19%",
  width: "94.4%",
  maxHeight: "80%",
} satisfies CSSProperties;

const noticeFrameUpperStyle = {
  left: "2%",
  top: "36%",
  width: "94.4%",
  maxHeight: "80%",
} satisfies CSSProperties;

export default function Noticeboard() {
  return (
    <motion.section
      aria-labelledby="noticeboard-title"
      className="noticeboardSection"
      initial="hidden"
      viewport={{ once: false, amount: 0.38 }}
      whileInView="show"
    >
      <div className="noticeboardShell">
        <motion.h2
          id="noticeboard-title"
          transition={{ delay: 0.04, duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
          variants={{
            hidden: { opacity: 0, y: -34, scale: 0.94, filter: "blur(10px)" },
            show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
          }}
        >
          Noticeboard
        </motion.h2>
        <motion.img
          alt="Noticeboard press collage"
          className="noticeFrame noticeFrameBase"
          draggable={false}
          src="/notice/board1/Frame1.png"
          style={noticeFrameStyle}
          transition={{
            delay: 0.22,
            duration: 1.18,
            ease: [0.14, 1.18, 0.26, 1],
            filter: { duration: 0.7, ease: "easeOut" },
          }}
          variants={{
            hidden: {
              opacity: 0,
              x: -120,
              y: 118,
              scale: 0.62,
              rotateX: 20,
              rotateZ: -8,
              filter:
                "blur(20px) brightness(1.35) drop-shadow(0 18px 18px rgba(58, 31, 15, 0.22)) drop-shadow(0 2px 0 rgba(255, 255, 255, 0.28))",
            },
            show: {
              opacity: 1,
              x: [0, 16, -7, 0],
              y: 0,
              scale: [1, 1.035, 0.992, 1],
              rotateX: 0,
              rotateZ: [0, 0.8, -0.35, 0],
              filter:
                "blur(0px) brightness(1) drop-shadow(0 10px 10px rgba(58, 31, 15, 0.26)) drop-shadow(0 2px 0 rgba(255, 255, 255, 0.28))",
            },
          }}
        />
        <motion.img
          alt=""
          aria-hidden="true"
          className="noticeFrame noticeFrameUpper"
          draggable={false}
          src="/notice/board1/Frame-upper.png"
          style={noticeFrameUpperStyle}
          transition={{
            delay: 0.82,
            duration: 0.86,
            ease: [0.16, 1, 0.3, 1],
          }}
          variants={{
            hidden: {
              opacity: 0,
              y: -26,
              scale: 1.08,
              clipPath: "inset(0% 52% 0% 52%)",
              filter: "blur(12px) brightness(1.55)",
            },
            show: {
              opacity: 1,
              y: 0,
              scale: 1,
              clipPath: "inset(0% 0% 0% 0%)",
              filter: "blur(0px) brightness(1)",
            },
          }}
        />
      </div>
    </motion.section>
  );
}
