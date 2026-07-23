"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";

const questions = ["OK ....", "But why in TAMIL NADU ?", "After 3 years ???"];

const cards = [
  {
    kicker: "Audience",
    title: "Tamil Nadu Pull",
    body: "Tamil Nadu has more 18-35 greater than Karnataka and Telangana.",
    layoutClass: "adaptationReasonCardLead",
  },
  {
    kicker: "Localization",
    title: "10% Reshot",
    body: "10% is reshot using Tamil actors.",
    layoutClass: "adaptationReasonCardMiddle",
  },
  {
    kicker: "Craft",
    title: "300 CGI Shots",
    body: "300 shots redone in CGI.",
    layoutClass: "adaptationReasonCardBottom",
  },
];

export default function AdaptationProof() {
  const sectionRef = useRef<HTMLElement>(null);
  const questionControls = useAnimation();
  const cardControls = useAnimation();
  const phaseRef = useRef(0);
  const isSteppingRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const resetAnimation = () => {
      phaseRef.current = 0;
      isSteppingRef.current = false;
      questionControls.set("hidden");
      cardControls.set("hidden");
    };

    const lockAdaptationView = () => {
      window.scrollTo({
        top: section.offsetTop,
        behavior: "auto",
      });
    };

    const adaptationIsPinned = () => {
      const rect = section.getBoundingClientRect();
      return rect.top <= 2 && rect.bottom >= window.innerHeight - 2;
    };

    const showCards = () => {
      if (isSteppingRef.current) {
        return;
      }

      isSteppingRef.current = true;
      phaseRef.current = 1;
      lockAdaptationView();
      void cardControls.start("show");

      window.setTimeout(() => {
        isSteppingRef.current = false;
      }, 860);
    };

    const hideCards = () => {
      if (isSteppingRef.current) {
        return;
      }

      isSteppingRef.current = true;
      phaseRef.current = 0;
      lockAdaptationView();
      cardControls.set("hidden");

      window.setTimeout(() => {
        isSteppingRef.current = false;
      }, 360);
    };

    const onSectionJumpIntent = (event: Event) => {
      const customEvent = event as CustomEvent<{
        direction: 1 | -1;
        section: HTMLElement;
      }>;

      if (customEvent.detail.section !== section || !adaptationIsPinned()) {
        return;
      }

      const { direction } = customEvent.detail;
      const canShowCards = direction === 1 && phaseRef.current === 0;
      const canHideCards = direction === -1 && phaseRef.current === 1;

      if (!canShowCards && !canHideCards) {
        return;
      }

      customEvent.preventDefault();

      if (canShowCards) {
        showCards();
        return;
      }

      hideCards();
    };

    resetAnimation();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.36) {
          resetAnimation();
          void questionControls.start("show");
          return;
        }

        resetAnimation();
      },
      { threshold: [0, 0.36] },
    );

    observer.observe(section);
    window.addEventListener("section-jump:intent", onSectionJumpIntent);

    return () => {
      observer.disconnect();
      window.removeEventListener("section-jump:intent", onSectionJumpIntent);
    };
  }, [cardControls, questionControls]);

  return (
    <motion.section
      className="adaptationProof"
      aria-label="Tamil adaptation proof"
      ref={sectionRef}
    >
      <div className="adaptationProofShell">
        <div className="adaptationQuestionDeck">
          <div className="adaptationQuestionStack">
            {questions.map((question, lineIndex) => (
              <motion.span
                animate={questionControls}
                className={`adaptationTypedLine ${lineIndex === 1 ? "isGold" : ""}`}
                initial="hidden"
                key={question}
                transition={{
                  delay: lineIndex * 1,
                  duration: 0.32,
                  ease: [0.16, 1, 0.3, 1],
                }}
                variants={{
                  hidden: { opacity: 0, x: -22 },
                  show: { opacity: 1, x: 0 },
                }}
              >
                {question.split(" ").map((word, wordIndex) => (
                  <motion.span
                    className="adaptationTypedWord"
                    key={`${question}-${word}-${wordIndex}`}
                    transition={{
                      delay: lineIndex * 1 + wordIndex * 0.08,
                      duration: 0.38,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    variants={{
                      hidden: { opacity: 0, y: 20, clipPath: "inset(0% 100% 0% 0%)" },
                      show: { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" },
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
                <motion.i
                  className="adaptationTypeCursor"
                  transition={{
                    delay: lineIndex * 1,
                    duration: 0.86,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  variants={{
                    hidden: { opacity: 0, scaleX: 0 },
                    show: { opacity: [0, 1, 1, 0], scaleX: [0, 1, 1, 0.08] },
                  }}
                />
              </motion.span>
            ))}
          </div>
        </div>

        <div className="adaptationCardBoard" aria-label="Adaptation proof cards">
          {cards.map((card, index) => (
            <motion.article
              animate={cardControls}
              className={`adaptationReasonCard ${card.layoutClass}`}
              initial="hidden"
              key={card.title}
              transition={{
                delay: index * 0.15,
                duration: 0.76,
                ease: [0.14, 1.15, 0.28, 1],
              }}
              variants={{
                hidden: {
                  opacity: 0,
                  x: 220,
                  y: 74,
                  rotateY: -24,
                  rotateZ: index % 2 === 0 ? 7 : -7,
                  scale: 0.92,
                  filter: "blur(14px)",
                },
                show: {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  rotateY: 0,
                  rotateZ: 0,
                  scale: 1,
                  filter: "blur(0px)",
                },
              }}
            >
              <span>{card.kicker}</span>
              <strong>{card.title}</strong>
              <motion.p
                transition={{
                  delay: 0.3 + index * 0.15,
                  duration: 0.48,
                  ease: [0.16, 1, 0.3, 1],
                }}
                variants={{
                  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
                  show: { opacity: 1, y: 0, filter: "blur(0px)" },
                }}
              >
                {card.body}
              </motion.p>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
