import type { CSSProperties } from "react";
import type { HistoryPanel, HistoryStickyNote } from "./types";

export const historyLayout = {
  background: {
    inset: "0",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
  },
  warden: {
    right: "0",
    bottom: "0",
    width: "90vw",
    height: "110vh",
    objectFit: "contain",
    objectPosition: "right bottom",
  },
  marketingText: {
    left: "5.2vw",
    top: "4.2vh",
    fontSize: "clamp(4.4rem, 8vw, 10rem)",
  },
  marketingPen: {
    left: "0%",
    top: "-30%",
    width: "100%",
    height: "auto",
    objectFit: "contain",
  },
  makeHistoryText: {
    left: "20vw",
    top: "18.8vh",
    width: "36vw",
  },
  stickyOnline: {
    left: "10vw",
    top: "38vh",
    width: "19vw",
  },
  stickyOfflineRight: {
    left: "30.4vw",
    top: "38vh",
    width: "20.4vw",
  },
  stickyOfflineBottom: {
    left: "20vw",
    top: "65vh",
    width: "18.2vw",
  },
} satisfies Record<string, CSSProperties>;

export const stickyNotes: HistoryStickyNote[] = [
  {
    alt: "Online",
    delay: 2.35,
    labelDelay: 2.72,
    labelStyle: {
      "--sticky-label-left": "49%",
      "--sticky-label-top": "48%",
      "--sticky-label-size": "clamp(2rem, 3.5vw, 4.55rem)",
    },
    label: "Online",
    panel: "online",
    rotate: -5.2,
    src: "/history/sticky1.png",
    style: historyLayout.stickyOnline,
  },
  {
    alt: "Offline",
    delay: 2.52,
    labelDelay: 2.89,
    labelStyle: {
      "--sticky-label-left": "49%",
      "--sticky-label-top": "49%",
      "--sticky-label-size": "clamp(1.95rem, 3.35vw, 4.35rem)",
    },
    label: "Offline",
    panel: "offline",
    rotate: 3.2,
    src: "/history/sticky2.png",
    style: historyLayout.stickyOfflineRight,
  },
  {
    alt: "The Ideas",
    delay: 2.69,
    labelDelay: 3.06,
    labelStyle: {
      "--sticky-label-left": "50%",
      "--sticky-label-top": "53%",
      "--sticky-label-size": "clamp(1.95rem, 3.25vw, 4.25rem)",
      "--sticky-label-line-height": "0.88",
    },
    label: "IDEAS",
    panel: "ideas",
    rotate: -1.1,
    src: "/history/sticky3.png",
    style: historyLayout.stickyOfflineBottom,
  },
];

export const onlineCards = [
  {
    id: 1,
    href: "https://inkdabba-insta-profile-manager.vercel.app/meme",
    label: "Meme\nPages",
    note: "(Top 100)",
    paperSrc: "/history/online/paper/1.png",
  },
  {
    id: 2,
    href: "https://inkdabba-insta-profile-manager.vercel.app/district",
    label: "District\nPages",
    note: "(Top 100)",
    paperSrc: "/history/online/paper/2.png",
  },
  {
    id: 3,
    href: "https://inkdabba-insta-profile-manager.vercel.app/spl",
    label: "SPL Meme\nPages",
    note: "(Top 25)",
    paperSrc: "/history/online/paper/3.png",
  },
  {
    id: 4,
    href: "https://inkdabba-insta-profile-manager.vercel.app/twitter",
    label: "Twitter\nPromotions",
    note: "(50 Handles)",
    paperSrc: "/history/online/paper/4.png",
  },
  {
    id: 5,
    href: "https://inkdabba-insta-profile-manager.vercel.app/tamil",
    label: "Tamil Movie\nReview",
    note: "(25 Pages)",
    paperSrc: "/history/online/paper/5.png",
  },
  {
    id: 6,
    href: "https://inkdabba-insta-profile-manager.vercel.app/chennai",
    label: "Chennai\nInfluencers",
    note: "(Top 130)",
    paperSrc: "/history/online/paper/6.png",
  },
  {
    id: 7,
    href: "https://inkdabba-insta-profile-manager.vercel.app/rotn",
    label: "Rest of TN\nInfluencer",
    note: "(Top 110)",
    paperSrc: "/history/online/paper/7.png",
  },
] satisfies Array<{
  href?: string;
  id: number;
  label: string;
  note: string;
  paperSrc: string;
}>;

export const onlineFeatureCards = [
  {
    id: "music-video",
    label: "Music\nVideo",
    src: "/history/online/1.png",
  },
  {
    id: "video-promo",
    label: "Video\nPromo",
    src: "/history/online/2.png",
  },
  {
    id: "digital-ads",
    label: "Digital\nAds",
    src: "/history/online/3.png",
  },
];

export const historyOnlineLayout = {
  panel: {
    inset: "clamp(18px, 2.4vw, 42px)",
  },
  inner: {
    width: "min(1840px, 100%)",
    padding: "clamp(34px, 4vh, 56px) clamp(32px, 3.6vw, 66px) clamp(32px, 4vh, 58px)",
    gap: "clamp(22px, 3.4vh, 36px)",
  },
  grid: {
    gap: "clamp(42px, 6.8vh, 84px) clamp(28px, 3.4vw, 62px)",
  },
  paper: {
    width: "100%",
  },
} satisfies Record<string, CSSProperties>;

export const historyPanelTitles: Record<HistoryPanel, string> = {
  ideas: "The Ideas",
  offline: "Offline",
  online: "Online",
};
