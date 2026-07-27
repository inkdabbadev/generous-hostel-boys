"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import type { PointerEvent } from "react";
import type { HistoryPanel, HistoryStickyNote } from "./types";

type StickyNoteButtonProps = {
  note: HistoryStickyNote;
  onSelect: (panel: HistoryPanel) => void;
};

export function StickyNoteButton({ note, onSelect }: StickyNoteButtonProps) {
  const hoverX = useMotionValue(0);
  const hoverY = useMotionValue(0);
  const hoverRotate = useMotionValue(0);
  const springX = useSpring(hoverX, { stiffness: 190, damping: 16, mass: 0.42 });
  const springY = useSpring(hoverY, { stiffness: 190, damping: 16, mass: 0.42 });
  const springRotate = useSpring(hoverRotate, { stiffness: 170, damping: 15, mass: 0.42 });

  const resetHover = () => {
    hoverX.set(0);
    hoverY.set(0);
    hoverRotate.set(0);
  };
  const panel = note.panel;
  const handleClick = panel ? () => onSelect(panel) : undefined;

  const noteContent = (
    <motion.span
      className="historyStickyHoverPlane"
      style={{
        rotate: springRotate,
        x: springX,
        y: springY,
      }}
    >
      <img
        alt=""
        aria-hidden="true"
        className="historyStickyPaper"
        draggable={false}
        src={note.src}
      />
    </motion.span>
  );

  const motionProps = {
    initial: {
      opacity: 0,
      rotate: note.rotate - 7,
      scale: 1.18,
      y: -34,
    },
    onPointerLeave: resetHover,
    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const relX = (event.clientX - rect.left) / rect.width - 0.5;
      const relY = (event.clientY - rect.top) / rect.height - 0.5;

      hoverX.set(relX * 24);
      hoverY.set(relY * 18);
      hoverRotate.set(relX * 7 - relY * 2);
    },
    style: note.style,
    transition: {
      delay: note.delay,
      duration: 0.58,
      ease: [0.16, 1, 0.3, 1] as const,
    },
    variants: {
      hidden: {
        opacity: 0,
        rotate: note.rotate - 7,
        scale: 1.18,
        y: -34,
      },
      show: {
        opacity: 1,
        rotate: note.rotate,
        scale: 1,
        y: 0,
      },
    },
    whileFocus: {
      scale: 1.035,
      zIndex: 8,
    },
    whileHover: {
      scale: 1.035,
      zIndex: 8,
    },
    whileTap: {
      scale: 0.97,
    },
  };

  if (note.href) {
    return (
      <motion.a
        {...motionProps}
        aria-label={note.alt}
        className="historyStickyNote"
        href={note.href}
      >
        {noteContent}
      </motion.a>
    );
  }

  if (!handleClick) {
    return (
      <motion.div
        {...motionProps}
        aria-label={note.alt}
        className="historyStickyNote"
        role="img"
      >
        {noteContent}
      </motion.div>
    );
  }

  return (
    <motion.button
      {...motionProps}
      aria-label={note.alt}
      className="historyStickyNote"
      onClick={handleClick}
      type="button"
    >
      {noteContent}
    </motion.button>
  );
}
