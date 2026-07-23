"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const maxCommonPhase = 3;

export default function CommonThread() {
  const sectionRef = useRef<HTMLElement>(null);
  const phaseRef = useRef(0);
  const isSteppingRef = useRef(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const setStepPhase = (nextPhase: number) => {
      const clampedPhase = Math.min(Math.max(nextPhase, 0), maxCommonPhase);
      phaseRef.current = clampedPhase;
      setPhase(clampedPhase);
    };

    const lockCommonView = () => {
      const section = sectionRef.current;

      if (!section) {
        return;
      }

      window.scrollTo({
        top: section.offsetTop,
        behavior: "auto",
      });
    };

    const getCommonRect = () => {
      const section = sectionRef.current;

      if (!section) {
        return null;
      }

      return section.getBoundingClientRect();
    };

    const commonIsPinned = () => {
      const rect = getCommonRect();

      if (!rect) {
        return false;
      }

      return rect.top <= 2 && rect.bottom >= window.innerHeight - 2;
    };

    const commonIsInLockZone = () => {
      const rect = getCommonRect();

      if (!rect) {
        return false;
      }

      return rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.55;
    };

    const stepPhase = (direction: 1 | -1) => {
      if (isSteppingRef.current) {
        return;
      }

      isSteppingRef.current = true;
      lockCommonView();
      setStepPhase(phaseRef.current + direction);

      window.setTimeout(() => {
        isSteppingRef.current = false;
      }, 920);
    };

    const onSectionJumpIntent = (event: Event) => {
      const customEvent = event as CustomEvent<{
        direction: 1 | -1;
        section: HTMLElement;
      }>;

      if (customEvent.detail.section !== sectionRef.current || !commonIsPinned()) {
        return;
      }

      const { direction } = customEvent.detail;
      const canStepForward = direction === 1 && phaseRef.current < maxCommonPhase;
      const canStepBackward = direction === -1 && phaseRef.current > 0;

      if (!canStepForward && !canStepBackward) {
        return;
      }

      customEvent.preventDefault();
      stepPhase(direction);
    };

    const onWheel = (event: WheelEvent) => {
      if (!commonIsInLockZone() || Math.abs(event.deltaY) < 8) {
        return;
      }

      if (isSteppingRef.current) {
        event.preventDefault();
        lockCommonView();
        return;
      }

      const isForward = event.deltaY > 0;
      const canStepForward = isForward && phaseRef.current < maxCommonPhase;
      const canStepBackward = !isForward && phaseRef.current > 0;

      if (!commonIsPinned() && (canStepForward || canStepBackward)) {
        event.preventDefault();
        lockCommonView();
        stepPhase(isForward ? 1 : -1);
        return;
      }

      if (canStepForward || canStepBackward) {
        event.preventDefault();
        stepPhase(isForward ? 1 : -1);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!commonIsInLockZone()) {
        return;
      }

      const forwardKeys = ["ArrowDown", "PageDown", " ", "Spacebar"];
      const backwardKeys = ["ArrowUp", "PageUp"];
      const isForward = forwardKeys.includes(event.key) || forwardKeys.includes(event.code);
      const isBackward = backwardKeys.includes(event.key) || backwardKeys.includes(event.code);
      const canStepForward = isForward && phaseRef.current < maxCommonPhase;
      const canStepBackward = isBackward && phaseRef.current > 0;

      if (isSteppingRef.current && (isForward || isBackward)) {
        event.preventDefault();
        event.stopPropagation();
        lockCommonView();
        return;
      }

      if (!commonIsPinned() && (canStepForward || canStepBackward)) {
        event.preventDefault();
        event.stopPropagation();
        lockCommonView();
        stepPhase(canStepForward ? 1 : -1);
        return;
      }

      if (canStepForward || canStepBackward) {
        event.preventDefault();
        event.stopPropagation();
        stepPhase(canStepForward ? 1 : -1);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("section-jump:intent", onSectionJumpIntent);
    document.addEventListener("keydown", onKeyDown, { capture: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("section-jump:intent", onSectionJumpIntent);
      document.removeEventListener("keydown", onKeyDown, { capture: true });
    };
  }, []);

  return (
    <section
      aria-labelledby="common-thread-title"
      className="commonThread"
      ref={sectionRef}
    >
      <h2 className="commonThreadSrTitle" id="common-thread-title">
        What is common among both of these films?
      </h2>

      <div className="commonThreadStage" aria-hidden="true">
        <motion.div
          animate={{
            opacity: phase >= 1 ? (phase >= 2 ? 0.92 : 1) : 0,
            backdropFilter: phase >= 1 ? (phase >= 2 ? "blur(0px)" : "blur(7px)") : "blur(0px)",
          }}
          className="commonThreadFocusVeil"
          initial={false}
          transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
        />

        <motion.article
          animate={{
            opacity: 1,
            rotate: 0,
            scale: phase >= 2 ? 0.96 : phase >= 1 ? 1.05 : 1,
            x: phase >= 2 ? -42 : phase >= 1 ? -8 : 0,
            filter:
              phase >= 2
                ? "blur(0px) brightness(0.82)"
                : phase >= 1
                  ? "blur(2.4px) brightness(0.74)"
                  : "blur(0px) brightness(1)",
          }}
          className="commonThreadBackdropPoster commonThreadBackdropLeft"
          initial={false}
          transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            alt="Kantara reference"
            draggable={false}
            src="/common/kantara.jpg"
          />
        </motion.article>

        <motion.article
          animate={{
            opacity: 1,
            rotate: 0,
            scale: phase >= 2 ? 0.96 : phase >= 1 ? 1.05 : 1,
            x: phase >= 2 ? 42 : phase >= 1 ? 8 : 0,
            filter:
              phase >= 2
                ? "blur(0px) brightness(0.82)"
                : phase >= 1
                  ? "blur(2.4px) brightness(0.74)"
                  : "blur(0px) brightness(1)",
          }}
          className="commonThreadBackdropPoster commonThreadBackdropRight"
          initial={false}
          transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            alt="Hostel film reference"
            draggable={false}
            src="/common/hostel.jpeg"
          />
        </motion.article>

        <motion.img
          alt=""
          animate={{
            opacity: phase === 1 ? 1 : 0,
            scale: phase >= 2 ? 1.08 : phase >= 1 ? 1 : 0.78,
            x: "-50%",
            y: phase >= 2 ? "calc(-50% - 42px)" : phase >= 1 ? "-50%" : "calc(-50% + 34px)",
            filter: phase >= 2 ? "blur(1.8px) brightness(0.72)" : phase >= 1 ? "blur(0px)" : "blur(8px)",
          }}
          className="commonThreadTextAsset"
          draggable={false}
          initial={false}
          src="/common/text.svg"
          transition={{ duration: 0.78, ease: [0.16, 1, 0.3, 1] }}
        />

        <motion.div
          animate={{
            opacity: phase >= 2 ? 1 : 0,
            y: phase >= 2 ? 0 : 130,
          }}
          className="commonThreadStripLayer"
          initial={false}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            animate={{ x: phase >= 2 ? 0 : "-34%", rotate: -7 }}
            className="commonThreadStrip commonThreadStripA"
            transition={{ duration: 0.82, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            animate={{ x: phase >= 2 ? 0 : "34%", rotate: 7 }}
            className="commonThreadStrip commonThreadStripB"
            transition={{ duration: 0.82, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>

        <motion.img
          animate={{
            opacity: phase === 2 ? 1 : 0,
            scale: phase >= 2 ? 1.68 : 0.72,
            x: "-50%",
            y: phase >= 2 ? "calc(-50% + 4px)" : "calc(-50% + 120px)",
            filter: phase >= 2 ? "blur(0px)" : "blur(10px)",
          }}
          className="commonThreadMusicPerson"
          draggable={false}
          initial={false}
          src="/common/music.png"
          transition={{ duration: 0.78, ease: [0.16, 1, 0.3, 1] }}
        />

        <motion.img
          animate={{
            opacity: phase >= 3 ? 1 : 0,
            scale: phase >= 3 ? 1 : 0.76,
            x: "-50%",
            y: phase >= 3 ? "calc(-50% - 6px)" : "calc(-50% + 120px)",
            filter: phase >= 3 ? "blur(0px)" : "blur(10px)",
          }}
          className="commonThreadMusicPerson commonThreadCinemoPerson"
          draggable={false}
          initial={false}
          src="/common/cinemo.png"
          transition={{ duration: 0.78, ease: [0.16, 1, 0.3, 1] }}
        />

        <motion.img
          animate={{
            opacity: phase === 2 ? 1 : 0,
            scale: phase >= 2 ? 1 : 0.78,
            x: "-50%",
            y: phase >= 2 ? 0 : 46,
          }}
          className="commonThreadMusicTitle"
          draggable={false}
          initial={false}
          src="/common/music-title.png"
          transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
        />

        <motion.img
          animate={{
            opacity: phase >= 3 ? 1 : 0,
            scale: phase >= 3 ? 1 : 0.78,
            x: "-50%",
            y: phase >= 3 ? 0 : 46,
          }}
          className="commonThreadMusicTitle commonThreadCinemoTitle"
          draggable={false}
          initial={false}
          src="/common/cinemo-title.png"
          transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </section>
  );
}
