import templateContent from "./content/template.json";
import type { StudyContent, StudyDef } from "../types/caseStudy";

const placeholder = (label: string, width: number, height: number) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
      `<rect width="100%" height="100%" fill="#8a8d83" fill-opacity="0.16"/>` +
      `<rect x="2" y="2" width="${width - 4}" height="${height - 4}" fill="none" stroke="#8a8d83" stroke-opacity="0.55" stroke-width="2" stroke-dasharray="10 10"/>` +
      `<text x="50%" y="50%" fill="#8a8d83" font-family="Helvetica, Arial, sans-serif" font-size="${Math.round(width / 20)}" letter-spacing="3" text-anchor="middle" dominant-baseline="middle">${label}</text>` +
      `</svg>`,
  )}`;

const phone = (label: string) => placeholder(label, 390, 844);
const logo = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>`,
)}`;
const landscape = (label: string) => placeholder(label, 1600, 1000);

const logoSvg =
  `<svg viewBox="0 0 720 150" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">` +
  `<text x="0" y="104" fill="currentColor" style="font-family: var(--font-serif); font-size: 120px;">Project Name</text>` +
  `</svg>`;

export const templateStudy: StudyDef = {
  slug: "template",
  title: "Case study template",
  path: "/template",
  content: templateContent as StudyContent,
  assets: {
    phone1: { src: phone("SCREEN 1") },
    phone2: { src: phone("SCREEN 2") },
    phone3: { src: phone("SCREEN 3") },
    wide: { src: landscape("HERO MOCKUP") },
    decision1: { src: landscape("DECISION 01") },
    decision2: { src: landscape("DECISION 02") },
    optionA: { src: landscape("OPTION A") },
    optionB: { src: landscape("OPTION B") },
    optionC: { src: landscape("OPTION C") },
    demo: { src: "", poster: landscape("VIDEO") },
    logo: { src: logo },
    heroVideo: { src: "", poster: placeholder("HERO VIDEO", 1600, 900) },
  },
  logoSvg,
  card: {
    date: "Month Year",
    context: "Context",
    thumbnailUrl: landscape("COVER"),
    subheading: "a one-line description / case study",
  },
};
