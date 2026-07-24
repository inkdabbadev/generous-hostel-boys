"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
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
        {onlineCards.map((card) => (
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
            transition={{
              delay: 0.08 + card.id * 0.045,
              duration: 0.44,
              ease: [0.16, 1, 0.3, 1],
            }}
            type="button"
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
          </motion.button>
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
            rotate: 0,
            scale: 1,
            y: 0,
          }}
          aria-label={`Open ${card.label.replace(/\n/g, " ")}`}
          className="historyIdeaCard"
          initial={{
            opacity: 0,
            rotate: index === 0 ? -2.4 : 2.4,
            scale: 0.92,
            y: 46,
          }}
          key={card.id}
          onClick={() => onSelect(card)}
          transition={{
            delay: 0.18 + index * 0.12,
            duration: 0.62,
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
      animate={{ opacity: 1, scale: 1, x: 0 }}
      className="historyIdeaDetail"
      exit={{ opacity: 0, scale: 0.96, x: 46 }}
      initial={{ opacity: 0, scale: 0.98, x: 64 }}
      key={card.id}
      transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
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
        initial={{ opacity: 0, y: 28 }}
        transition={{ delay: 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {card.detailTitle}
      </motion.h3>
      <motion.img
        alt=""
        animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1, y: 0 }}
        aria-hidden="true"
        className="historyIdeaDetailImage"
        draggable={false}
        initial={{ clipPath: "inset(0% 100% 0% 0%)", opacity: 0, y: 34 }}
        src={card.src}
        transition={{ delay: 0.18, duration: 0.64, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="historyIdeaDetailCopy"
        initial={{ opacity: 0, x: 48 }}
        transition={{ delay: 0.28, duration: 0.54, ease: [0.16, 1, 0.3, 1] }}
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
        clipPath: "inset(0% 0% 0% 0%)",
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      className={panelClassName}
      style={historyOnlineLayout.panel}
      exit={{
        clipPath: "inset(4% 4% 4% 4%)",
        opacity: 0,
        scale: 0.94,
        y: 28,
      }}
      initial={{
        clipPath: "inset(48% 48% 48% 48%)",
        opacity: 0,
        scale: 0.86,
        y: 54,
      }}
      transition={{
        duration: 0.62,
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
            <AnimatePresence mode="wait">
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
