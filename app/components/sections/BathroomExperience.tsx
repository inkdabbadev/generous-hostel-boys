"use client";

import { useEffect, useRef, useState } from "react";

export default function BathroomExperience() {
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
      id="bathroom"
      ref={sectionRef}
      className={`bathroomExperience relative min-h-screen overflow-hidden bg-ink bg-[url('/bathroom/bg.png')] bg-cover bg-center bg-no-repeat${
        isVisible ? " isVisible" : ""
      }`}
      aria-label="Bathroom"
    >
      <img
        className="bathroomDrag pointer-events-none absolute bottom-0 left-0 z-[4] block h-auto w-[clamp(calc(1040*var(--u)),112vw,calc(1980*var(--u)))] select-none max-[640px]:w-[clamp(calc(920*var(--u)),255vw,calc(1620*var(--u)))]"
        src="/bathroom/Drag-gif.gif"
        alt=""
        aria-hidden="true"
        draggable={false}
      />
      <img
        className="bathroomText bathroomTextOne pointer-events-none absolute left-1/2 top-[clamp(calc(74*var(--u)),13vh,calc(148*var(--u)))] z-[2] block w-[min(calc(1435*var(--u)),136.5vw)] select-none"
        src="/bathroom/t1.svg"
        alt=""
        aria-hidden="true"
        draggable={false}
      />
      <img
        className="bathroomText bathroomTextTwo pointer-events-none absolute left-1/2 top-[clamp(calc(126*var(--u)),22vh,calc(252*var(--u)))] z-[2] block w-[min(calc(1365*var(--u)),129.5vw)] select-none"
        src="/bathroom/t2.svg"
        alt=""
        aria-hidden="true"
        draggable={false}
      />
      <img
        className="bathroomText bathroomTextThree pointer-events-none absolute left-1/2 top-[clamp(calc(176*var(--u)),31.5vh,calc(364*var(--u)))] z-[2] block w-[min(calc(900*var(--u)),82vw)] select-none"
        src="/bathroom/t3.svg"
        alt=""
        aria-hidden="true"
        draggable={false}
      />
    </section>
  );
}
