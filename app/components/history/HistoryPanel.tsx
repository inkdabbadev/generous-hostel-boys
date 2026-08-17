"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties, type WheelEvent } from "react";
import {
  historyOnlineLayout,
  historyPanelTitles,
  onlineCards,
  onlineFeatureCards,
} from "./data";
import type { HistoryPanel as HistoryPanelName } from "./types";

type HistoryPanelProps = {
  activePanel: HistoryPanelName;
  onClose: () => void;
};

type OnlineCardData = (typeof onlineCards)[number];
type OnlineTextControl = {
  x: string;
  y: string;
  z: string;
  hoverZ: string;
  width: string;
};

const defaultOnlineTextControl: OnlineTextControl = {
  hoverZ: "calc(54*var(--u))",
  width: "82%",
  x: "-50%",
  y: "-43%",
  z: "calc(46*var(--u))",
};

const onlineTextControls: Record<number, Partial<OnlineTextControl>> = {
  4: { width: "92%" },
  6: { width: "92%", y: "-43.5%" },
  7: { width: "92%" },
};

const offlineSlideOneMapLayers = [
  { asset: "l1", delayOffset: 0.18 },
  { asset: "l2", delayOffset: 0.42 },
] as const;

const offlineTransitNodes = [
  {
    activeIconSrc: "/history/offline/slide2/bicon1.svg",
    iconSrc: "/history/offline/slide2/icon1.svg",
    label: "Roads",
  },
  {
    activeIconSrc: "/history/offline/slide2/bicon2.svg",
    iconSrc: "/history/offline/slide2/icon2.svg",
    label: "Bus Stop",
  },
  {
    activeIconSrc: "/history/offline/slide2/bicon3.svg",
    iconSrc: "/history/offline/slide2/icon3.svg",
    label: "Bus Stand",
  },
  {
    activeIconSrc: "/history/offline/slide2/bicon4.svg",
    iconSrc: "/history/offline/slide2/icon4.svg",
    label: "Traffic\nSignal",
  },
  {
    activeIconSrc: "/history/offline/slide2/bicon5.svg",
    iconSrc: "/history/offline/slide2/icon5.svg",
    label: "Metro",
  },
  {
    activeIconSrc: "/history/offline/slide2/bicon6.svg",
    iconSrc: "/history/offline/slide2/icon6.svg",
    label: "Airport",
  },
] as const;

const offlineSlideThreeTabs = [
  "Statewide Digital",
  "Chennai Takeover",
  "Rest of Tamilnadu",
  "Airport Network",
] as const;

const offlineSlideThreeStartIndex = 2;
const offlineSlideFourIndex = offlineSlideThreeStartIndex + offlineSlideThreeTabs.length;
const offlineImageSlidesStartIndex = offlineSlideFourIndex + 1;

const offlineSlideThreeChooseOneImages = [
  "map",
  "l1",
  "l2",
  "a1",
  "a2",
  "a3",
  "a4",
  "a5",
  "a6",
] as const;

const offlineSlideThreeChooseOneDots = [
  { delay: "0s", size: 16, x: 1550, y: 200 },
  { delay: "0s", size: 16, x: 1350, y: 252 },
  { delay: "0.25s", size: 14, x: 1486, y: 318 },
  { delay: "0.5s", size: 16, x: 1292, y: 422 },
  { delay: "0.75s", size: 12, x: 1438, y: 482 },
  { delay: "1s", size: 14, x: 1350, y: 558 },
  { delay: "1.25s", size: 12, x: 1238, y: 548 },
  { delay: "1.5s", size: 14, x: 1364, y: 682 },
  { delay: "1.75s", size: 12, x: 1250, y: 718 },
  { delay: "2s", size: 12, x: 1400, y: 350 },
] as const;

const offlineSlideThreeChooseTwoImages = [
  "map",
  "l1",
  "a1",
  "a2",
  "a3",
  "a4",
  "a5",
  "a6",
  "a7",
  "a8",
] as const;

const offlineSlideThreeChooseThreeImages = [
  "map",
  "l1",
  "l2",
  "a1",
  "a2",
  "a3",
  "a4",
  "a5",
  "a6",
  "a7",
] as const;

const offlineSlideThreeChooseFourImages = [
  "map",
  "l1",
  "a1",
  "a2",
  "a3",
  "a4",
  "a5",
  "a6",
  "a7",
] as const;

const offlineSlideFourImages = ["a1", "a2", "a3", "a4", "a5", "a6", "a7"] as const;

