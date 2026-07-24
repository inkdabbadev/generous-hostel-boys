"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const maxHostelPhase = 3;

export default function HostelGenreProof() {
  const sectionRef = useRef<HTMLElement>(null);
  const phaseRef = useRef(0);
  const isSteppingRef = useRef(false);
  const [phase, setPhase] = useState(0);
  const [gifRun, setGifRun] = useState(0);

  useEffect(() => {
    const setStepPhase = (nextPhase: number) => {
      const clampedPhase = Math.min(Math.max(nextPhase, 0), maxHostelPhase);
      phaseRef.current = clampedPhase;
      setPhase(clampedPhase);

      if (clampedPhase === maxHostelPhase) {
        setGifRun((run) => run + 1);
      }
    };

    const lockHostelView = () => {
      const section = sectionRef.current;

      if (!section) {
        return;
      }

      window.scrollTo({
        top: section.offsetTop,
        behavior: "auto",
      });
    };

    const getHostelRect = () => {
      const section = sectionRef.current;

      if (!section) {
        return null;
      }

      return section.getBoundingClientRect();
    };

    const hostelIsPinned = () => {
      const rect = getHostelRect();

      if (!rect) {
        return false;
      }

      return rect.top <= 2 && rect.bottom >= window.innerHeight - 2;
    };

    const hostelIsInLockZone = () => {
      const rect = getHostelRect();

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
      lockHostelView();
      setStepPhase(phaseRef.current + direction);

      window.setTimeout(() => {
        isSteppingRef.current = false;
      }, 760);
    };

    const onSectionJumpIntent = (event: Event) => {
      const customEvent = event as CustomEvent<{
        direction: 1 | -1;
        section: HTMLElement;
      }>;

      if (customEvent.detail.section !== sectionRef.current || !hostelIsPinned()) {
        return;
      }

      const { direction } = customEvent.detail;
      const canStepForward = direction === 1 && phaseRef.current < maxHostelPhase;
      const canStepBackward = direction === -1 && phaseRef.current > 0;

      if (!canStepForward && !canStepBackward) {
        return;
      }

      customEvent.preventDefault();
      stepPhase(direction);
    };

    const onWheel = (event: WheelEvent) => {
      if (!hostelIsInLockZone() || Math.abs(event.deltaY) < 8) {
        return;
      }

      const isForward = event.deltaY > 0;
      const canStepForward = isForward && phaseRef.current < maxHostelPhase;
      const canStepBackward = !isForward && phaseRef.current > 0;

      if (!hostelIsPinned() && (canStepForward || canStepBackward)) {
        event.preventDefault();
        lockHostelView();
        if (isForward && phaseRef.current === 0) {
          setStepPhase(1);
        }
        return;
      }

      if (canStepForward || canStepBackward) {
        event.preventDefault();
        stepPhase(isForward ? 1 : -1);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!hostelIsInLockZone()) {
        return;
      }

      const forwardKeys = ["ArrowDown", "PageDown", " ", "Spacebar"];
      const backwardKeys = ["ArrowUp", "PageUp"];
      const isForward = forwardKeys.includes(event.key) || forwardKeys.includes(event.code);
      const isBackward = backwardKeys.includes(event.key) || backwardKeys.includes(event.code);
      const canStepForward = isForward && phaseRef.current < maxHostelPhase;
      const canStepBackward = isBackward && phaseRef.current > 0;

      if (!hostelIsPinned() && (canStepForward || canStepBackward)) {
        event.preventDefault();
        event.stopPropagation();
        lockHostelView();
        if (isForward && phaseRef.current === 0) {
          setStepPhase(1);
        }
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
    <section className="hostelGenreProof" aria-labelledby="hostel-genre-title" ref={sectionRef}>
      <div className="hostelGenreShell">
        <div className="hostelGenreCopy">
          <motion.h2
            id="hostel-genre-title"
            initial="hidden"
            transition={{ staggerChildren: 0.1 }}
            viewport={{ once: false, amount: 0.55 }}
            whileInView="show"
          >
            <motion.span
              variants={{
                hidden: { opacity: 0, x: -72, skewX: -7 },
                show: { opacity: 1, x: 0, skewX: 0 },
              }}
              transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
            >
              TN audience already
            </motion.span>
            <motion.span
              variants={{
                hidden: { opacity: 0, x: 72, skewX: 7 },
                show: { opacity: 1, x: 0, skewX: 0 },
              }}
              transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
            >
              love hostel as a{" "}
              <motion.em
                variants={{
                  hidden: { opacity: 0, scale: 0.74, rotate: -3 },
                  show: { opacity: 1, scale: 1, rotate: 0 },
                }}
                transition={{ delay: 0.18, duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
              >
                genre
              </motion.em>
            </motion.span>
          </motion.h2>
        </div>

        <motion.div
          className="hostelProofBay"
          animate={{ opacity: phase >= 1 ? 1 : 0 }}
          transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {phase >= 1 ? (
            <motion.div
              aria-hidden="true"
              className="hostelPrimaryProof"
              animate={{ opacity: 1, rotate: 0, scale: 1, y: 0 }}
              initial={{ opacity: 0, rotate: -8, scale: 0.86, y: -260 }}
              transition={{ duration: 0.86, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="hostelTvStage" aria-hidden="true">
                <span className="hostelTvDarkScreen" />
                <motion.img
                  animate={{
                    clipPath:
                      phase >= 2 ? "circle(78% at 50% 50%)" : "circle(0% at 50% 50%)",
                    filter:
                      phase >= 2
                        ? "brightness(0.96) contrast(1.04) saturate(0.96)"
                        : "brightness(1.8) contrast(1.25) saturate(0.2)",
                    opacity: phase >= 2 ? 1 : 0,
                    scale: phase >= 2 ? 1.02 : 0.08,
                  }}
                  className="hostelTvScreen"
                  alt=""
                  draggable={false}
                  initial={false}
                  src="/hostelgenre/primary.png"
                  transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                />
                <motion.span
                  animate={{
                    opacity: phase >= 2 ? [0, 1, 0] : 0,
                    scaleX: phase >= 2 ? [0.06, 1, 0.8] : 0.06,
                  }}
                  className="hostelTvPowerFlash"
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                />
                <img
                  className="hostelTvFrame"
                  alt=""
                  draggable={false}
                  src="/hostelgenre/tv.png"
                />
              </span>
            </motion.div>
          ) : null}
        </motion.div>
      </div>
      {phase >= 3 ? (
        <motion.div
          aria-hidden="true"
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="hostelAlumbFinal"
          initial={{ opacity: 0, scale: 0.9, y: 34 }}
          key={`hostel-alumb-final-${gifRun}`}
          transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            alt=""
            className="hostelAlumbGif"
            draggable={false}
            src={`/hostelgenre/alumb.gif?run=${gifRun}`}
          />
        </motion.div>
      ) : null}
    </section>
  );
}
