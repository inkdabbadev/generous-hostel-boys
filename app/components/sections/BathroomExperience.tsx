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
        className="bathroomDrag pointer-events-none absolute bottom-0 left-0 z-[1] block h-auto w-[clamp(660px,72vw,1290px)] select-none max-[640px]:w-[clamp(585px,165vw,1020px)]"
        src="/bathroom/Drag-gif.gif"
        alt=""
        aria-hidden="true"
        draggable={false}
      />
      <img
        className="bathroomText bathroomTextOne pointer-events-none absolute left-1/2 top-[clamp(74px,13vh,148px)] z-[2] block w-[min(1435px,136.5vw)] select-none"
        src="/bathroom/t1.svg"
        alt=""
        aria-hidden="true"
        draggable={false}
      />
      <img
        className="bathroomText bathroomTextTwo pointer-events-none absolute left-1/2 top-[clamp(126px,22vh,252px)] z-[2] block w-[min(1365px,129.5vw)] select-none"
        src="/bathroom/t2.svg"
        alt=""
        aria-hidden="true"
        draggable={false}
      />
      <img
        className="bathroomText bathroomTextThree pointer-events-none absolute left-1/2 top-[clamp(176px,31.5vh,364px)] z-[2] block w-[min(900px,82vw)] select-none"
        src="/bathroom/t3.svg"
        alt=""
        aria-hidden="true"
        draggable={false}
      />
    </section>
  );
}
