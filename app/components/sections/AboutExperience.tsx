"use client";

import { useEffect, useRef, useState } from "react";

const infrastructureCards = [
  {
    label: "EVP Film City",
    src: "/about/slide0/img1.png",
  },
  {
    label: "Adityaram Film City",
    src: "/about/slide0/img2.png",
  },
  {
    label: "Sundar Studios",
    src: "/about/slide0/img3.png",
  },
];

const theatricalPosters = [
  { alt: "Bomb theatrical poster", src: "/about/slide2/img1.png" },
  { alt: "Madame Web theatrical poster", src: "/about/slide2/img2.png" },
  { alt: "Tumbbad theatrical poster", src: "/about/slide2/img3.png" },
  { alt: "Bottle Radha theatrical poster", src: "/about/slide2/img4.png" },
  { alt: "Kadaisi Ulaga Por theatrical poster", src: "/about/slide2/img5.png" },
  { alt: "Thangalaan theatrical poster", src: "/about/slide2/img6.png" },
  { alt: "Yolo theatrical poster", src: "/about/slide2/img7.png" },
  { alt: "Kumara Sambhavam theatrical poster", src: "/about/slide2/img8.png" },
];

const aboutPhaseClassNames = [
  "aboutStepWho",
  "aboutStepInfrastructure",
  "aboutStepIndustry",
  "aboutStepTheatrical",
];

