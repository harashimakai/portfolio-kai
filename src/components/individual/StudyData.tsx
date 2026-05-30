import type { ReactNode } from "react";
import pmo_brainstorming from "../../assets/case-studies/putmeon/brainstorming.jpg";
import pmo_wire1 from "../../assets/case-studies/putmeon/wireframe1.jpg";
import pmo_wire2 from "../../assets/case-studies/putmeon/wireframe2.jpg";
import pmo_wire3 from "../../assets/case-studies/putmeon/wireframe3.jpg";
import pmo_cover from "../../assets/case-studies/putmeon/cover.png";
import pmo_logo from "../../assets/case-studies/putmeon/putmeonl.png";
import pmo_logo_alt from "../../assets/case-studies/putmeon/putmeon.png";

export type StudyTheme = {
  // Fonts
  "--cs-font-primary": string;
  "--cs-font-secondary": string;
  // Backgrounds
  "--cs-bg": string;
  "--cs-bg-soft": string;
  "--cs-bg-panel": string;
  // Light surface
  "--cs-surface": string;
  "--cs-surface-soft": string;
  // Text on dark bg
  "--cs-text": string;
  "--cs-text-muted": string;
  // Text on light bg
  "--cs-text-alt": string;
  "--cs-text-alt-muted": string;
  // Accent
  "--cs-accent": string;
  "--cs-accent-soft": string;
  // Rules / dividers
  "--cs-rule": string;
  "--cs-rule-alt": string;
};

export interface Study {
  id: string;
  title: string;
  date: string;
  dateSpecific: string;
  context: string;
  role: string;
  tools: string;
  scope: string;
  timeline: string;
  theme: StudyTheme;
  thumbnailUrl: string;
  logoUrl: string;
  altLogoUrl?: string;
  logoWidth: number;
  subheading: string;
  desc: ReactNode;
  slug?: string;
  sectionNum: string;
}

const putmeonTheme: StudyTheme = {
  "--cs-font-primary": "var(--font-sans)",
  "--cs-font-secondary":
    '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
  "--cs-bg": "#1b1b1f",
  "--cs-bg-soft": "#27272a",
  "--cs-bg-panel": "#222225",
  "--cs-surface": "#f4efe7",
  "--cs-surface-soft": "#ede5d4",
  "--cs-text": "#f5ebd9",
  "--cs-text-muted": "#7a7a78",
  "--cs-text-alt": "#1a1a1c",
  "--cs-text-alt-muted": "#737065",
  "--cs-accent": "#d39354",
  "--cs-accent-soft": "#ffd2a6",
  "--cs-rule": "rgba(245,235,217,0.18)",
  "--cs-rule-alt": "rgba(26,26,28,0.18)",
};
/*
  cream: "#f1ebdc",
  creamSoft: "#e8e0cd",
  ink: "#1a1a1c",
  inkSoft: "#27272a",
  inkPanel: "#222225",
  textOnDark: "#f5ebd9",
  textOnDarkMuted: "#7a7a78",
  textOnCream: "#1a1a1c",
  textOnCreamMuted: "#737065",
  amber: "#d97c2a",
  amberSoft: "#e8a766",
  rule: "rgba(245,235,217,0.18)",
  ruleCream: "rgba(26,26,28,0.18)",
  */

export const putmeon: Study = {
  id: "01",
  title: "Put Me On",
  date: "FEB 2026",
  dateSpecific: "02/05/2026",
  context: "SOLO",
  role: "UX Designer (Solo)",
  tools: "Figma",
  scope: "UX Research, Visual Design, Prototyping",
  timeline: "2 Weeks",
  theme: putmeonTheme,
  thumbnailUrl: pmo_cover,
  logoUrl: pmo_logo,
  altLogoUrl: pmo_logo_alt,
  logoWidth: 470,
  subheading: "a social music discovery platform / case study",
  desc: (
    <>
      Help users{" "}
      <span className="case-accent">escape repetitive listening</span> habits
      and <span className="case-accent">discover new music</span> through
      friends and fellow music lovers. From problem framing through user
      research, lo-fi wireframes and hi-fi prototypes in Figma.
    </>
  ),
  slug: "/putmeon",
  sectionNum: "5",
};
