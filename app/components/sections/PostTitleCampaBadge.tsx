"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

const badgeControls = {
  desktopTop: "clamp(16px, 2.1vw, 34px)",
  desktopRight: "clamp(18px, 2.6vw, 46px)",
  desktopWidth: "clamp(108px, 9vw, 168px)",
  mobileTop: "14px",
  mobileRight: "14px",
  mobileWidth: "108px",
};

export default function PostTitleCampaBadge() {
  const markerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    const updateVisibility = () => {
      frame = 0;
      const marker = markerRef.current;

      if (!marker) {
        return;
      }

      setIsVisible(marker.getBoundingClientRect().top <= 1);
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
          opacity: isVisible ? 1 : 0,
          y: isVisible ? 0 : -18,
          scale: isVisible ? 1 : 0.92,
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