export default function AboutExperience() {
  const [isVisible, setIsVisible] = useState(false);
  const [phase, setPhase] = useState(0);
  const phaseRef = useRef(0);
  const sectionRef = useRef<HTMLElement>(null);
  const isSteppingRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    let wasVisible = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const nextIsVisible = entry.isIntersecting;
        setIsVisible(nextIsVisible);

        // Leaving the section (in either direction) resets the internal
        // slide so re-entering later always starts from "Who We Are".
        if (wasVisible && !nextIsVisible && phaseRef.current !== 0) {
          phaseRef.current = 0;
          setPhase(0);
        }

        wasVisible = nextIsVisible;
      },
      { threshold: 0 }
    );

    observer.observe(section);

    // Correct alignment only once scrolling has actually settled (not
    // while a smooth-scroll handoff is still animating — checking mid-flight
    // races with it and can leave the page a bit short/long, e.g. a sliver
    // of the next section peeking in). `scrollend` fires once per scroll
    // gesture, so this can run at most once per stop; a single corrective
    // `scrollTo` here can't loop (the next 'scrollend' it causes will find
    // the section already aligned and do nothing).
    const snapToTopIfDominant = () => {
      const rect = section.getBoundingClientRect();
      const isDominant = rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5;
      const drift = Math.abs(rect.top);

      if (!isDominant || drift <= 2 || drift > window.innerHeight * 0.5) {
        return;
      }

      // A small drift (a few px to maybe a couple dozen) reads as a jarring
      // teleport if snapped instantly. Animate it as a quick, smooth micro
      // -adjustment instead — short enough to feel like the scroll just
      // finishing its settle, not a separate visible correction.
      window.scrollTo({
        top: section.offsetTop,
        behavior: drift <= 24 ? "smooth" : "auto",
      });
    };

    let debounceTimer: number | null = null;
    const onScrollSettleFallback = () => {
      if (debounceTimer !== null) {
        window.clearTimeout(debounceTimer);
      }

      debounceTimer = window.setTimeout(snapToTopIfDominant, 60);
    };

    const supportsScrollEnd = "onscrollend" in window;

    if (supportsScrollEnd) {
      window.addEventListener("scrollend", snapToTopIfDominant);
    } else {
      window.addEventListener("scroll", onScrollSettleFallback, { passive: true });
    }

    return () => {
      observer.disconnect();

      if (supportsScrollEnd) {
        window.removeEventListener("scrollend", snapToTopIfDominant);
      } else {
        window.removeEventListener("scroll", onScrollSettleFallback);
      }

      if (debounceTimer !== null) {
        window.clearTimeout(debounceTimer);
      }
    };
  }, []);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    const maxPhase = aboutPhaseClassNames.length - 1;

    const setAboutPhase = (nextPhase: number) => {
      const normalizedPhase = Math.max(0, Math.min(maxPhase, nextPhase));
      phaseRef.current = normalizedPhase;
      setPhase(normalizedPhase);
    };

    const lockAboutView = () => {
      const section = sectionRef.current;

      if (!section) {
        return;
      }

      window.scrollTo({
        top: section.offsetTop,
        behavior: "auto",
      });
    };

    const aboutIsPinned = () => {
      const section = sectionRef.current;

      if (!section) {
        return false;
      }

      const rect = section.getBoundingClientRect();
      return rect.top <= 2 && rect.bottom >= window.innerHeight - 2;
    };

    const aboutIsInLockZone = () => {
      const section = sectionRef.current;

      if (!section) {
        return false;
      }

      const rect = section.getBoundingClientRect();
      return rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.55;
    };

    const stepPhase = (direction: 1 | -1) => {
      if (isSteppingRef.current) {
        return;
      }

      isSteppingRef.current = true;
      lockAboutView();
      setAboutPhase(phaseRef.current + direction);

      window.setTimeout(() => {
        isSteppingRef.current = false;
      }, 760);
    };

    const onSectionJumpIntent = (event: Event) => {
      const customEvent = event as CustomEvent<{
        direction: 1 | -1;
        section: HTMLElement;
      }>;

      if (customEvent.detail.section !== sectionRef.current || !aboutIsPinned()) {
        return;
      }

      const { direction } = customEvent.detail;
      const canStepForward = direction === 1 && phaseRef.current < maxPhase;
      const canStepBackward = direction === -1 && phaseRef.current > 0;

      if (!canStepForward && !canStepBackward) {
        return;
      }

      customEvent.preventDefault();
      stepPhase(direction);
    };

    const onWheel = (event: WheelEvent) => {
      if (!aboutIsInLockZone() || Math.abs(event.deltaY) < 8) {
        return;
      }

      const isForward = event.deltaY > 0;
      const canStepForward = isForward && phaseRef.current < maxPhase;
      const canStepBackward = !isForward && phaseRef.current > 0;

      if (!aboutIsPinned() && (canStepForward || canStepBackward)) {
        event.preventDefault();
        lockAboutView();
        return;
      }

      if (canStepForward || canStepBackward) {
        event.preventDefault();
        stepPhase(isForward ? 1 : -1);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!aboutIsInLockZone()) {
        return;
      }

      const forwardKeys = ["ArrowDown", "PageDown", " ", "Spacebar"];
      const backwardKeys = ["ArrowUp", "PageUp"];
      const isForward = forwardKeys.includes(event.key) || forwardKeys.includes(event.code);
      const isBackward = backwardKeys.includes(event.key) || backwardKeys.includes(event.code);
      const canStepForward = isForward && phaseRef.current < maxPhase;
      const canStepBackward = isBackward && phaseRef.current > 0;

      if (!aboutIsPinned() && (canStepForward || canStepBackward)) {
        event.preventDefault();
        event.stopPropagation();
        lockAboutView();
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
    <section
      className={[
        "aboutExperience",
        isVisible ? "isVisible" : "",
        aboutPhaseClassNames[phase],
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="About GENEROUS Entertainments"
      ref={sectionRef}
    >
      <div className="aboutInfrastructureSlide" aria-hidden={phase !== 1}>
        <div className="aboutInfrastructureCopy">
          <h2>Infrastructure Experience</h2>
          <p>From studios to film cities, we operate at industry scale.</p>
          <p>
            We have developed, operated and managed large-scale production infrastructure
            across Tamil Nadu, including:
          </p>
        </div>

        <div className="aboutInfrastructureCards" aria-label="Production infrastructure assets">
          {infrastructureCards.map((card) => (
            <figure className="aboutInfrastructureCard" key={card.src}>
              <img alt={card.label} draggable={false} src={card.src} />
              <figcaption>{card.label}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="aboutIndustrySlide" aria-hidden={phase !== 2}>
        <div className="aboutIndustryBackdrop" />
        <div className="aboutIndustryHeader">
          <h2>Industry Experience</h2>
          <p>Major Broadcasting Partners</p>
        </div>

        <div className="aboutPartnerPanel aboutBroadcastPanel">
          <img
            alt="Major broadcasting partners"
            draggable={false}
            src="/about/slide1/broadcast.png"
          />
        </div>

        <h3 className="aboutProductionTitle">Production Houses Served</h3>

        <div className="aboutPartnerPanel aboutProductionPanel">
          <img
            alt="Production houses served"
            draggable={false}
            src="/about/slide1/production.png"
          />
        </div>
      </div>

      <div className="aboutTheatricalSlide" aria-hidden={phase !== 3}>
        <h2 className="aboutTheatricalTitle">Theatrical Distribution</h2>
        <div className="aboutTheatricalGrid" aria-label="Theatrical distribution titles">
          {theatricalPosters.map((poster) => (
            <figure className="aboutTheatricalPoster" key={poster.src}>
              <img alt={poster.alt} draggable={false} src={poster.src} />
            </figure>
          ))}
        </div>
      </div>

      <div className="aboutWhoSlide" aria-hidden={phase !== 0}>
        <h2 className="aboutWhoTitle" id="about-heading">
          Who We Are
        </h2>

        <div className="aboutCenterBlock">
          <img
            alt="GENEROUS Entertainments"
            className="aboutLogo"
            draggable={false}
            src="/about/generous.png"
          />
          <div className="aboutCopyBlock">
            <p>Built inside Tamil Nadu&rsquo;s entertainment ecosystem since 2015.</p>
            <p>
              Chennai-based media and production services company with experience across
              film, television, studio infrastructure, broadcast support and theatrical
              distribution.
            </p>
          </div>
        </div>

        <div
          className="aboutStatsRow"
          aria-label="160+ Film Production Facilitation. 55+ Television Programmes. 360 degree Entertainment Operations."
        >
          <div className="aboutStat">
            <strong>160+</strong>
            <span>
              Film Production
              <br />
              Facilitation
            </span>
          </div>
          <div className="aboutStat">
            <strong>55+</strong>
            <span>
              Television
              <br />
              Programmes
            </span>
          </div>
          <div className="aboutStat">
            <strong>360°</strong>
            <span>
              Entertainment
              <br />
              Operations
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
