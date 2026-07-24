"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type AdaptationStage = "ok" | "tamilnadu" | "years" | "hostelC1" | "hostelC2" | "hostelC3";

export default function AdaptationProof() {
  const sectionRef = useRef<HTMLElement>(null);
  const swapTimeoutRef = useRef<number | null>(null);
  const stageRef = useRef<AdaptationStage>("ok");
  const [stage, setStage] = useState<AdaptationStage>("ok");

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const clearSwapTimeout = () => {
      if (swapTimeoutRef.current !== null) {
        window.clearTimeout(swapTimeoutRef.current);
        swapTimeoutRef.current = null;
      }
    };

    const resetScene = () => {
      clearSwapTimeout();
      stageRef.current = "ok";
      setStage("ok");
    };

    const startScene = () => {
      resetScene();
      swapTimeoutRef.current = window.setTimeout(() => {
        stageRef.current = "tamilnadu";
        setStage("tamilnadu");
        swapTimeoutRef.current = null;
      }, 1000);
    };

    const setSceneStage = (nextStage: AdaptationStage) => {
      clearSwapTimeout();
      stageRef.current = nextStage;
      setStage(nextStage);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.36) {
          startScene();
          return;
        }

        resetScene();
      },
      { threshold: [0, 0.36] },
    );

    observer.observe(section);

    const onSectionJumpIntent = (event: Event) => {
      const customEvent = event as CustomEvent<{
        direction: 1 | -1;
        section: HTMLElement;
      }>;

      if (customEvent.detail.section !== section) {
        return;
      }

      const { direction } = customEvent.detail;

      if (direction === 1 && stageRef.current === "ok") {
        customEvent.preventDefault();
        setSceneStage("tamilnadu");
        return;
      }

      if (direction === 1 && stageRef.current === "tamilnadu") {
        customEvent.preventDefault();
        setSceneStage("years");
        return;
      }

      if (direction === 1 && stageRef.current === "years") {
        customEvent.preventDefault();
        setSceneStage("hostelC1");
        return;
      }

      if (direction === 1 && stageRef.current === "hostelC1") {
        customEvent.preventDefault();
        setSceneStage("hostelC2");
        return;
      }

      if (direction === 1 && stageRef.current === "hostelC2") {
        customEvent.preventDefault();
        setSceneStage("hostelC3");
        return;
      }

      if (direction === -1 && stageRef.current === "hostelC3") {
        customEvent.preventDefault();
        setSceneStage("hostelC2");
        return;
      }

      if (direction === -1 && stageRef.current === "hostelC2") {
        customEvent.preventDefault();
        setSceneStage("hostelC1");
        return;
      }

      if (direction === -1 && stageRef.current === "hostelC1") {
        customEvent.preventDefault();
        setSceneStage("years");
        return;
      }

      if (direction === -1 && stageRef.current === "years") {
        customEvent.preventDefault();
        setSceneStage("tamilnadu");
      }
    };

    window.addEventListener("section-jump:intent", onSectionJumpIntent);

    return () => {
      observer.disconnect();
      window.removeEventListener("section-jump:intent", onSectionJumpIntent);
      clearSwapTimeout();
    };
  }, []);

  return (
    <section
      aria-label="Tamil adaptation proof"
      className="adaptationProof adaptationProofTimed"
      ref={sectionRef}
    >
      {stage === "ok" ? (
        <motion.h2
          animate={{
            opacity: 1,
            rotateZ: [8, -3, 1, 0],
            scale: [0.12, 1.34, 0.82, 1.08, 1],
            y: [34, -10, 5, 0],
          }}
          className="adaptationOkTitle"
          initial={{ opacity: 0, rotateZ: 8, scale: 0.12, y: 34 }}
          key="ok"
          transition={{ duration: 0.78, ease: [0.16, 1, 0.3, 1] }}
        >
          OK!
        </motion.h2>
      ) : stage.startsWith("hostel") ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="adaptationHostelScene"
          initial={{ opacity: 0 }}
          key="hostel"
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.img
            alt=""
            animate={{ opacity: 1, scale: 1, y: 0 }}
            aria-hidden="true"
            className="adaptationHostelBg adaptationHostelCloud"
            draggable={false}
            initial={{ opacity: 0, scale: 1.04, y: -26 }}
            src="/adaption/vjs%20bg1.png"
            transition={{ duration: 0.05, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.img
            alt=""
            animate={{ opacity: 1, scale: 1, y: 0 }}
            aria-hidden="true"
            className="adaptationHostelBg adaptationHostelBuilding"
            draggable={false}
            initial={{ opacity: 0, scale: 1.035, y: 22 }}
            src="/adaption/vjs%20bg2.png"
            transition={{ delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          />
          {stage === "hostelC1" ? (
            <>
              <motion.img
                alt=""
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                aria-hidden="true"
                className="adaptationHostelBg adaptationHostelC1"
                draggable={false}
                initial={{ opacity: 0, scale: 0.92, x: 72, y: 54 }}
                key="c1"
                src="/adaption/c1.png"
                transition={{ delay: 0.03, duration: 0.5, ease: [0.16, 1.08, 0.3, 1] }}
              />
              <motion.img
                alt=""
                animate={{
                  opacity: 1,
                  rotate: [-3, 1.5, 0],
                  scale: [0.82, 1.08, 1],
                  x: 0,
                }}
                aria-hidden="true"
                className="adaptationHostelBg adaptationHostelC1Cover"
                draggable={false}
                initial={{ opacity: 0, rotate: -3, scale: 0.88, x: 56 }}
                key="c1c"
                src="/adaption/c1c.png"
                transition={{ delay: 0.03, duration: 0.5, ease: [0.16, 1.12, 0.3, 1] }}
              />
            </>
          ) : null}
          {stage === "hostelC2" ? (
            <motion.img
              alt=""
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              aria-hidden="true"
              className="adaptationHostelBg adaptationHostelC2"
              draggable={false}
              initial={{ opacity: 0, scale: 1.04, x: 90, y: 24 }}
              key="c2"
              src="/adaption/c2.png"
              transition={{ duration: 0.28, ease: [0.16, 1.08, 0.3, 1] }}
            />
          ) : null}
          {stage === "hostelC3" ? (
            <motion.img
              alt=""
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              aria-hidden="true"
              className="adaptationHostelBg adaptationHostelC3"
              draggable={false}
              initial={{ opacity: 0, scale: 0.94, x: 96, y: 28 }}
              key="c3"
              src="/adaption/c3.png"
              transition={{ duration: 0.3, ease: [0.16, 1.08, 0.3, 1] }}
            />
          ) : null}
          <motion.div
            animate={{ opacity: 1, x: 0, y: 0 }}
            className={
              stage === "hostelC2"
                ? "adaptationHostelCopy adaptationHostelCopyCgi"
                : "adaptationHostelCopy"
            }
            initial={{ opacity: 0, x: -92, y: 20 }}
            key={`copy-${stage}`}
            transition={{
              delay: stage === "hostelC1" ? 1.5 : 0.08,
              duration: stage === "hostelC1" ? 0.5 : 0.22,
              ease: [0.16, 1.1, 0.3, 1],
            }}
          >
            {stage === "hostelC2" ? (
              <>
                <strong>300+ CGI</strong>
                <strong>SHOTS</strong>
                <span>300+ SHOTS REDONE</span>
                <span>IN CGI/VFX.</span>
              </>
            ) : (
              <>
                <strong>10%</strong>
                <strong>RESHOT</strong>
                <span>10% IS RESHOT USING</span>
                <span>TAMIL ACTORS.</span>
              </>
            )}
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          animate={{ opacity: 1 }}
          className="adaptationTamilScene"
          initial={{ opacity: 0 }}
          key="scene"
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            className={stage === "years" ? "adaptationTamilText isYears" : "adaptationTamilText"}
            initial={{
              opacity: 0,
              scale: stage === "years" ? 0.9 : 0.96,
              y: stage === "years" ? 34 : 30,
              filter: "blur(10px)",
            }}
            key={stage}
            transition={{
              delay: stage === "years" ? 0.12 : 0,
              duration: stage === "years" ? 0.48 : 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <motion.span
              animate={{ opacity: 1, y: 0 }}
              className="adaptationTamilTextWhite"
              initial={{ opacity: 0, y: 22 }}
              transition={{ delay: 0.05, duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
            >
              {stage === "years" ? (
                "THAT TOO AFTER"
              ) : (
                <>
                  BUT
                  <br />
                  WHY IN
                  <br />
                  TAMIL
                </>
              )}
            </motion.span>
            <motion.span
              animate={{ opacity: 1, y: 0 }}
              className="adaptationTamilTextGold"
              initial={{ opacity: 0, y: 28 }}
              transition={{ delay: 0.16, duration: 0.54, ease: [0.16, 1, 0.3, 1] }}
            >
              {stage === "years" ? "3 YEARS" : "NADU"}
            </motion.span>
          </motion.div>
          <motion.img
            alt=""
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              filter: "blur(0px) brightness(1)",
            }}
            aria-hidden="true"
            className={
              stage === "years"
                ? "adaptationTamilImage adaptationTamilImageWhyOne"
                : "adaptationTamilImage adaptationTamilImageWhyBase"
            }
            draggable={false}
            initial={{
              opacity: 0,
              scale: stage === "years" ? 1.18 : 1.04,
              y: stage === "years" ? 18 : 96,
              filter: "blur(14px) brightness(1.2)",
            }}
            key="why1-plate"
            src="/adaption/why1.png"
            transition={{
              delay: stage === "years" ? 0 : 0.04,
              duration: stage === "years" ? 0.95 : 0.88,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
          {stage === "years" ? (
            <motion.img
              alt=""
              animate={{
                opacity: 1,
                rotate: 0,
                scale: 1,
                y: 0,
              }}
              aria-hidden="true"
              className="adaptationYearsWarden"
              draggable={false}
              initial={{
                opacity: 0,
                rotate: -2,
                scale: 0.9,
                y: 130,
              }}
              src="/adaption/warden.png"
              transition={{
                delay: 0.08,
                duration: 0.52,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          ) : null}
        </motion.div>
      )}
    </section>
  );
}
