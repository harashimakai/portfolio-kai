import type { ReactNode } from "react";
import pmo_brainstorming from "../../assets/case-studies/putmeon/brainstorming.jpg";
import pmo_wire1 from "../../assets/case-studies/putmeon/wireframe1.jpg";
import pmo_wire2 from "../../assets/case-studies/putmeon/wireframe2.jpg";
import pmo_wire3 from "../../assets/case-studies/putmeon/wireframe3.jpg";
import pmo_account1 from "../../assets/case-studies/putmeon/account1.png";
import pmo_account2 from "../../assets/case-studies/putmeon/account2.png";
import pmo_account3 from "../../assets/case-studies/putmeon/account3.png";
import pmo_home1 from "../../assets/case-studies/putmeon/home1.png";
import pmo_home2 from "../../assets/case-studies/putmeon/home2.png";
import pmo_home3 from "../../assets/case-studies/putmeon/home3.png";
import pmo_library from "../../assets/case-studies/putmeon/Library.png";
import pmo_onboarding from "../../assets/case-studies/putmeon/onboarding.png";
import pmo_cover from "../../assets/case-studies/putmeon/cover.png";
import pmo_gradient from "../../assets/case-studies/putmeon/gradient.png";
import pmo_logo from "../../assets/case-studies/putmeon/putmeonl.png";

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
  sub: string;
  theme: StudyTheme;
  thumbnailUrl: string;
  logoUrl: string;
  logoHeight: number;
  subheading: string;
  desc: ReactNode;
  slug: string;
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
  "--cs-surface-soft": "#e8e0cd",
  "--cs-text": "#f5ebd9",
  "--cs-text-muted": "#7a7a78",
  "--cs-text-alt": "#1a1a1c",
  "--cs-text-alt-muted": "#737065",
  "--cs-accent": "#d39354",
  "--cs-accent-soft": "#ffd2a6",
  "--cs-rule": "rgba(245,235,217,0.18)",
  "--cs-rule-alt": "rgba(26,26,28,0.18)",
};

export const putmeon: Study = {
  id: "01",
  title: "Put Me On",
  sub: "UI/UX · FEB 2026 · SOLO",
  theme: putmeonTheme,
  thumbnailUrl: pmo_cover,
  logoUrl: pmo_logo,
  logoHeight: 88,
  subheading: "a social music discovery platform / case study",
  desc: (
    <>
      Help users{" "}
      <span className="card-desc-bold">escape repetitive listening</span> habits
      and <span className="card-desc-bold">discover new music</span> through
      friends and fellow music lovers. From problem framing through user
      research, lo-fi wireframes and hi-fi prototypes in Figma.
    </>
  ),
  slug: "/case/1",
  sectionNum: "5",
};

export const cuaptsllm: Study = {
  id: "02",
  title: "CUApts AI/LLM Search Feature",
  sub: "UI/UX · MAY 2026 · CORNELL DTI - APTS",
  theme: putmeonTheme,
  thumbnailUrl: pmo_cover,
  logoUrl: pmo_logo,
  logoHeight: 88,
  subheading: "a social music discovery platform / case study",
  desc: (
    <>
      Help users{" "}
      <span className="card-desc-bold">escape repetitive listening</span> habits
      and <span className="card-desc-bold">discover new music</span> thorugh
      friends and fellow music lovers. From problem framing through user
      research, lo-fi wireframes and hi-fi prototypes in Figma.
    </>
  ),
  slug: "/case/2",
  sectionNum: "5",
};
