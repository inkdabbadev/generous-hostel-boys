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
    left: "17vw",
    top: "18.8vh",
    width: "36vw",
  },
  // Sticky notes sit below the "How to make history?" headline. Their `top`
  // values must clear that text's bottom edge (~38.9vh) — the notes are
  // rotated, so their rendered bounding box starts 1-2vh ABOVE the `top`
  // set here, which is what previously let them collide with the text.
  stickyOnline: {
    left: "10vw",
    top: "44vh",
    width: "17.5vw",
  },
  stickyOfflineRight: {
    left: "31vw",
    top: "44vh",
    width: "18.5vw",
  },
  stickyOfflineBottom: {
    left: "22vw",
    top: "69vh",
    width: "16.5vw",
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
    note: "(180+)",
    paperSrc: "/history/online/paper/6.png",
  },
  {
    id: 7,
    href: "https://inkdabba-insta-profile-manager.vercel.app/rotn",
    label: "Rest of TN\nInfluencer",
    note: "(350+)",
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
    videoUrl: "https://www.youtube.com/embed/93Y_eCwdR5k?autoplay=1",
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
    inset: "clamp(calc(18*var(--u)), 2.4vw, calc(42*var(--u)))",
  },
  inner: {
    width: "min(calc(1840*var(--u)), 100%)",
    padding: "clamp(calc(34*var(--u)), 4vh, calc(56*var(--u))) clamp(calc(32*var(--u)), 3.6vw, calc(66*var(--u))) clamp(calc(32*var(--u)), 4vh, calc(58*var(--u)))",
    gap: "clamp(calc(22*var(--u)), 3.4vh, calc(36*var(--u)))",
  },
  grid: {
    gap: "clamp(calc(42*var(--u)), 6.8vh, calc(84*var(--u))) clamp(calc(28*var(--u)), 3.4vw, calc(62*var(--u)))",
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
