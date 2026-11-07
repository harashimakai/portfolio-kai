import type { StudyCard, StudyContent, StudyDef } from "../types/caseStudy";
import putmeonContent from "./content/putmeon.json";

import home1 from "../assets/optimized/putmeon-home1.webp";
import home2 from "../assets/optimized/putmeon-home2.webp";
import home3 from "../assets/optimized/putmeon-home3.webp";
import homePopup from "../assets/optimized/putmeon-home-popup.webp";
import account1 from "../assets/optimized/putmeon-account1.webp";
import account2 from "../assets/optimized/putmeon-account2.webp";
import account3 from "../assets/optimized/putmeon-account3.webp";
import library from "../assets/optimized/putmeon-library.webp";
import onboarding from "../assets/optimized/putmeon-onboarding.webp";
import demo from "../assets/case-studies/putmeon/demo.mp4";
import demoPoster from "../assets/optimized/putmeon-demo-poster.webp";
import wordmark from "../assets/case-studies/putmeon/wordmark.svg?raw";
import cover from "../assets/optimized/putmeon-cover.webp";

export const studyList: StudyDef[] = [
  {
    slug: "putmeon",
    title: "Put Me On",
    path: "/putmeon",
    content: putmeonContent as StudyContent,
    assets: {
      home1: { src: home1 },
      home2: { src: home2 },
      home3: { src: home3 },
      homePopup: { src: homePopup },
      account1: { src: account1 },
      account2: { src: account2 },
      account3: { src: account3 },
      library: { src: library },
      onboarding: { src: onboarding },
      demo: { src: demo, poster: demoPoster },
    },
    logoSvg: wordmark,
    featured: true,
    card: {
      date: "FEB 2026",
      context: "INDEPENDENT",
      thumbnailUrl: cover,
      subheading: "a social music discovery platform / case study",
    },
  },
];

export const studyPath = (d: StudyDef) => d.path ?? `/work/${d.slug}`;

export const studyPaths = studyList.map(studyPath);

export function studyForPath(pathname: string): StudyDef | undefined {
  const clean = pathname.replace(/\/+$/, "") || "/";
  return studyList.find((d) => studyPath(d) === clean);
}

export const toCard = (d: StudyDef): StudyCard => ({
  ...d.card,
  title: d.title,
  slug: studyPath(d),
});
