import type { CSSProperties } from "react";

export type CSSVariableStyle = CSSProperties & {
  [key: `--${string}`]: string;
};

export type HistoryPanel = "online" | "offline" | "ideas";

export type HistoryStickyNote = {
  alt: string;
  delay: number;
  href?: string;
  label: string;
  labelDelay: number;
  labelStyle: CSSVariableStyle;
  panel?: HistoryPanel;
  rotate: number;
  src: string;
  style: CSSProperties;
};
