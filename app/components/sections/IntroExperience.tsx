"use client";

import { gsap } from "gsap";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function segment(value: number, start: number, end: number) {
  return clamp((value - start) / (end - start), 0, 1);
}

export default function IntroExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const backgroundXTo = useRef<((value: number) => void) | null>(null);
  const progressTweenRef = useRef<gsap.core.Tween | null>(null);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    const background = backgroundRef.current;

    if (background) {
      gsap.set(background, { xPercent: 0 });
      backgroundXTo.current = gsap.quickTo(background, "xPercent", {
        duration: 0.8,
        ease: "power3.out",
      });
    }

    const updateProgress = (nextProgress: number) => {
      const clampedProgress = clamp(nextProgress, 0, 1);
      progressRef.current = clampedProgress;
      setProgress(clampedProgress);
      backgroundXTo.current?.(clampedProgress * -10);
    };

    const animateProgressTo = (targetProgress: number) => {
      if (isAnimatingRef.current) {
        return;
      }

      const clampedTarget = clamp(targetProgress, 0, 1);

      if (progressRef.current === clampedTarget) {
        return;
      }

      isAnimatingRef.current = true;
      progressTweenRef.current?.kill();
      progressTweenRef.current = gsap.to(progressRef, {
        current: clampedTarget,
        duration: 3,
        ease: "none",
        onUpdate: () => updateProgress(progressRef.current),
        onComplete: () => {
          updateProgress(clampedTarget);
          isAnimatingRef.current = false;
          progressTweenRef.current = null;
        },
      });
    };

    const introIsActive = () => {
      const section = sectionRef.current;

      if (!section) {
        return false;
      }

      const rect = section.getBoundingClientRect();
      return rect.top <= 1 && rect.bottom >= window.innerHeight - 1;
    };

    const lockIntroView = () => {
      const section = sectionRef.current;

      if (!section) {
        return;
      }

      window.scrollTo({
        top: section.offsetTop,
        behavior: "auto",
      });
    };

    const scrollToNextSection = () => {
      const section = sectionRef.current;
      const nextSection = section?.nextElementSibling as HTMLElement | null;

      if (!nextSection) {
        return;
      }

      window.scrollTo({
        top: nextSection.offsetTop,
        behavior: "smooth",
      });
    };

    const nextSectionIsActive = () => {
      const section = sectionRef.current;
      const nextSection = section?.nextElementSibling as HTMLElement | null;

      if (!nextSection) {
        return false;
      }

      const rect = nextSection.getBoundingClientRect();
      return rect.top <= 1 && rect.bottom >= window.innerHeight - 1;
    };

    const scrollToIntroEndFrame = () => {
      const section = sectionRef.current;

      if (!section) {
        return;
      }

      progressTweenRef.current?.kill();
      progressTweenRef.current = null;
      isAnimatingRef.current = false;
      updateProgress(1);
      window.scrollTo({
        top: section.offsetTop,
        behavior: "smooth",
      });
    };

    const onWheel = (event: WheelEvent) => {
      if (!introIsActive()) {
        if (event.deltaY < 0 && nextSectionIsActive()) {
          event.preventDefault();
          scrollToIntroEndFrame();
        }

        return;
      }

      if (isAnimatingRef.current) {
        event.preventDefault();
        lockIntroView();
        return;
      }

      if (event.deltaY > 0 && progressRef.current >= 1) {
        event.preventDefault();
        scrollToNextSection();
        return;
      }

      if (event.deltaY > 0 && progressRef.current < 1) {
        event.preventDefault();
        lockIntroView();
        animateProgressTo(1);
        return;
      }

      if (event.deltaY < 0 && progressRef.current > 0 && window.scrollY <= 2) {
        event.preventDefault();
        lockIntroView();
        animateProgressTo(0);
        return;
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const section = sectionRef.current;

      if (!section) {
        return;
      }

      const forwardKeys = ["ArrowDown", "PageDown", " ", "Spacebar"];
      const backwardKeys = ["ArrowUp", "PageUp"];
      const isForwardKey = forwardKeys.includes(event.key) || forwardKeys.includes(event.code);
      const isBackwardKey = backwardKeys.includes(event.key) || backwardKeys.includes(event.code);
      const rect = section.getBoundingClientRect();
      const introIsVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (isAnimatingRef.current && (isForwardKey || isBackwardKey) && introIsVisible) {
        event.preventDefault();
        event.stopPropagation();
        lockIntroView();
        return;
      }

      if (isBackwardKey && nextSectionIsActive()) {
        event.preventDefault();
        event.stopPropagation();
        scrollToIntroEndFrame();
        return;
      }

      if (isForwardKey && progressRef.current < 1 && introIsVisible) {
        event.preventDefault();
        event.stopPropagation();
        lockIntroView();
        animateProgressTo(1);
        return;
      }

      if (isForwardKey && progressRef.current >= 1 && introIsActive()) {
        event.preventDefault();
        event.stopPropagation();
        scrollToNextSection();
        return;
      }

      if (isBackwardKey && progressRef.current > 0 && introIsActive()) {
        event.preventDefault();
        event.stopPropagation();
        lockIntroView();
        animateProgressTo(0);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    document.addEventListener("keydown", onKeyDown, { capture: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      document.removeEventListener("keydown", onKeyDown, { capture: true });
      backgroundXTo.current = null;
      progressTweenRef.current?.kill();
      progressTweenRef.current = null;
      isAnimatingRef.current = false;

      if (background) {
        gsap.killTweensOf(background);
      }
    };
  }, []);

  const introProgress = segment(progress, 0, 1);

  const runnerProgress = 1 - Math.pow(1 - introProgress, 1.35);
  const titleRevealProgress = segment(runnerProgress, 0.4, 0.62);
  const roadRevealProgress = segment(runnerProgress, 0.4, 0.64);

  const logoStyle = {
    opacity: 1,
    transform: `translate3d(-50%, ${titleRevealProgress * -54}px, 0) scale(${1 - titleRevealProgress * 0.30})`,
  } satisfies CSSProperties;

  const roadTitleStyle = {
    opacity: roadRevealProgress,
    transform: `translate3d(-50%, ${28 - roadRevealProgress * 28}px, 0) scale(${0.88 + roadRevealProgress * 0.12})`,
  } satisfies CSSProperties;

  const runnerStyle = {
    transform: `translate3d(${runnerProgress * 116}vw, ${runnerProgress * -4}px, 0)`,
  } satisfies CSSProperties;

  return (
    <section
      className="relative h-screen overflow-hidden bg-ink"
      ref={sectionRef}
      aria-label="Generous intro"
    >
      <div className="relative isolate grid h-screen place-items-center overflow-hidden bg-ink">
        <div
          ref={backgroundRef}
          className="pointer-events-none absolute inset-y-0 left-[-12vw] z-0 h-full w-[124vw] select-none will-change-transform"
          aria-hidden="true"
        >
          <img
            className="block h-full w-full select-none object-cover object-bottom"
            src="/intro/master-bg.png"
            alt=""
            draggable={false}
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(0,0,0,0.16),rgba(0,0,0,0.34))]"
          aria-hidden="true"
        />
        <div
          className="absolute left-1/2 top-[clamp(88px,13vh,136px)] z-[4] grid w-[min(590px,66vw)] place-items-center transition-[transform,opacity] duration-500 ease-out will-change-[transform,opacity] max-[640px]:top-[82px] max-[640px]:w-[min(330px,72vw)]"
          style={logoStyle}
        >
          <img
            className="block h-auto w-full max-w-[630px] select-none"
            src="/logo.svg"
            alt="GENEROUS Entertainments"
            draggable={false}
          />
        </div>
        <img
          className="pointer-events-none absolute left-1/2 top-[clamp(268px,35.5vh,352px)] z-[3] block h-auto w-[min(1040px,82vw)] select-none transition-[transform,opacity,filter] duration-500 ease-out will-change-[transform,opacity] [filter:drop-shadow(0_18px_22px_rgba(0,0,0,0.42))] max-[640px]:top-[clamp(240px,36.5vh,306px)] max-[640px]:w-[min(520px,88vw)]"
          src="/intro/road.svg"
          alt="Road to making history with the worst film ever made"
          draggable={false}
          style={roadTitleStyle}
        />
        <img
          className="pointer-events-none absolute bottom-[clamp(0px,1.8vh,18px)] left-[-44vw] z-[2] block h-auto w-[clamp(390px,40vw,700px)] select-none transition-transform duration-300 ease-out will-change-transform max-[640px]:bottom-0 max-[640px]:left-[-102vw] scale-[1.5] max-[640px]:w-[clamp(360px,92vw,520px)]"
          src="/intro/run.gif"
          alt=""
          aria-hidden="true"
          draggable={false}
          style={runnerStyle}
        />
      </div>
    </section>
  );
}
