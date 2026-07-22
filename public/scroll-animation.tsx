"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

type TitleScrollStyle = CSSProperties & {
  "--hostel-opacity": string;
  "--hostel-cut-opacity": string;
  "--boys-opacity": string;
  "--small-campa-opacity": string;
  "--small-campa-clip": string;
  "--big-campa-opacity": string;
  "--big-campa-clip": string;
};

const animationDuration = 500;

const stages: TitleScrollStyle[] = [
  {
    "--hostel-opacity": "0",
    "--hostel-cut-opacity": "0",
    "--boys-opacity": "0",
    "--small-campa-opacity": "0",
    "--small-campa-clip": "100%",
    "--big-campa-opacity": "0",
    "--big-campa-clip": "100%",
  },
  {
    "--hostel-opacity": "1",
    "--hostel-cut-opacity": "0",
    "--boys-opacity": "1",
    "--small-campa-opacity": "0",
    "--small-campa-clip": "100%",
    "--big-campa-opacity": "0",
    "--big-campa-clip": "100%",
  },
  {
    "--hostel-opacity": "0",
    "--hostel-cut-opacity": "1",
    "--boys-opacity": "1",
    "--small-campa-opacity": "1",
    "--small-campa-clip": "0%",
    "--big-campa-opacity": "0",
    "--big-campa-clip": "100%",
  },
  {
    "--hostel-opacity": "0",
    "--hostel-cut-opacity": "0",
    "--boys-opacity": "1",
    "--small-campa-opacity": "0",
    "--small-campa-clip": "0%",
    "--big-campa-opacity": "1",
    "--big-campa-clip": "0%",
  },
];

export default function ScrollAnimation() {
  const [stage, setStage] = useState(0);
  const isAnimatingRef = useRef(false);
  const touchStartYRef = useRef(0);

  useEffect(() => {
    const moveStage = (direction: 1 | -1) => {
      if (isAnimatingRef.current) {
        return;
      }

      setStage((currentStage) => {
        const nextStage = Math.min(Math.max(currentStage + direction, 0), 3);

        if (nextStage !== currentStage) {
          isAnimatingRef.current = true;
          window.setTimeout(() => {
            isAnimatingRef.current = false;
          }, animationDuration);
        }

        return nextStage;
      });
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      if (Math.abs(event.deltaY) < 8) {
        return;
      }

      moveStage(event.deltaY > 0 ? 1 : -1);
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? 0;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const touchEndY = event.changedTouches[0]?.clientY ?? touchStartYRef.current;
      const deltaY = touchStartYRef.current - touchEndY;

      if (Math.abs(deltaY) < 30) {
        return;
      }

      moveStage(deltaY > 0 ? 1 : -1);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        moveStage(1);
      }

      if (["ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        moveStage(-1);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <main
      className="min-h-screen overflow-hidden bg-red-600"
      data-stage={stage}
      style={stages[stage]}
    >
          <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
            <div className="relative min-h-[45vh] md:min-h-screen" />

            <div className="poster-panel flex min-h-[55vh] items-center justify-end p-6 md:min-h-screen md:p-12 lg:p-16">
              <div className="poster-frame relative shrink-0">
                <Image
                  src="/main.png"
                  alt="Hostel Boyz poster"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  priority
                  unoptimized
                  className="poster-image object-contain"
                />

                <div className="poster-title-mark absolute left-1/2 top-[13%] z-10 w-[58%]">
                  <div className="relative -ml-[4%]">
                    <Image
                      src="/campa.png"
                      alt="Campa"
                      width={906}
                      height={574}
                      priority
                      unoptimized
                      className="title-campa-small absolute left-[17%] top-[-18%] z-20 h-auto w-[24%]"
                    />
                    <Image
                      src="/hostel.svg"
                      alt="Hostel"
                      width={2287}
                      height={953}
                      priority
                      unoptimized
                      className="title-hostel relative z-10 h-auto w-full"
                    />
                    <Image
                      src="/hostelcut.svg"
                      alt="Hostel"
                      width={2287}
                      height={953}
                      priority
                      unoptimized
                      className="title-hostel-cut absolute inset-0 z-10 h-auto w-full"
                    />
                    <Image
                      src="/campa.png"
                      alt="Campa"
                      width={906}
                      height={574}
                      priority
                      unoptimized
                      className="title-campa-big absolute left-[7%] top-[-18%] z-30 h-auto w-[82%]"
                    />
                  </div>
                  <Image
                    src="/boys.svg"
                    alt="Boys"
                    width={1585}
                    height={825}
                    priority
                    unoptimized
                    className="title-boys relative z-40 -mt-[14%] ml-[22%] h-auto w-[74%]"
                  />
                </div>
              </div>
            </div>
          </div>
    </main>
  );
}
