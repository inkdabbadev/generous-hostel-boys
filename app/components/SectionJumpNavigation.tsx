"use client";

import { useEffect, useRef } from "react";

const FORWARD_KEYS = ["ArrowDown", "PageDown", " ", "Spacebar"];
const BACKWARD_KEYS = ["ArrowUp", "PageUp"];

function getActiveSection(sections: HTMLElement[]) {
  return sections.reduce(
    (active, section, index) => {
      const rect = section.getBoundingClientRect();
      const distance = Math.abs(rect.top);

      if (distance < active.distance) {
        return { index, distance };
      }

      return active;
    },
    { index: -1, distance: Number.POSITIVE_INFINITY },
  );
}

function sectionHandledInternalStep(section: HTMLElement, direction: 1 | -1) {
  const event = new CustomEvent("section-jump:intent", {
    cancelable: true,
    detail: {
      direction,
      section,
    },
  });

  window.dispatchEvent(event);
  return event.defaultPrevented;
}

export default function SectionJumpNavigation() {
  const isJumpingRef = useRef(false);
  const jumpTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const getSections = () => Array.from(document.querySelectorAll<HTMLElement>("main > section"));

    const clearJumpLockLater = () => {
      if (jumpTimeoutRef.current !== null) {
        window.clearTimeout(jumpTimeoutRef.current);
      }

      jumpTimeoutRef.current = window.setTimeout(() => {
        isJumpingRef.current = false;
        jumpTimeoutRef.current = null;
      }, 850);
    };

    const jumpToSection = (target: HTMLElement) => {
      isJumpingRef.current = true;

      if (target.id === "third-section") {
        window.dispatchEvent(new Event("poster-scroll:replay-on-arrival"));
      }

      window.scrollTo({
        top: target.offsetTop,
        behavior: "smooth",
      });

      clearJumpLockLater();
    };

    const handleSectionJump = (direction: 1 | -1) => {
      const sections = getSections();

      if (sections.length === 0) {
        return false;
      }

      const { index } = getActiveSection(sections);

      if (index < 0) {
        return false;
      }

      if (index === 0 || (index === 1 && direction === -1)) {
        return false;
      }

      if (sectionHandledInternalStep(sections[index], direction)) {
        return true;
      }

      const target = sections[index + direction];

      if (!target) {
        return false;
      }

      if (isJumpingRef.current) {
        return true;
      }

      jumpToSection(target);
      return true;
    };

    const onWheel = (event: WheelEvent) => {
      if (document.querySelector(".movieMetricPaperOverlay")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }

      const direction = event.deltaY > 0 ? 1 : event.deltaY < 0 ? -1 : 0;

      if (direction === 0) {
        return;
      }

      const handled = handleSectionJump(direction);

      if (handled) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (document.querySelector(".movieMetricPaperOverlay")) {
        return;
      }

      const isForwardKey = FORWARD_KEYS.includes(event.key) || FORWARD_KEYS.includes(event.code);
      const isBackwardKey = BACKWARD_KEYS.includes(event.key) || BACKWARD_KEYS.includes(event.code);

      if (!isForwardKey && !isBackwardKey) {
        return;
      }

      const handled = handleSectionJump(isForwardKey ? 1 : -1);

      if (handled) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    document.addEventListener("keydown", onKeyDown, { capture: true });

    return () => {
      if (jumpTimeoutRef.current !== null) {
        window.clearTimeout(jumpTimeoutRef.current);
      }

      window.removeEventListener("wheel", onWheel, { capture: true });
      document.removeEventListener("keydown", onKeyDown, { capture: true });
    };
  }, []);

  return null;
}
