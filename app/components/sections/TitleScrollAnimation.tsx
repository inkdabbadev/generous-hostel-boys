"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { CSSProperties, KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";

type TitleScrollStyle = CSSProperties & {
  "--hostel-opacity": string;
  "--hostel-cut-opacity": string;
  "--boys-opacity": string;
  "--small-campa-opacity": string;
  "--small-campa-clip": string;
  "--big-campa-opacity": string;
  "--big-campa-clip": string;
};

const stages: TitleScrollStyle[] = [
  {
    "--hostel-opacity": "0",
    "--hostel-cut-opacity": "0",
    "--boys-opacity": "0",
    "--small-campa-opacity": "0",
    "--small-campa-clip": "100%",
    "--big-campa-opacity": "0",
    "--big-campa-clip": "100%",
  },
  {
    "--hostel-opacity": "1",
    "--hostel-cut-opacity": "0",
    "--boys-opacity": "1",
    "--small-campa-opacity": "0",
    "--small-campa-clip": "100%",
    "--big-campa-opacity": "0",
    "--big-campa-clip": "100%",
  },
  {
    "--hostel-opacity": "0",
    "--hostel-cut-opacity": "1",
    "--boys-opacity": "1",
    "--small-campa-opacity": "1",
    "--small-campa-clip": "0%",
    "--big-campa-opacity": "0",
    "--big-campa-clip": "100%",
  },
  {
    "--hostel-opacity": "0",
    "--hostel-cut-opacity": "0",
    "--boys-opacity": "1",
    "--small-campa-opacity": "0",
    "--small-campa-clip": "0%",
    "--big-campa-opacity": "1",
    "--big-campa-clip": "0%",
  },
];

const animationDuration = 560;

const stageCopy = [
  {
    eyebrow: "Title switch",
    title: "Scroll to start the reveal",
    body: "Use one scroll at a time to watch the poster title transform.",
  },
  {
    eyebrow: "Genre recall",
    title: "Hostel Boyz enters first",
    body: "We begin with the familiar hostel-comedy space the youth audience already understands.",
  },
  {
    eyebrow: "Campaign hook",
    title: "Campa starts taking over",
    body: "The title begins to shift from category recall into a sharper, ownable launch identity.",
  },
  {
    eyebrow: "Final positioning",
    title: "Campa Boyz lands",
    body: "Same hostel energy, but now reframed as a distinct Campa Boyz pitch for the audience.",
  },
];