const offlineImageSlides = ["img1", "img2", "img3", "img4", "img5"] as const;
const offlineImageStats = [
  { label: "Days", value: "60" },
  { label: "Hoardings", value: "500+" },
  { label: "Visibility", value: "10M+" },
  { label: "Viewership", value: "10M+" },
] as const;
const structuredPanelBaseWidth = 1790;
const structuredPanelBaseHeight = 950;
const structuredPanelAspect = structuredPanelBaseWidth / structuredPanelBaseHeight;

function clampNumber(min: number, value: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getViewportSize() {
  if (typeof window === "undefined") {
    return { height: 0, width: 0 };
  }

  const viewport = window.visualViewport;
  return {
    height: viewport?.height ?? window.innerHeight,
    width: viewport?.width ?? window.innerWidth,
  };
}

function OfflinePowerFlow() {
  return (
    <div className="historyOfflinePowerFlow" aria-hidden="true">
      <span className="historyOfflinePowerLine" />
      <span className="historyOfflinePowerPulse" />
      {offlineTransitNodes.map((node, index) => (
        <div
          className="historyOfflinePowerNode"
          key={node.label}
          style={{
            "--power-mask-x": `${-(207 + index * 244)}px`,
            "--power-index": String(index),
            "--power-node-delay": `${0.72 + index * 0.9}s`,
          } as CSSProperties}
        >
          <span className="historyOfflinePowerNodeMask" />
          <span className="historyOfflinePowerIcon">
            <img
              alt=""
              aria-hidden="true"
              className="historyOfflinePowerIconBase"
              draggable={false}
              src={node.iconSrc}
            />
            <img
              alt=""
              aria-hidden="true"
              className="historyOfflinePowerIconActive"
              draggable={false}
              src={node.activeIconSrc}
            />
          </span>
          <span className="historyOfflinePowerLabel">{node.label}</span>
        </div>
      ))}
    </div>
  );
}

function AirportNetworkFlightOverlay() {
  return (
    <svg
      aria-hidden="true"
      className="historyOfflineAirportFlightOverlay"
      viewBox="0 0 1790 950"
    >
      <defs>
        <path
          d="M 1198 482 C 1242 544 1332 546 1380 486"
          id="airport-flight-path-1"
        />
        <path
          d="M 1380 486 C 1368 360 1450 258 1576 212"
          id="airport-flight-path-2"
        />
        <path
          d="M 1198 482 C 1264 350 1418 228 1576 212"
          id="airport-flight-path-3"
        />
        <path
          d="M 1576 212 C 1418 228 1264 350 1198 482"
          id="airport-flight-path-3-reverse"
        />
      </defs>
      <use className="historyOfflineAirportRoute" href="#airport-flight-path-1" />
      <use className="historyOfflineAirportRoute historyOfflineAirportRouteSecond" href="#airport-flight-path-2" />
      <use className="historyOfflineAirportRoute historyOfflineAirportRouteThird" href="#airport-flight-path-3" />
      {[
        { x: 1198, y: 506 },
        { x: 1380, y: 510 },
        { x: 1576, y: 236 },
      ].map((point, index) => (
        <g
          className="historyOfflineAirportPoint"
          key={`${point.x}-${point.y}`}
          style={{ "--airport-point-delay": `${0.08 + index * 0.08}s` } as CSSProperties}
          transform={`translate(${point.x} ${point.y})`}
        >
          <circle className="historyOfflineAirportPointRing" r="25" />
          <circle className="historyOfflineAirportPointCore" r="15" />
        </g>
      ))}
      <g className="historyOfflineAirportPlaneIcon">
        <image
          height="42"
          href="/history/offline/slide3/choose4/airplane.svg"
          transform="rotate(90)"
          width="42"
          x="-21"
          y="-21"
        />
        <animateMotion begin="0.38s" dur="2.5s" repeatCount="indefinite" rotate="auto">
          <mpath href="#airport-flight-path-1" />
        </animateMotion>
      </g>
      <g className="historyOfflineAirportPlaneIcon historyOfflineAirportPlaneIconSecond">
        <image
          height="42"
          href="/history/offline/slide3/choose4/airplane.svg"
          transform="rotate(90)"
          width="42"
          x="-21"
          y="-21"
        />
        <animateMotion begin="0.74s" dur="2.9s" repeatCount="indefinite" rotate="auto">
          <mpath href="#airport-flight-path-2" />
        </animateMotion>
      </g>
      <g className="historyOfflineAirportPlaneIcon historyOfflineAirportPlaneIconThird">
        <image
          height="42"
          href="/history/offline/slide3/choose4/airplane.svg"
          transform="rotate(90)"
          width="42"
          x="-21"
          y="-21"
        />
        <animateMotion begin="1.02s" dur="3.15s" repeatCount="indefinite" rotate="auto">
          <mpath href="#airport-flight-path-3-reverse" />
        </animateMotion>
      </g>
    </svg>
  );
}

function OnlinePaperCard({
  card,
  index,
  onOpenFrame,
}: {
  card: OnlineCardData;
  index: number;
  onOpenFrame: (url: string) => void;
}) {
  const rotateXValue = useMotionValue(0);
  const rotateYValue = useMotionValue(0);
  const xValue = useMotionValue(0);
  const yValue = useMotionValue(0);
  const rotateX = useSpring(rotateXValue, { damping: 17, mass: 0.42, stiffness: 190 });
  const rotateY = useSpring(rotateYValue, { damping: 17, mass: 0.42, stiffness: 190 });
  const x = useSpring(xValue, { damping: 18, mass: 0.38, stiffness: 210 });
  const y = useSpring(yValue, { damping: 18, mass: 0.38, stiffness: 210 });
  const textControl = {
    ...defaultOnlineTextControl,
    ...onlineTextControls[card.id],
  };

  const resetHover = (element: HTMLButtonElement) => {
    rotateXValue.set(0);
    rotateYValue.set(0);
    xValue.set(0);
    yValue.set(0);
    element.style.setProperty("--online-shine-x", "50%");
    element.style.setProperty("--online-shine-y", "42%");
  };

  return (
    <motion.button
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      aria-label={card.href ? `Open ${card.label.replace(/\n/g, " ")}` : undefined}
      className="historyOnlineCard"
      disabled={!card.href}
      initial={{
        opacity: 0,
        scale: 0.9,
        y: 34,
      }}
      key={card.id}
      onClick={() => {
        if (card.href) {
          onOpenFrame(card.href);
        }
      }}
      onPointerLeave={(event) => resetHover(event.currentTarget)}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const relX = (event.clientX - rect.left) / rect.width - 0.5;
        const relY = (event.clientY - rect.top) / rect.height - 0.5;

        rotateXValue.set(relY * -11);
        rotateYValue.set(relX * 13);
        xValue.set(relX * 12);
        yValue.set(relY * 9);
        event.currentTarget.style.setProperty("--online-shine-x", `${(relX + 0.5) * 100}%`);
        event.currentTarget.style.setProperty("--online-shine-y", `${(relY + 0.5) * 100}%`);
      }}
      style={{
        "--online-card-delay": `${index * 72}ms`,
        "--online-card-scale": card.id === 6 ? "1.065" : "1",
      } as CSSProperties}
      transition={{
        delay: 0.08 + card.id * 0.045,
        duration: 0.44,
        ease: [0.16, 1, 0.3, 1],
      }}
      type="button"
      whileHover={{
        scale: 1.055,
        zIndex: 7,
      }}
      whileTap={{
        scale: 0.96,
      }}
    >
      <motion.span
        className="historyOnlineCardPlane"
        style={{
          rotateX,
          rotateY,
          x,
          y,
        }}
      >
        <img
          alt=""
          aria-hidden="true"
          className="historyOnlinePaper"
          draggable={false}
          src={card.paperSrc}
          style={historyOnlineLayout.paper}
        />
        <span
          className="historyOnlineCardText"
          style={{
            "--online-text-hover-z": textControl.hoverZ,
            "--online-text-width": textControl.width,
            "--online-text-x": textControl.x,
            "--online-text-y": textControl.y,
            "--online-text-z": textControl.z,
          } as CSSProperties}
        >
          <strong>{card.label}</strong>
          <em>{card.note}</em>
        </span>
      </motion.span>
    </motion.button>
  );
}

