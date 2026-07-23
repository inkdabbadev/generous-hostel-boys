"use client";

import { useEffect, useRef, useState } from "react";

export default function SponsorshipExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting && entry.intersectionRatio >= 0.55);
      },
      { threshold: [0, 0.55] },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="sposership"
      ref={sectionRef}
      className={`sponsorshipExperience relative min-h-screen overflow-hidden bg-ink bg-[url('/sponsership/bg.png')] bg-cover bg-center bg-no-repeat${
        isVisible ? " isVisible" : ""
      }`}
      aria-label="Sposership"
    >
      <img
        className="sponsorshipText pointer-events-none absolute left-1/2 top-[clamp(102px,18vh,216px)] z-[3] block w-[min(980px,82vw)] select-none"
        src="/sponsership/text.svg"
        alt=""
        aria-hidden="true"
        draggable={false}
      />
      <img
        className="sponsorshipEcho pointer-events-none absolute bottom-[clamp(0px,1.8vh,18px)] left-0 z-[1] block h-auto w-[clamp(580px,64vw,1120px)] select-none max-[640px]:bottom-0 max-[640px]:w-[clamp(560px,156vw,940px)]"
        src="/sponsership/echo-with-echo.gif"
        alt=""
        aria-hidden="true"
        draggable={false}
      />
      <img
        className="pointer-events-none absolute bottom-0 left-1/2 z-[2] block w-full max-w-none -translate-x-1/2 select-none"
        src="/sponsership/fg.png"
        alt=""
        aria-hidden="true"
        draggable={false}
      />
    </section>
  );
}
