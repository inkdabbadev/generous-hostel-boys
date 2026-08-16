"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const THANK_YOU_BG = "/thankyou/car%20bg.png";
const THANK_YOU_VAN = "/thankyou/van3.gif";

const thankYouControls = {
  bg: {
    scale: "1.01",
    position: "center",
  },
  text: {
    color: "#ffc400",
    desktopSize: "clamp(4.2rem, 10.6vw, 12rem)",
    mobileSize: "clamp(3rem, 14vw, 5.5rem)",
    desktopTop: "40vh",
    mobileTop: "12vh",
    entranceDelay: "7.1s",
    entranceDuration: "1.45s",
  },
  van: {
    desktopWidth: "clamp(calc(540*var(--u)), 48vw, calc(980*var(--u)))",
    mobileWidth: "clamp(calc(360*var(--u)), 92vw, calc(620*var(--u)))",
    desktopBottom: "clamp(1.1rem, 3.2vh, 2.7rem)",
    mobileBottom: "3vh",
    duration: "9s",
    startOffset: "7vw",
    endOffset: "9vw",
  },
};

type CSSVariableStyle = CSSProperties & {
  [key: `--${string}`]: string;
};

export default function ThankYou() {
  const sectionRef = useRef<HTMLElement>(null);
  const [playKey, setPlayKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const sectionStyle: CSSVariableStyle = {
    "--thank-bg-position": thankYouControls.bg.position,
    "--thank-bg-scale": thankYouControls.bg.scale,
    "--thank-text-color": thankYouControls.text.color,
    "--thank-text-duration": thankYouControls.text.entranceDuration,
    "--thank-text-delay": thankYouControls.text.entranceDelay,
    "--thank-text-size": thankYouControls.text.desktopSize,
    "--thank-text-mobile-top": thankYouControls.text.mobileTop,
    "--thank-text-top": thankYouControls.text.desktopTop,
    "--thank-reveal-duration": thankYouControls.van.duration,
    "--van-bottom": thankYouControls.van.desktopBottom,
    "--van-end-offset": thankYouControls.van.endOffset,
    "--van-mobile-bottom": thankYouControls.van.mobileBottom,
    "--van-mobile-width": thankYouControls.van.mobileWidth,
    "--van-start-offset": thankYouControls.van.startOffset,
    "--van-width": thankYouControls.van.desktopWidth,
    "--thank-text-mobile-size": thankYouControls.text.mobileSize,
  };

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.62) {
          setPlayKey((current) => current + 1);
          setIsPlaying(true);
          return;
        }

        if (!entry.isIntersecting) {
          setIsPlaying(false);
        }
      },
      { threshold: [0, 0.62] },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="thank-you"
      ref={sectionRef}
      className="thankYouSection relative isolate h-screen overflow-hidden bg-black select-none"
      style={sectionStyle}
      aria-label="Thank you closing section"
    >
      <div className="thankYouBg absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/15" />

      <div
        key={`text-${playKey}`}
        className={`thankYouTextWrap absolute inset-x-0 top-0 flex justify-center ${
          isPlaying ? "isPlaying" : ""
        }`}
        aria-hidden="true"
      >
        <h2 className="thankYouText font-figtree font-black uppercase">Thank You</h2>
      </div>

      <img
        key={`van-${playKey}`}
        src={THANK_YOU_VAN}
        alt=""
        className={`thankYouVan pointer-events-none absolute z-20 max-w-none ${
          isPlaying ? "isPlaying" : ""
        }`}
        draggable={false}
        aria-hidden="true"
      />

      <style>{`
        .thankYouSection {
        }

        .thankYouBg {
          background-image: url("${THANK_YOU_BG}");
          background-position: var(--thank-bg-position);
          background-repeat: no-repeat;
          background-size: cover;
          transform: scale(var(--thank-bg-scale));
        }

        .thankYouTextWrap {
          z-index: 10;
          padding-top: var(--thank-text-top);
          opacity: 0;
          filter: blur(calc(10*var(--u)));
          transform: translate3d(0, 3.4rem, 0) scale(0.94);
        }

        .thankYouTextWrap.isPlaying {
          animation: thankYouMidwayTitle var(--thank-reveal-duration) linear forwards;
        }

        .thankYouText {
          color: var(--thank-text-color);
          font-size: var(--thank-text-size);
          line-height: 0.82;
          letter-spacing: 0;
          text-align: center;
          text-shadow:
            0 0.08em 0 rgba(85, 11, 0, 0.72),
            0 0.18em 0.34em rgba(0, 0, 0, 0.42);
          white-space: nowrap;
        }

        .thankYouVan {
          bottom: var(--van-bottom);
          left: 0;
          width: var(--van-width);
          transform: translate3d(calc(-1 * var(--van-width) - var(--van-start-offset)), 0, 0);
          filter: drop-shadow(0 2rem 1.3rem rgba(0, 0, 0, 0.42));
        }

        .thankYouVan.isPlaying {
          animation: thankYouVanDrive var(--thank-reveal-duration) cubic-bezier(0.32, 0.02, 0.18, 1) forwards;
        }

        @keyframes thankYouVanDrive {
          0% {
            transform: translate3d(calc(-1 * var(--van-width) - var(--van-start-offset)), 0, 0);
          }
          100% {
            transform: translate3d(calc(100vw + var(--van-end-offset)), 0, 0);
          }
        }

        @keyframes thankYouMidwayTitle {
          0%,
          48% {
            opacity: 0;
            filter: blur(calc(10*var(--u)));
            transform: translate3d(0, 3.4rem, 0) scale(0.94);
          }
          58% {
            opacity: 1;
            filter: blur(0);
            transform: translate3d(0, -0.34rem, 0) scale(1.025);
          }
          68%,
          100% {
            opacity: 1;
            filter: blur(0);
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        @media (max-width: 768px) {
          .thankYouSection {
            --van-width: var(--van-mobile-width);
            --van-bottom: var(--van-mobile-bottom);
            --thank-text-top: var(--thank-text-mobile-top);
          }

          .thankYouText {
            font-size: var(--thank-text-mobile-size);
          }
        }
      `}</style>
    </section>
  );
}
