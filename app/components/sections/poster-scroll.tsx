"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

const SLIDES = [
  {
    variant: "headline" as const,
    lines: ["EVERY PROPOSAL", "LOOK THE SAME."],
  },
  {
    variant: "body" as const,
    lines: [
      "Logo Placement. Product Placement.",
      "Co-Branded Posters. A Few Posts.",
      "Then The Brand Is Forgotten.",
    ],
  },
];

export default function ScrollHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const arrivalFrameRef = useRef<number | null>(null);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const textNodes = textRefs.current.filter(Boolean);

    if (!section || !video) {
      return;
    }

    const resetText = () => {
      gsap.set(textNodes, {
        y: "60vh",
        opacity: 0,
        scale: 0.92,
        filter: "blur(10px)",
      });
    };

    const resetScene = () => {
      hasPlayedRef.current = false;
      timelineRef.current?.kill();
      timelineRef.current = null;
      video.pause();
      video.currentTime = 0;
      resetText();
    };

    const playScene = () => {
      timelineRef.current?.kill();
      hasPlayedRef.current = true;
      resetText();

      video.pause();
      video.currentTime = 0;
      void video.play().catch(() => undefined);

      const timeline = gsap.timeline();

      SLIDES.forEach((_, index) => {
        const element = textRefs.current[index];

        if (!element) {
          return;
        }

        timeline.fromTo(
          element,
          { y: "60vh", opacity: 0, scale: 0.92, filter: "blur(10px)" },
          {
            y: "0vh",
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "back.out(1.35)",
          },
          index === 0 ? 0.35 : "-=0.35",
        );

        timeline.to({}, { duration: index === 0 ? 1.9 : 1.3 });

        if (index < SLIDES.length - 1) {
          timeline.to(element, {
            y: "-34vh",
            opacity: 0,
            scale: 0.96,
            filter: "blur(6px)",
            duration: 0.75,
            ease: "power1.in",
          });
        }
      });

      timelineRef.current = timeline;
    };

    resetText();
    video.pause();

    const playWhenArrived = () => {
      resetScene();

      const waitForArrival = () => {
        const rect = section.getBoundingClientRect();
        const isActive = Math.abs(rect.top) <= 2 && rect.bottom >= window.innerHeight - 1;

        if (isActive) {
          playScene();
          arrivalFrameRef.current = null;
          return;
        }

        arrivalFrameRef.current = requestAnimationFrame(waitForArrival);
      };

      if (arrivalFrameRef.current !== null) {
        cancelAnimationFrame(arrivalFrameRef.current);
      }

      arrivalFrameRef.current = requestAnimationFrame(waitForArrival);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.55 && !hasPlayedRef.current) {
          playScene();
        }

        if (!entry.isIntersecting) {
          resetScene();
        }
      },
      { threshold: [0, 0.55] },
    );

    observer.observe(section);
    window.addEventListener("poster-scroll:replay-on-arrival", playWhenArrived);

    return () => {
      if (arrivalFrameRef.current !== null) {
        cancelAnimationFrame(arrivalFrameRef.current);
      }

      observer.disconnect();
      window.removeEventListener("poster-scroll:replay-on-arrival", playWhenArrived);
      timelineRef.current?.kill();
      video.pause();
    };
  }, []);

  return (
    <section
      id="third-section"
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-black"
      aria-label="Poster proposal section"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/poster/bg.mp4"
        muted
        playsInline
        preload="auto"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/40" />

      {SLIDES.map((slide, index) => (
        <div
          key={slide.lines.join("|")}
          className="absolute inset-x-0 bottom-[16%] flex justify-center px-6"
        >
          <div
            ref={(node) => {
              textRefs.current[index] = node;
            }}
            className="text-center"
          >
            {slide.variant === "headline" ? (
              <h1 className="font-figtree">
                <span
                  className="block font-black text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
                  style={{
                    fontSize: "4.7844vw",
                    lineHeight: 1.029,
                    letterSpacing: 0,
                  }}
                >
                  {slide.lines[0]}
                </span>
                <span
                  className="block font-black text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
                  style={{
                    fontSize: "7.21875vw",
                    lineHeight: 1.029,
                    letterSpacing: 0,
                  }}
                >
                  {slide.lines[1]}
                </span>
              </h1>
            ) : (
              <p
                className="font-figtree mx-auto font-medium text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
                style={{
                  fontSize: "3.137vw",
                  lineHeight: 1.029,
                  letterSpacing: 0,
                  width: "52vw",
                }}
              >
                {slide.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