export default function TitleScrollAnimation() {
  const sectionRef = useRef<HTMLElement>(null);
  const [stage, setStage] = useState(0);
  const isActiveRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const stageRef = useRef(0);
  const touchStartYRef = useRef(0);

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isActiveRef.current = entry.isIntersecting && entry.intersectionRatio > 0.72;
      },
      { threshold: [0, 0.72, 1] },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const moveStage = (direction: 1 | -1) => {
      if (isAnimatingRef.current) {
        return false;
      }

      const nextStage = Math.min(Math.max(stageRef.current + direction, 0), stages.length - 1);

      if (nextStage === stageRef.current) {
        return false;
      }

      isAnimatingRef.current = true;
      stageRef.current = nextStage;
      setStage(nextStage);

      window.setTimeout(() => {
        isAnimatingRef.current = false;
      }, animationDuration);

      return true;
    };

    const shouldLockScroll = (direction: 1 | -1) => {
      if (!isActiveRef.current) {
        return false;
      }

      return (
        (direction === 1 && stageRef.current < stages.length - 1) ||
        (direction === -1 && stageRef.current > 0)
      );
    };

    const lockSectionToViewport = () => {
      const section = sectionRef.current;

      if (!section) {
        return;
      }

      window.scrollTo({
        top: section.offsetTop,
        behavior: "auto",
      });
    };

    const titleSectionIsPinned = () => {
      const section = sectionRef.current;

      if (!section) {
        return false;
      }

      const rect = section.getBoundingClientRect();
      return rect.top <= 2 && rect.bottom >= window.innerHeight - 2;
    };

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 8) {
        return;
      }

      const direction = event.deltaY > 0 ? 1 : -1;

      if (!shouldLockScroll(direction)) {
        return;
      }

      event.preventDefault();
      lockSectionToViewport();
      moveStage(direction);
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? 0;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touchY = event.touches[0]?.clientY ?? touchStartYRef.current;
      const deltaY = touchStartYRef.current - touchY;

      if (Math.abs(deltaY) < 26) {
        return;
      }

      const direction = deltaY > 0 ? 1 : -1;

      if (!shouldLockScroll(direction)) {
        return;
      }

      event.preventDefault();
      lockSectionToViewport();

      if (moveStage(direction)) {
        touchStartYRef.current = touchY;
      }
    };

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      const forwardKeys = ["ArrowDown", "PageDown", " "];
      const backwardKeys = ["ArrowUp", "PageUp"];
      const direction = forwardKeys.includes(event.key) ? 1 : backwardKeys.includes(event.key) ? -1 : 0;

      if (!direction || !shouldLockScroll(direction)) {
        return;
      }

      event.preventDefault();
      lockSectionToViewport();
      moveStage(direction);
    };

    const handleSectionJumpIntent = (event: Event) => {
      const customEvent = event as CustomEvent<{
        direction: 1 | -1;
        section: HTMLElement;
      }>;

      if (customEvent.detail.section !== sectionRef.current || !titleSectionIsPinned()) {
        return;
      }

      const { direction } = customEvent.detail;
      const canMove =
        (direction === 1 && stageRef.current < stages.length - 1) ||
        (direction === -1 && stageRef.current > 0);

      if (!canMove && !isAnimatingRef.current) {
        return;
      }

      customEvent.preventDefault();
      lockSectionToViewport();
      moveStage(direction);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("section-jump:intent", handleSectionJumpIntent);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("section-jump:intent", handleSectionJumpIntent);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    event.currentTarget.focus();
  };

  return (
    <section className="titleScrollPin" ref={sectionRef}>
      <div
        aria-label="Campa Boyz title transition"
        className="titleScrollExperience"
        data-stage={stage}
        onKeyDown={handleKeyDown}
        style={stages[stage]}
        tabIndex={0}
      >
        <div className="titleScrollCopy">
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, x: 0, y: 0 }}
              className="titleScrollCopyState"
              exit={{ opacity: 0, x: -28, y: 8 }}
              initial={{ opacity: 0, x: 28, y: 8 }}
              key={stage}
              transition={{ duration: 0.34, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <span>{stageCopy[stage].eyebrow}</span>
              <h2>{stageCopy[stage].title}</h2>
              <p>{stageCopy[stage].body}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="titleScrollPosterPanel">
          <div className="titleScrollPosterFrame">
            <Image
              alt="Hostel Boyz poster"
              className="titleScrollPosterImage"
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              src="/scroll-animation/main.png"
              unoptimized
            />

            <div className="posterTitleMark">
              <div className="posterTitleHostelWrap">
                <Image
                  alt="Campa"
                  className="titleCampaSmall"
                  height={574}
                  priority
                  src="/scroll-animation/campa.png"
                  unoptimized
                  width={906}
                />
                <Image
                  alt="Hostel"
                  className="titleHostel"
                  height={953}
                  priority
                  src="/scroll-animation/hostel.svg"
                  unoptimized
                  width={2287}
                />
                <Image
                  alt="Hostel sliced transition"
                  className="titleHostelCut"
                  height={953}
                  priority
                  src="/scroll-animation/hostelcut.svg"
                  unoptimized
                  width={2287}
                />
                <Image
                  alt="Campa"
                  className="titleCampaBig"
                  height={574}
                  priority
                  src="/scroll-animation/campa.png"
                  unoptimized
                  width={906}
                />
              </div>
              <Image
                alt="Boys"
                className="titleBoys"
                height={825}
                priority
                src="/scroll-animation/boys.svg"
                unoptimized
                width={1585}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
