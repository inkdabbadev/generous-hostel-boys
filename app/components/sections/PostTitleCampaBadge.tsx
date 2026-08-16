"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

const badgeControls = {
  desktopTop: "clamp(calc(16*var(--u)), 2.1vw, calc(34*var(--u)))",
  desktopRight: "clamp(calc(18*var(--u)), 2.6vw, calc(46*var(--u)))",
  desktopWidth: "clamp(calc(108*var(--u)), 9vw, calc(168*var(--u)))",
  mobileTop: "calc(14*var(--u))",
  mobileRight: "calc(14*var(--u))",
  mobileWidth: "calc(108*var(--u))",
};

export default function PostTitleCampaBadge() {
  const markerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    const updateVisibility = () => {
      frame = 0;
      const marker = markerRef.current;
      const historySection = document.querySelector(".historySection");

      if (!marker) {
        return;
      }

      setIsVisible(marker.getBoundingClientRect().top <= 1);
      if (historySection) {
        const rect = historySection.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        setIsHistoryVisible(rect.top <= viewportCenter && rect.bottom >= viewportCenter);
      } else {
        setIsHistoryVisible(false);
      }
    };

    const requestUpdate = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(updateVisibility);
    };

    updateVisibility();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <>
      <div aria-hidden="true" className="postTitleCampaMarker" ref={markerRef} />
      <motion.div
        aria-hidden="true"
        animate={{
          opacity: isVisible && !isHistoryVisible ? 1 : 0,
          y: isVisible && !isHistoryVisible ? 0 : -18,
          scale: isVisible && !isHistoryVisible ? 1 : 0.92,
        }}
        className="postTitleCampaBadge"
        initial={false}
        style={{
          "--badge-desktop-top": badgeControls.desktopTop,
          "--badge-desktop-right": badgeControls.desktopRight,
          "--badge-desktop-width": badgeControls.desktopWidth,
          "--badge-mobile-top": badgeControls.mobileTop,
          "--badge-mobile-right": badgeControls.mobileRight,
          "--badge-mobile-width": badgeControls.mobileWidth,
        } as CSSProperties}
        transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          alt=""
          draggable={false}
          height={512}
          priority={false}
          src="/campa-boys.png"
          unoptimized
          width={512}
        />
      </motion.div>
    </>
  );
}
