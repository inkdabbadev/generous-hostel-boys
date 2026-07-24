"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import type { CSSProperties } from "react";

type NoticeboardLayerSet = {
  folder: string;
  papers: string[];
  tapes: string[];
};

type SectionJumpIntentEvent = CustomEvent<{
  direction: 1 | -1;
  section: HTMLElement;
}>;

const boards: NoticeboardLayerSet[] = [
  {
    folder: "board1",
    papers: ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png"],
    tapes: ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png"],
  },
  {
    folder: "board2",
    papers: ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png"],
    tapes: ["1.png", "2.png"],
  },
  {
    folder: "board3",
    papers: ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png"],
    tapes: ["1.png", "2.png"],
  },
];

const noticeboardTitleControls = {
  x: "19%",
  y: "clamp(18px, 3vh, 30px)",
  size: "clamp(4.4rem, 8.2vw, 10.8rem)",
};

const noticeboardTitleStyle = {
  fontSize: noticeboardTitleControls.size,
  left: noticeboardTitleControls.x,
  top: noticeboardTitleControls.y,
} satisfies CSSProperties;

export default function Noticeboard() {
  const sectionRef = useRef<HTMLElement>(null);
  const phaseRef = useRef(0);
  const titleControls = useAnimation();
  const board1Controls = useAnimation();
  const board2Controls = useAnimation();
  const board3Controls = useAnimation();
  const boardControls = useMemo(
    () => [board1Controls, board2Controls, board3Controls],
    [board1Controls, board2Controls, board3Controls],
  );

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const hideAllBoards = () => {
      board1Controls.set("hidden");
      board2Controls.set("hidden");
      board3Controls.set("hidden");
    };

    const showBoard = (nextPhase: number) => {
      const clampedPhase = Math.max(0, Math.min(nextPhase, boards.length - 1));

      phaseRef.current = clampedPhase;
      hideAllBoards();
      boardControls[clampedPhase].set("hidden");
      requestAnimationFrame(() => {
        void boardControls[clampedPhase].start("show");
      });
    };

    const resetToFirstBoard = () => {
      phaseRef.current = 0;
      titleControls.set("hidden");
      hideAllBoards();
      requestAnimationFrame(() => {
        void titleControls.start("show");
        void board1Controls.start("show");
      });
    };

    titleControls.set("hidden");
    hideAllBoards();

    const observer = new IntersectionObserver(
      ([entry]) => {
        const nextIsVisible = entry.isIntersecting && entry.intersectionRatio >= 0.34;

        if (nextIsVisible) {
          resetToFirstBoard();
          return;
        }

        phaseRef.current = 0;
        titleControls.set("hidden");
        hideAllBoards();
      },
      { threshold: [0, 0.34] },
    );

    const onSectionJumpIntent = (event: Event) => {
      const { direction, section: activeSection } = (event as SectionJumpIntentEvent).detail;

      if (activeSection !== section) {
        return;
      }

      if (direction === 1 && phaseRef.current < boards.length - 1) {
        event.preventDefault();
        showBoard(phaseRef.current + 1);
        return;
      }

      if (direction === -1 && phaseRef.current > 0) {
        event.preventDefault();
        showBoard(phaseRef.current - 1);
      }
    };

    observer.observe(section);
    window.addEventListener("section-jump:intent", onSectionJumpIntent);

    return () => {
      observer.disconnect();
      window.removeEventListener("section-jump:intent", onSectionJumpIntent);
    };
  }, [board1Controls, board2Controls, board3Controls, boardControls, titleControls]);

  const renderBoard = (
    board: NoticeboardLayerSet,
    controls: ReturnType<typeof useAnimation>,
  ) => (
    <motion.div
      animate={controls}
      aria-hidden="true"
      className="noticeboardLayerBoard"
      initial="hidden"
      key={board.folder}
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1 },
      }}
    >
      {board.papers.map((paper, index) => (
        <motion.img
          alt=""
          animate={controls}
          aria-hidden="true"
          className="noticeboardLayerPaper"
          draggable={false}
          initial="hidden"
          key={`paper-${paper}`}
          src={`/notice/${board.folder}/paper/${paper}`}
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
      {board.tapes.map((tape, index) => (
        <motion.img
          alt=""
          animate={controls}
          aria-hidden="true"
          className="noticeboardLayerTape"
          draggable={false}
          initial="hidden"
          key={`tape-${tape}`}
          src={`/notice/${board.folder}/tape/${tape}`}
          transition={{
            delay: board.papers.length * 0.22 + 0.46 + index * 0.16,
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
    </motion.div>
  );

  return (
    <section
      aria-label="Noticeboard layered paper sequence"
      className="noticeboardSection noticeboardCombinedSection"
      ref={sectionRef}
    >
      <motion.h2
        animate={titleControls}
        className="noticeboardOverlayTitle"
        initial="hidden"
        style={noticeboardTitleStyle}
        transition={{ delay: 0.04, duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
        variants={{
          hidden: { opacity: 0, y: -34, scale: 0.94, filter: "blur(10px)" },
          show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
        }}
      >
        Noticeboard
      </motion.h2>
      <div className="noticeboardLayerShell">
        {boards.map((board, index) => renderBoard(board, boardControls[index]))}
      </div>
    </section>
  );
}
