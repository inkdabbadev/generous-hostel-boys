"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const topWords = ["What", "happens"];
const bottomWords = ["If", "you", "give", "us"];
const maxAskPhase = 1;
const clockTransition = { duration: 1.25, ease: [0.16, 1, 0.3, 1] } as const;
const headlineLineTransition = { duration: 0.86, ease: [0.16, 1, 0.3, 1] } as const;
const headlineWordTransition = { duration: 0.72, ease: [0.16, 1, 0.3, 1] } as const;

export default function ActualAskIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const phaseRef = useRef(0);
  const isSteppingRef = useRef(false);
  const isClockHidingRef = useRef(false);
  const clockHideTimeoutRef = useRef<number | null>(null);
  const stepTimeoutRef = useRef<number | null>(null);
  const [phase, setPhase] = useState(0);
  const [clockVisible, setClockVisible] = useState(false);
  const [clockRunId, setClockRunId] = useState(0);

  useEffect(() => {
    const clearClockHideTimeout = () => {
      if (clockHideTimeoutRef.current !== null) {
        window.clearTimeout(clockHideTimeoutRef.current);
        clockHideTimeoutRef.current = null;
      }
    };

    const clearStepTimeout = () => {
      if (stepTimeoutRef.current !== null) {
        window.clearTimeout(stepTimeoutRef.current);
        stepTimeoutRef.current = null;
      }
    };

    const resetAskState = () => {
      clearClockHideTimeout();
      clearStepTimeout();
      phaseRef.current = 0;
      isSteppingRef.current = false;
      isClockHidingRef.current = false;
      setPhase(0);
      setClockVisible(false);
    };

    const setStepPhase = (nextPhase: number) => {
      const clampedPhase = Math.min(Math.max(nextPhase, 0), maxAskPhase);

      if (phaseRef.current < 1 && clampedPhase === 1) {
        clearClockHideTimeout();
        clearStepTimeout();
        isClockHidingRef.current = false;

        phaseRef.current = 1;
        setPhase(1);
        setClockRunId((runId) => runId + 1);
        setClockVisible(true);
        return;
      }

      if (phaseRef.current > 0 && clampedPhase === 0) {
        clearClockHideTimeout();
        clearStepTimeout();
        isClockHidingRef.current = true;
        setClockVisible(false);

        clockHideTimeoutRef.current = window.setTimeout(() => {
          phaseRef.current = 0;
          isClockHidingRef.current = false;
          setPhase(0);
          clockHideTimeoutRef.current = null;
        }, 1280);

        return;
      }

      phaseRef.current = clampedPhase;
      setPhase(clampedPhase);
    };

    const lockAskView = () => {
      const section = sectionRef.current;

      if (!section) {
        return;
      }

      window.scrollTo({
        top: section.offsetTop,
        behavior: "auto",
      });
    };

    const getAskRect = () => {
      const section = sectionRef.current;

      if (!section) {
        return null;
      }

      return section.getBoundingClientRect();
    };

    const askIsPinned = () => {
      const rect = getAskRect();

      if (!rect) {
        return false;
      }

      return rect.top <= 2 && rect.bottom >= window.innerHeight - 2;
    };

    const askIsInLockZone = () => {
      const rect = getAskRect();

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
      lockAskView();
      setStepPhase(phaseRef.current + direction);

      clearStepTimeout();
      stepTimeoutRef.current = window.setTimeout(() => {
        isSteppingRef.current = false;
        stepTimeoutRef.current = null;
      }, 1320);
    };

    const onSectionJumpIntent = (event: Event) => {
      const customEvent = event as CustomEvent<{
        direction: 1 | -1;
        section: HTMLElement;
      }>;

      if (customEvent.detail.section !== sectionRef.current) {
        return;
      }

      const { direction } = customEvent.detail;
      const canStepForward = direction === 1 && phaseRef.current < maxAskPhase;
      const canStepBackward = direction === -1 && phaseRef.current > 0;

      if (canStepForward || canStepBackward || isSteppingRef.current || isClockHidingRef.current) {
        customEvent.preventDefault();
        lockAskView();

        if (canStepForward || canStepBackward) {
          stepPhase(direction);
        }
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (!askIsInLockZone() || Math.abs(event.deltaY) < 8) {
        return;
      }

      const isForward = event.deltaY > 0;
      const canStepForward = isForward && phaseRef.current < maxAskPhase;
      const canStepBackward = !isForward && phaseRef.current > 0;

      if (!askIsPinned() && (canStepForward || canStepBackward)) {
        event.preventDefault();
        lockAskView();

        if (isForward && phaseRef.current === 0) {
          stepPhase(1);
        }

        return;
      }

      if (canStepForward || canStepBackward || isSteppingRef.current || isClockHidingRef.current) {
        event.preventDefault();

        if (canStepForward || canStepBackward) {
          stepPhase(isForward ? 1 : -1);
        }
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!askIsInLockZone()) {
        return;
      }

      const forwardKeys = ["ArrowDown", "PageDown", " ", "Spacebar"];
      const backwardKeys = ["ArrowUp", "PageUp"];
      const isForward = forwardKeys.includes(event.key) || forwardKeys.includes(event.code);
      const isBackward = backwardKeys.includes(event.key) || backwardKeys.includes(event.code);
      const canStepForward = isForward && phaseRef.current < maxAskPhase;
      const canStepBackward = isBackward && phaseRef.current > 0;

      if (!isForward && !isBackward) {
        return;
      }

      if (!askIsPinned() && (canStepForward || canStepBackward)) {
        event.preventDefault();
        event.stopPropagation();
        lockAskView();

        if (isForward && phaseRef.current === 0) {
          stepPhase(1);
        }

        return;
      }

      if (canStepForward || canStepBackward || isSteppingRef.current || isClockHidingRef.current) {
        event.preventDefault();
        event.stopPropagation();

        if (canStepForward || canStepBackward) {
          stepPhase(isForward ? 1 : -1);
        }
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("section-jump:intent", onSectionJumpIntent);
    document.addEventListener("keydown", onKeyDown, { capture: true });

    const section = sectionRef.current;
    const resetObserver = section
      ? new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) {
              resetAskState();
            }
          },
          { threshold: 0 },
        )
      : null;

    if (section && resetObserver) {
      resetObserver.observe(section);
    }

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("section-jump:intent", onSectionJumpIntent);
      document.removeEventListener("keydown", onKeyDown, { capture: true });
      resetObserver?.disconnect();

      clearClockHideTimeout();
      clearStepTimeout();
    };
  }, []);

  return (
    <motion.section
      aria-label="Actual ask intro"
      className="actualAskIntro"
      ref={sectionRef}
    >
      <div className="actualAskIntroShell">
        <h2>
          <motion.span
            className="actualAskLine actualAskLineWhite"
            initial="hidden"
            viewport={{ once: false, amount: 0.82 }}
            variants={{
              hidden: { opacity: 0, x: -42, y: 8 },
              show: {
                opacity: 1,
                x: 0,
                y: 0,
                transition: {
                  ...headlineLineTransition,
                  staggerChildren: 0.055,
                  delayChildren: 0.18,
                },
              },
            }}
            whileInView="show"
          >
            {topWords.map((word) => (
              <motion.span
                className="actualAskWord"
                key={word}
                transition={headlineWordTransition}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 28,
                    filter: "blur(5px)",
                  },
                  show: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                  },
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.span>
          <motion.span
            className="actualAskLine actualAskLineGold"
            initial="hidden"
            viewport={{ once: false, amount: 0.82 }}
            variants={{
              hidden: { opacity: 0, x: 42, y: 8 },
              show: {
                opacity: 1,
                x: 0,
                y: 0,
                transition: {
                  ...headlineLineTransition,
                  staggerChildren: 0.05,
                  delayChildren: 0.38,
                },
              },
            }}
            whileInView="show"
          >
            {bottomWords.map((word, index) => (
              <motion.span
                className="actualAskWord"
                key={word}
                transition={headlineWordTransition}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: index % 2 === 0 ? 30 : 22,
                    filter: "blur(6px)",
                  },
                  show: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                  },
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.span>
        </h2>
      </div>
      {phase >= 1 ? (
        <div className="actualAskClockWrap">
          <motion.div
            animate={{ y: clockVisible ? 0 : "82vh", opacity: 1 }}
            className="actualAskClockMotion"
            initial={{ y: "82vh", opacity: 1 }}
            transition={clockTransition}
          >
            <img
              alt=""
              aria-hidden="true"
              className="actualAskClock"
              draggable={false}
              key={clockRunId}
              src={`/actualask/clock.gif?run=${clockRunId}`}
            />
          </motion.div>
        </div>
      ) : null}
    </motion.section>
  );
}