function OnlineOverview({
  onMore,
  onOpenFrame,
}: {
  onMore: () => void;
  onOpenFrame: (url: string) => void;
}) {
  return (
    <motion.div
      animate={{ opacity: 1, x: 0 }}
      className="historyOnlineOverview"
      exit={{ opacity: 0, x: -34 }}
      initial={{ opacity: 0, x: 34 }}
      key="online-overview"
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="historyOnlineGrid" style={historyOnlineLayout.grid}>
        {onlineCards.map((card, index) => (
          <OnlinePaperCard
            card={card}
            index={index}
            key={card.id}
            onOpenFrame={onOpenFrame}
          />
        ))}
      </div>
      <button className="historyOnlineMore" onClick={onMore} type="button">
        More
      </button>
    </motion.div>
  );
}

function OnlineDetails({
  onOpenFrame,
}: {
  onOpenFrame: (url: string, title: string) => void;
}) {
  return (
    <motion.div
      animate={{ opacity: 1, x: 0 }}
      className="historyOnlineFeatureGrid"
      exit={{ opacity: 0, x: 34 }}
      initial={{ opacity: 0, x: 46 }}
      key="online-details"
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
    >
      {onlineFeatureCards.map((card, index) => {
        const isPlayable = "videoUrl" in card && Boolean(card.videoUrl);

        return (
          <motion.article
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`historyOnlineFeatureCard${isPlayable ? " historyOnlineFeatureCardPlayable" : ""}`}
            initial={{ opacity: 0, scale: 0.94, y: 42 }}
            key={card.id}
            onClick={
              isPlayable
                ? () => onOpenFrame(card.videoUrl as string, card.label.replace("\n", " "))
                : undefined
            }
            role={isPlayable ? "button" : undefined}
            tabIndex={isPlayable ? 0 : undefined}
            onKeyDown={
              isPlayable
                ? (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onOpenFrame(card.videoUrl as string, card.label.replace("\n", " "));
                    }
                  }
                : undefined
            }
            transition={{
              delay: 0.1 + index * 0.1,
              duration: 0.56,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <img alt="" aria-hidden="true" draggable={false} src={card.src} />
            <span>{card.label}</span>
          </motion.article>
        );
      })}
    </motion.div>
  );
}

