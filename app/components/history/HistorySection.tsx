"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { historyLayout, stickyNotes } from "./data";
import { HistoryPanel } from "./HistoryPanel";
import { StickyNoteButton } from "./StickyNoteButton";
import type { HistoryPanel as HistoryPanelName } from "./types";

export default function HistorySection() {
  const [activePanel, setActivePanel] = useState<HistoryPanelName | null>(null);

  useEffect(() => {
    if (!activePanel) return;
    const { documentElement, body } = document;
    const prevHtmlOverflow = documentElement.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    documentElement.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      documentElement.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, [activePanel]);

  return (
    <motion.section
      aria-label="History"
      className="historySection"
      initial="hidden"
      viewport={{ once: true, amount: 0.5 }}
      whileInView="show"
    >
      <img
        alt=""
        aria-hidden="true"
        className="historyBackground"
        draggable={false}
        src="/history/background.png"
        style={historyLayout.background}
      />
      <img
        alt=""
        aria-hidden="true"
        className="historyWarden"
        draggable={false}
        src="/history/warden.png"
        style={historyLayout.warden}
      />
      <h2 className="historyMarketingText" style={historyLayout.marketingText}>
        <span>Marketing</span>
        <motion.img
          alt=""
          aria-hidden="true"
          className="historyMarketingScribble"
          draggable={false}
          initial={{
            opacity: 0,
            scaleX: 0.98,
          }}
          src="/history/scrriblegif.gif"
          style={historyLayout.marketingPen}
          transition={{
            delay: 0.38,
            duration: 0.18,
            ease: [0.5, 0, 0.2, 1],
          }}
          variants={{
            hidden: {
              opacity: 0,
              scaleX: 0.98,
            },
            show: {
              opacity: 1,
              scaleX: 1,
            },
          }}
        />
      </h2>
      <motion.img
        alt="How to make history?"
        className="historyMakeText"
        draggable={false}
        initial={{
          opacity: 0,
          y: 22,
          scale: 0.94,
          rotate: -1.4,
        }}
        src="/history/text.svg"
        style={historyLayout.makeHistoryText}
        transition={{
          delay: 1.58,
          duration: 0.58,
          ease: [0.16, 1, 0.3, 1],
        }}
        variants={{
          hidden: {
            opacity: 0,
            y: 22,
            scale: 0.94,
            rotate: -1.4,
          },
          show: {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
          },
        }}
      />
      {stickyNotes.map((note) => (
        <StickyNoteButton key={note.src} note={note} onSelect={setActivePanel} />
      ))}
      <AnimatePresence>
        {activePanel ? (
          <HistoryPanel activePanel={activePanel} onClose={() => setActivePanel(null)} />
        ) : null}
      </AnimatePresence>
    </motion.section>
  );
}
