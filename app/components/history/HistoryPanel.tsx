"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useState, type CSSProperties } from "react";
import {
  historyOnlineLayout,
  historyPanelTitles,
  type IdeaCard,
  ideaCards,
  onlineCards,
  onlineFeatureCards,
} from "./data";
import OfflineDeck from "./OfflineDeck";
import type { HistoryPanel as HistoryPanelName } from "./types";

type HistoryPanelProps = {
  activePanel: HistoryPanelName;
  onClose: () => void;
};

type OnlineCardData = (typeof onlineCards)[number];

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
        <span className="historyOnlineCardText">
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

function IdeasPanel({ onSelect }: { onSelect: (card: IdeaCard) => void }) {
  return (
    <div className="historyIdeasGrid">
      {ideaCards.map((card, index) => (
        <motion.button
          animate={{
            opacity: 1,
            y: 0,
          }}
          aria-label={`Open ${card.label.replace(/\n/g, " ")}`}
          className="historyIdeaCard"
          initial={{
            opacity: 0,
            y: 24,
          }}
          key={card.id}
          onClick={() => onSelect(card)}
          transition={{
            delay: 0.04 + index * 0.04,
            duration: 0.32,
            ease: [0.16, 1, 0.3, 1],
          }}
          type="button"
        >
          <img alt="" aria-hidden="true" draggable={false} src={card.src} />
          <span>{card.label}</span>
        </motion.button>
      ))}
    </div>
  );
}

function IdeaDetailPanel({ card, onBack }: { card: IdeaCard; onBack: () => void }) {
  return (
    <motion.div
      animate={{ opacity: 1, x: 0 }}
      className="historyIdeaDetail"
      exit={{ opacity: 0, x: 24 }}
      initial={{ opacity: 0, x: 28 }}
      key={card.id}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
      <button
        aria-label="Back to ideas"
        className="historyOnlineBack historyIdeaDetailBack"
        onClick={onBack}
        type="button"
      >
        Back
      </button>
      <motion.h3
        animate={{ opacity: 1, y: 0 }}
        className="historyIdeaDetailTitle"
        initial={{ opacity: 0, y: 18 }}
        transition={{ delay: 0.03, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      >
        {card.detailTitle}
      </motion.h3>
      <motion.img
        alt=""
        animate={{ opacity: 1, scale: 1, y: 0 }}
        aria-hidden="true"
        className="historyIdeaDetailImage"
        draggable={false}
        initial={{ opacity: 0, scale: 0.985, y: 22 }}
        src={card.src}
        transition={{ delay: 0.06, duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="historyIdeaDetailCopy"
        initial={{ opacity: 0, x: 24 }}
        transition={{ delay: 0.1, duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
      >
        <p>{card.detailKicker}</p>
        <span>{card.detailBody}</span>
      </motion.div>
    </motion.div>
  );
}

export function HistoryPanel({ activePanel, onClose }: HistoryPanelProps) {
  const isOnlinePanel = activePanel === "online";
  const isOfflinePanel = activePanel === "offline";
  const isIdeasPanel = activePanel === "ideas";
  const [onlineView, setOnlineView] = useState<"overview" | "details">("overview");
  const [selectedIdea, setSelectedIdea] = useState<IdeaCard | null>(null);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const isIframeOpen = Boolean(iframeUrl);
  const panelClassName =
    isIframeOpen
      ? "historyOnlinePanel historyOnlineFramePanel"
      : isOfflinePanel
        ? "historyOnlinePanel historyOfflinePanel"
        : isIdeasPanel && selectedIdea
          ? "historyOnlinePanel historyIdeasDetailPanel"
          : isOnlinePanel && onlineView === "details"
            ? "historyOnlinePanel historyOnlineDetailPanel"
            : "historyOnlinePanel";

  return (
    <motion.div
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      className={panelClassName}
      style={historyOnlineLayout.panel}
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
              ? "Close presentation"
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
        <OfflineDeck />
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
          {isIdeasPanel && selectedIdea ? null : <h3>{historyPanelTitles[activePanel]}</h3>}
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
          ) : isIdeasPanel ? (
            <AnimatePresence initial={false}>
              {selectedIdea ? (
                <IdeaDetailPanel
                  card={selectedIdea}
                  onBack={() => setSelectedIdea(null)}
                />
              ) : (
                <IdeasPanel onSelect={setSelectedIdea} />
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