function OfflinePopupSlides() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideOneReplayKey, setSlideOneReplayKey] = useState(0);
  const isTriggerLocked = useRef(false);
  const previousSlideRef = useRef(0);
  const slideCount = offlineImageSlidesStartIndex + offlineImageSlides.length;
  const slideOneLayerDelay = slideOneReplayKey === 0 ? 0.24 : 0.72;
  const activeSlideThreeIndex = Math.min(
    Math.max(currentSlide - offlineSlideThreeStartIndex, 0),
    offlineSlideThreeTabs.length - 1,
  );
  const activeSlideThreeTab = offlineSlideThreeTabs[activeSlideThreeIndex];

  const releaseTriggerLock = () => {
    window.setTimeout(() => {
      isTriggerLocked.current = false;
    }, 720);
  };

  const moveSlide = (direction: 1 | -1) => {
    if (isTriggerLocked.current) return;
    setCurrentSlide((value) => {
      const nextValue = Math.max(0, Math.min(slideCount - 1, value + direction));
      if (nextValue === value) return value;
      isTriggerLocked.current = true;
      releaseTriggerLock();
      return nextValue;
    });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "PageDown" || event.key === " ") {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        moveSlide(1);
      }
      if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        moveSlide(-1);
      }
    };

    document.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => document.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, []);

  useEffect(() => {
    if (currentSlide === 0 && previousSlideRef.current !== 0) {
      setSlideOneReplayKey((value) => value + 1);
    }
    previousSlideRef.current = currentSlide;
  }, [currentSlide]);

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) < 12) return;
    event.preventDefault();
    moveSlide(event.deltaY > 0 ? 1 : -1);
  };

  return (
    <div className="historyOfflineStack" onWheel={handleWheel}>
      <AnimatePresence initial={false}>
        {currentSlide >= 0 ? (
          <motion.div
            animate={{ y: 0 }}
            className="historyOfflinePopupSlide"
            exit={{ y: "108%" }}
            initial={false}
            key="offline-slide-1"
            style={{ zIndex: 1 }}
            transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              alt=""
              aria-hidden="true"
              className="historyOfflineBgImage"
              draggable={false}
              src="/history/offline/slide1/bgimage.png"
            />
            <img
              alt=""
              aria-hidden="true"
              className="historyOfflineTextMap"
              draggable={false}
              src="/history/offline/slide1/text-map.png"
            />
            {offlineSlideOneMapLayers.map((layer, index) => (
              <motion.img
                alt=""
                animate={{ opacity: 1, scale: 1 }}
                aria-hidden="true"
                className={`historyOfflineMapLayer historyOfflineMapLayer-${layer.asset}`}
                draggable={false}
                initial={{ opacity: 0, scale: 1.035 }}
                key={`${slideOneReplayKey}-${layer.asset}`}
                src={`/history/offline/slide1/${layer.asset}.png`}
                transition={{
                  delay: slideOneLayerDelay + layer.delayOffset,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            ))}
            {["a1", "a2", "a3"].map((asset, index) => (
              <motion.img
                alt=""
                animate={{ opacity: 1, scale: 1 }}
                aria-hidden="true"
                className="historyOfflineAnimatedLayer"
                draggable={false}
                initial={{ opacity: 0, scale: 1.08 }}
                key={`${slideOneReplayKey}-${asset}`}
                src={`/history/offline/slide1/${asset}.png`}
                transition={{
                  delay: slideOneLayerDelay + index * 0.28,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            ))}
            {/* Was image "/history/offline/slide1/a4.png" (01 / Fully Branded Metro Train).
                Replaced with real text in the same spot, image kept unused above. */}
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              aria-hidden="true"
              className="historyOfflineAnimatedLayer historyOfflineMetroStat"
              initial={{ opacity: 0, scale: 1.08 }}
              key={`${slideOneReplayKey}-a4-text`}
              transition={{
                delay: slideOneLayerDelay + 3 * 0.28,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <strong>06-5</strong>
              <span>Electric train wrap +1 metro Train</span>
            </motion.div>
          </motion.div>
        ) : null}
        {currentSlide >= 1 ? (
          <motion.div
            animate={{ y: 0 }}
            className="historyOfflinePopupSlide historyOfflinePopupSlideTwo"
            exit={{ y: "108%" }}
            initial={{ y: "108%" }}
            key="offline-slide-2"
            style={{ zIndex: 2 }}
            transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              alt=""
              aria-hidden="true"
              className="historyOfflineSlideTwoText"
              draggable={false}
              src="/history/offline/slide2/text.png"
            />
            <OfflinePowerFlow />
          </motion.div>
        ) : null}
        {currentSlide >= 2 ? (
          <motion.div
            animate={{ y: 0 }}
            className="historyOfflinePopupSlide historyOfflinePopupSlideThree"
            exit={{ y: "108%" }}
            initial={{ y: "108%" }}
            key="offline-slide-3"
            style={{ zIndex: 3 }}
            transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              alt=""
              aria-hidden="true"
              className="historyOfflineSlideThreeTitle"
              draggable={false}
              src="/history/offline/slide3/title.png"
            />
            {activeSlideThreeTab === "Statewide Digital"
              ? offlineSlideThreeChooseOneImages.map((asset, index) => (
                  <motion.img
                    alt=""
                    animate={{ opacity: 1, scale: 1 }}
                    aria-hidden="true"
                    className="historyOfflineSlideThreeChoiceLayer historyOfflineSlideThreeChoiceLayerChoose1"
                    draggable={false}
                    initial={{ opacity: 0, scale: 1.04 }}
                    key={`choose1-${asset}`}
                    src={`/history/offline/slide3/choose1/${asset}.png`}
                    transition={{
                      delay: 0.16 + index * 0.18,
                      duration: 0.42,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                ))
              : null}
            {activeSlideThreeTab === "Chennai Takeover"
              ? offlineSlideThreeChooseTwoImages.map((asset, index) => (
                <motion.img
                  alt=""
                  animate={{ opacity: 1, scale: 1 }}
                  aria-hidden="true"
                  className="historyOfflineSlideThreeChoiceLayer historyOfflineSlideThreeChoiceLayerChoose2"
                  draggable={false}
                  initial={{ opacity: 0, scale: 1.04 }}
                  key={`choose2-${asset}`}
                  src={`/history/offline/slide3/choose2/${asset}.png`}
                  transition={{
                    delay: 0.16 + index * 0.18,
                    duration: 0.42,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              ))
              : null}
            {activeSlideThreeTab === "Rest of Tamilnadu"
              ? offlineSlideThreeChooseThreeImages.map((asset, index) => (
                <motion.img
                  alt=""
                  animate={{
                    opacity: 1,
                    scale: asset === "map" || asset === "l1" || asset === "l2" ? 1 : 0.9,
                  }}
                  aria-hidden="true"
                  className={`historyOfflineSlideThreeChoiceLayer historyOfflineSlideThreeChoiceLayerChoose3 historyOfflineSlideThreeChoiceLayerChoose3-${asset}`}
                  draggable={false}
                  initial={{
                    opacity: 0,
                    scale: asset === "map" || asset === "l1" || asset === "l2" ? 1.04 : 0.96,
                  }}
                  key={`choose3-${asset}`}
                  src={`/history/offline/slide3/choose3/${asset}.png`}
                  transition={{
                    delay: 0.16 + index * 0.18,
                    duration: 0.42,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              ))
              : null}
            {activeSlideThreeTab === "Airport Network"
              ? offlineSlideThreeChooseFourImages.map((asset, index) => (
                <motion.img
                  alt=""
                  animate={{ opacity: 1, scale: 1 }}
                  aria-hidden="true"
                  className={`historyOfflineSlideThreeChoiceLayer historyOfflineSlideThreeChoiceLayerChoose4 historyOfflineSlideThreeChoiceLayerChoose4-${asset}`}
                  draggable={false}
                  initial={{ opacity: 0, scale: 1.04 }}
                  key={`choose4-${asset}`}
                  src={`/history/offline/slide3/choose4/${asset}.png`}
                  transition={{
                    delay: 0.16 + index * 0.18,
                    duration: 0.42,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              ))
              : null}
            {activeSlideThreeTab === "Airport Network" ? (
              <>
                <AirportNetworkFlightOverlay />
                <span className="historyOfflineAirportCornerCleanup" aria-hidden="true" />
              </>
            ) : null}
            <div className="historyOfflineSlideThreeButtons" aria-hidden="true">
              {offlineSlideThreeTabs.map((tab, index) => (
                <span
                  className={index === activeSlideThreeIndex ? "isActive" : undefined}
                  key={tab}
                >
                  {tab}
                </span>
              ))}
            </div>
          </motion.div>
        ) : null}
        {currentSlide >= offlineSlideFourIndex ? (
          <motion.div
            animate={{ y: 0 }}
            className="historyOfflinePopupSlide historyOfflinePopupSlideFour"
            exit={{ y: "108%" }}
            initial={{ y: "108%" }}
            key="offline-slide-4"
            style={{ zIndex: offlineSlideFourIndex + 1 }}
            transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              alt=""
              aria-hidden="true"
              className="historyOfflineSlideFourBg"
              draggable={false}
              src="/history/offline/slide4/bg.png"
            />
            <div className="historyOfflineSlideFourTint" aria-hidden="true" />
            <motion.h3
              animate={{ opacity: 1, y: 0 }}
              className="historyOfflineSlideFourTitle"
              initial={{ opacity: 0, y: 24 }}
              transition={{ delay: 0.14, duration: 0.46, ease: [0.16, 1, 0.3, 1] }}
            >
              <span>From Statewide Scale To</span>
              <strong>City Level Frequency.</strong>
            </motion.h3>
            {offlineSlideFourImages.map((asset, index) => (
              <motion.img
                alt=""
                animate={{ opacity: 1, scale: 1 }}
                aria-hidden="true"
                className={`historyOfflineSlideFourAsset historyOfflineSlideFourAsset-${asset}`}
                draggable={false}
                initial={{ opacity: 0, scale: 1.04 }}
                key={`slide4-${asset}`}
                src={`/history/offline/slide4/${asset}.png`}
                transition={{
                  delay: 0.34 + index * 0.12,
                  duration: 0.38,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            ))}
          </motion.div>
        ) : null}
        {offlineImageSlides.map((asset, index) => {
          const slideIndex = offlineImageSlidesStartIndex + index;
          return currentSlide >= slideIndex ? (
            <motion.div
              animate={{ y: 0 }}
              className="historyOfflinePopupSlide historyOfflineImageSlide"
              exit={{ y: "108%" }}
              initial={{ y: "108%" }}
              key={`offline-image-slide-${asset}`}
              style={{ zIndex: slideIndex + 1 }}
              transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.img
                alt=""
                animate={{ opacity: 1, scale: 1 }}
                aria-hidden="true"
                className="historyOfflineImageSlideAsset"
                draggable={false}
                initial={{ opacity: 0, scale: 1.02 }}
                src={`/history/offline/images/${asset}.png`}
                transition={{ delay: 0.12, duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              />
              {/* <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="historyOfflineImageStats"
                initial={{ opacity: 0, y: 28 }}
                transition={{ delay: 0.28, duration: 0.46, ease: [0.16, 1, 0.3, 1] }}
              >
                {offlineImageStats.map((stat) => (
                  <div className="historyOfflineImageStat" key={stat.label}>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </motion.div> */}
            </motion.div>
          ) : null;
        })}
      </AnimatePresence>
    </div>
  );
}

function IdeasPopupMain() {
  const [ideasView, setIdeasView] = useState<"main" | "red" | "game">("main");
  const isDetailView = ideasView !== "main";

  return (
    // The panel's layout scale lives on this plain wrapper, NOT on the
    // motion.div children below. Framer Motion writes `transform` as an
    // inline style to animate `y`, which overrides any CSS `transform`
    // on the same element — and once `y` settles at 0 it writes
    // `transform: none`, silently wiping the scale. Keeping the scale on
    // an element Framer Motion doesn't control makes the two independent.
    <div className="historyIdeasScaleWrap">
    <AnimatePresence mode="wait">
      {isDetailView ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="historyIdeasDetail"
          exit={{ opacity: 0, y: 24 }}
          initial={{ opacity: 1, y: 42 }}
          key="red-carpet-detail"
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            aria-label="Back to ideas"
            className="historyIdeasBackTile"
            onClick={() => setIdeasView("main")}
            type="button"
          >
            <span aria-hidden="true" />
          </button>
          <motion.img
            alt={ideasView === "red" ? "Red Carpet Show" : "Game Night"}
            animate={{ opacity: 1, scale: 1 }}
            className="historyIdeasDetailImage"
            draggable={false}
            initial={{ opacity: 0, scale: 1.02 }}
            src={ideasView === "red" ? "/history/theideas/red/whole.png" : "/history/theideas/game/whole.png"}
            transition={{ delay: 0.1, duration: 0.46, ease: [0.16, 1, 0.3, 1] }}
          />
          {ideasView === "red" && (
            <img
              alt="Generous Entertainments"
              className="historyIdeasRedCarpetPhoto"
              draggable={false}
              src="/images.jpg"
            />
          )}
        </motion.div>
      ) : (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="historyIdeasMain"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0, y: 22 }}
          key="ideas-main"
          transition={{ duration: 0.12, ease: "linear" }}
        >
          <motion.h3
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 24 }}
            transition={{ delay: 0.08, duration: 0.44, ease: [0.16, 1, 0.3, 1] }}
          >
            The Ideas
          </motion.h3>
          <div className="historyIdeasCards">
            {[
              {
                alt: "Red Carpet Show",
                label: "Red Carpet\nShow",
                onClick: () => setIdeasView("red"),
                src: "/history/theideas/card1.jpeg",
              },
              {
                alt: "Game Night",
                label: "Game Night",
                onClick: () => setIdeasView("game"),
                src: "/history/theideas/card2.png",
              },
            ].map((card, index) => (
              <motion.button
                animate={{ opacity: 1, scale: 1, y: 0 }}
                aria-label={card.alt}
                className="historyIdeasCardButton"
                initial={{ opacity: 0, scale: 0.94, y: 38 }}
                key={card.alt}
                onClick={card.onClick}
                transition={{
                  delay: 0.2 + index * 0.12,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                type="button"
              >
                <img alt={card.alt} draggable={false} src={card.src} />
                <span>{card.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </div>
  );
}

export function HistoryPanel({ activePanel, onClose }: HistoryPanelProps) {
  const isOnlinePanel = activePanel === "online";
  const isOfflinePanel = activePanel === "offline";
  const isIdeasPanel = activePanel === "ideas";
  const [onlineView, setOnlineView] = useState<"overview" | "details">("overview");
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [iframeTitle, setIframeTitle] = useState("Meme pages manager");
  const [viewportSize, setViewportSize] = useState(getViewportSize);
  const isIframeOpen = Boolean(iframeUrl);
  const isStructuredPanel = isOnlinePanel || isOfflinePanel || isIdeasPanel;
  const structuredPanelMetrics = viewportSize.width > 0 && viewportSize.height > 0
    ? (() => {
        // "Contain" fit: the fixed 1790x950 canvas is scaled down to sit
        // fully inside the viewport with a margin, so the panel reads as a
        // floating card over the room/warden background. The scale is the
        // SMALLER of the two ratios so the whole canvas stays visible and
        // its aspect ratio is preserved (never cropped, never distorted).
        const horizontalGap = clampNumber(52, viewportSize.width * 0.06, 128);
        const verticalGap = clampNumber(52, viewportSize.height * 0.08, 116);
        const availableWidth = Math.max(360, viewportSize.width - horizontalGap);
        const availableHeight = Math.max(240, viewportSize.height - verticalGap);
        const width = Math.min(
          structuredPanelBaseWidth,
          availableWidth,
          availableHeight * structuredPanelAspect,
        );
        const height = width / structuredPanelAspect;

        return {
          height,
          scale: width / structuredPanelBaseWidth,
          width,
        };
      })()
    : null;
  const structuredPanelClassName = `historyOnlinePanel historyOfflinePanel${isOnlinePanel ? " historyOnlineStructuredPanel" : ""}${isOnlinePanel && onlineView === "details" ? " historyOnlineDetailPanel" : ""}${isIdeasPanel ? " historyIdeasPanel" : ""}`;
  // The video plays as an overlay layered ON TOP of the panel, so the panel
  // keeps its normal class and card sizing while it's open — it must not
  // swap to a differently-sized layout underneath the player.
  const panelClassName = `${isStructuredPanel ? structuredPanelClassName : "historyOnlinePanel"}${
    isIframeOpen ? " historyOnlineFramePanel" : ""
  }`;
  const panelStyle = isStructuredPanel
    ? structuredPanelMetrics
      ? ({
          "--history-panel-scale": String(structuredPanelMetrics.scale),
          height: `${structuredPanelMetrics.height}px`,
          left: "50%",
          top: "50%",
          translate: "-50% -50%",
          width: `${structuredPanelMetrics.width}px`,
        } as CSSProperties)
      : ({
          "--history-panel-scale": "1",
          height: "min(calc(950*var(--u)), calc(100svh - clamp(calc(52*var(--u)), 8vh, calc(116*var(--u)))), calc((100vw - clamp(calc(52*var(--u)), 6vw, calc(128*var(--u)))) / 1.8842))",
          left: "50%",
          top: "50%",
          translate: "-50% -50%",
          width: "min(calc(1790*var(--u)), calc(100vw - clamp(calc(52*var(--u)), 6vw, calc(128*var(--u)))), calc((100svh - clamp(calc(52*var(--u)), 8vh, calc(116*var(--u)))) * 1.8842))",
        } as CSSProperties)
    : historyOnlineLayout.panel;

  useEffect(() => {
    const updateViewportSize = () => setViewportSize(getViewportSize());
    const viewport = window.visualViewport;

    updateViewportSize();
    window.addEventListener("resize", updateViewportSize);
    viewport?.addEventListener("resize", updateViewportSize);
    viewport?.addEventListener("scroll", updateViewportSize);

    return () => {
      window.removeEventListener("resize", updateViewportSize);
      viewport?.removeEventListener("resize", updateViewportSize);
      viewport?.removeEventListener("scroll", updateViewportSize);
    };
  }, []);

  return (
    <motion.div
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      className={panelClassName}
      style={panelStyle}
      exit={{
        opacity: 0,
        scale: 0.94,
        y: 28,
      }}
      initial={{
        opacity: 0,
        scale: 0.86,
        y: 54,
      }}
      transition={{
        duration: 0.42,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <button
        aria-label={
          isIframeOpen
            ? "Back to online popup"
            : isOfflinePanel
              ? "Close offline panel"
              : isIdeasPanel
                ? "Close ideas panel"
              : "Close online panel"
        }
        className="historyOnlineClose"
        onClick={isIframeOpen ? () => setIframeUrl(null) : onClose}
        type="button"
      >
        <span aria-hidden="true">X</span>
      </button>
      {isIframeOpen ? (
        <div className="historyOnlineFrameOverlay">
          <iframe
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="historyOnlineIframe"
            src={iframeUrl ?? ""}
            title={iframeTitle}
          />
        </div>
      ) : null}
      {isOfflinePanel ? (
        <OfflinePopupSlides />
      ) : isIdeasPanel ? (
        <IdeasPopupMain />
      ) : (
        <div className="historyOnlineInner" style={historyOnlineLayout.inner}>
          {isOnlinePanel && onlineView === "details" ? (
            <button
              aria-label="Back to online overview"
              className="historyOnlineBack"
              onClick={() => setOnlineView("overview")}
              type="button"
            >
              <span aria-hidden="true" />
            </button>
          ) : null}
          <h3>{historyPanelTitles[activePanel]}</h3>
          {isOnlinePanel ? (
            <AnimatePresence mode="wait">
              {onlineView === "overview" ? (
                <OnlineOverview
                  onMore={() => setOnlineView("details")}
                  onOpenFrame={setIframeUrl}
                />
              ) : (
                <OnlineDetails
                  onOpenFrame={(url, title) => {
                    setIframeUrl(url);
                    setIframeTitle(title);
                  }}
                />
              )}
            </AnimatePresence>
          ) : (
            <div className="historyPanelEmpty" aria-hidden="true" />
          )}
        </div>
      )}
    </motion.div>
  );
}
