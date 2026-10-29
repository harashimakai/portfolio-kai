import pmo_cover from "../../assets/optimized/putmeon-cover.webp";

export interface Study {
  id: string;
  title: string;
  date: string;
  context: string;
  role: string;
  tools: string;
  scope: string;
  timeline: string;
  thumbnailUrl: string;
  subheading: string;
  /* Route of the case study page, or an external link. */
  slug: string;
}

export const putmeon: Study = {
  id: "01",
  title: "Put Me On",
  date: "FEB 2026",
  context: "INDEPENDENT",
  role: "UX Designer (solo)",
  tools: "Figma",
  scope: "UX research, visual design, prototyping",
  timeline: "2 Weeks",
  thumbnailUrl: pmo_cover,
  subheading: "a social music discovery platform / case study",
  slug: "/putmeon",
};
