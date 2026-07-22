"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

const presents = "PRESENTS";
function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function segment(value: number, start: number, end: number) {
  return clamp((value - start) / (end - start), 0, 1);
}

export default function IntroExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      const section = sectionRef.current;

      if (!section) {
        return;
      }

      const rect = section.getBoundingClientRect();
      const distance = Math.max(rect.height - window.innerHeight, 1);
      setProgress(clamp(-rect.top / distance, 0, 1));
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const introProgress = segment(progress, 0, 1);

  const logoStyle = {
    opacity: 1 - introProgress,
    transform: `translate3d(-50%, ${introProgress * -140}px, 0) scale(${1 - introProgress * 0.18})`,
  } satisfies CSSProperties;

  const presentsStyle = {
    opacity: 1 - introProgress,
    transform: `translate3d(0, ${introProgress * -70}px, 0) scale(${1 - introProgress * 0.05})`,
  } satisfies CSSProperties;

  return (
    <section className="introExperience" ref={sectionRef} aria-label="Generous presents">
      <div className="introStage">
        <div className="introMark" style={logoStyle}>
          <img src="/GENEROUS%20Logo.png" alt="GENEROUS Entertainments" draggable={false} />
        </div>
        <div className="presentsText" style={presentsStyle} aria-label="Presents">
          {presents.split("").map((letter, index) => (
            <span key={`${letter}-${index}`}>{letter}</span>
          ))}
        </div>
        <p className="introTagline" style={presentsStyle}>
          <span>Road to making history with the worst film ever made</span>
        </p>
      </div>
    </section>
  );
}
