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
};

const defaultOnlineTextControl: OnlineTextControl = {
  hoverZ: "54px",
  x: "-50%",
  y: "-43%",
  z: "46px",
};

const onlineTextControls: Record<number, Partial<OnlineTextControl>> = {
  4: { x: "-54%" },
  6: { x: "-52.5%" },
};

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

const offlineSlideThreeChooseOneImages = [
  "map",
  "a1",
  "a2",
  "a3",
  "a4",
  "a5",
  "a6",
] as const;

const offlineSlideThreeChooseTwoImages = [
  "map",
  "a1",
  "a2",
  "a3",
  "a4",
  "a5",
  "a6",
  "a7",
  "a8",
] as const;

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
        More...
      </button>
    </motion.div>
  );
}

function OnlineDetails() {
  return (
    <motion.div
      animate={{ opacity: 1, x: 0 }}
      className="historyOnlineFeatureGrid"
      exit={{ opacity: 0, x: 34 }}
      initial={{ opacity: 0, x: 46 }}
      key="online-details"
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
    >
      {onlineFeatureCards.map((card, index) => (
        <motion.article
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="historyOnlineFeatureCard"
          initial={{ opacity: 0, scale: 0.94, y: 42 }}
          key={card.id}
          transition={{
            delay: 0.1 + index * 0.1,
            duration: 0.56,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <img alt="" aria-hidden="true" draggable={false} src={card.src} />
          <span>{card.label}</span>
        </motion.article>
      ))}
    </motion.div>
  );
}

function OfflinePopupSlides() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideOneReplayKey, setSlideOneReplayKey] = useState(0);
  const [activeSlideThreeTab, setActiveSlideThreeTab] =
    useState<(typeof offlineSlideThreeTabs)[number]>("Statewide Digital");
  const isTriggerLocked = useRef(false);
  const previousSlideRef = useRef(0);
  const slideCount = 3;
  const slideOneLayerDelay = slideOneReplayKey === 0 ? 0.24 : 0.72;

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
        moveSlide(1);
      }
      if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        moveSlide(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
            {["a1", "a2", "a3", "a4"].map((asset, index) => (
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
                    className="historyOfflineSlideThreeChoiceLayer"
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
                  className="historyOfflineSlideThreeChoiceLayer"
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
            <div className="historyOfflineSlideThreeButtons">
              {offlineSlideThreeTabs.map((tab) => (
                <button
                  className={tab === activeSlideThreeTab ? "isActive" : undefined}
                  key={tab}
                  onClick={() => setActiveSlideThreeTab(tab)}
                  type="button"
                >
                  {tab}
                </button>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function IdeasPopupMain() {
  const [ideasView, setIdeasView] = useState<"main" | "red" | "game">("main");
  const isDetailView = ideasView !== "main";

  return (
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
                src: "/history/theideas/card1.png",
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
  );
}

export function HistoryPanel({ activePanel, onClose }: HistoryPanelProps) {
  const isOnlinePanel = activePanel === "online";
  const isOfflinePanel = activePanel === "offline";
  const isIdeasPanel = activePanel === "ideas";
  const [onlineView, setOnlineView] = useState<"overview" | "details">("overview");
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const isIframeOpen = Boolean(iframeUrl);
  const isStructuredPanel = isOfflinePanel || isIdeasPanel;
  const panelClassName =
    isIframeOpen
      ? "historyOnlinePanel historyOnlineFramePanel"
      : isStructuredPanel
        ? `historyOnlinePanel historyOfflinePanel${isIdeasPanel ? " historyIdeasPanel" : ""}`
          : isOnlinePanel && onlineView === "details"
            ? "historyOnlinePanel historyOnlineOnlyPanel historyOnlineDetailPanel"
            : isOnlinePanel
              ? "historyOnlinePanel historyOnlineOnlyPanel"
              : "historyOnlinePanel";
  const panelStyle = isStructuredPanel && !isIframeOpen
    ? ({
        height: "950px",
        left: "calc(50% - 895px)",
        top: "calc(50% - 475px)",
        width: "1790px",
      } satisfies CSSProperties)
    : historyOnlineLayout.panel;

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
        <iframe
          className="historyOnlineIframe"
          src={iframeUrl ?? ""}
          title="Meme pages manager"
        />
      ) : isOfflinePanel ? (
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
              Back
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
                <OnlineDetails />
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
