import type { ComponentType } from "react";

import type { StudyCard } from "../types/caseStudy";

import putmeonCover from "../assets/case-studies/putmeon/cover.mp4";
import putmeonCoverPoster from "../assets/optimized/putmeon-cover-poster.webp";
import cuaptsCover from "../assets/case-studies/cuapts/cover.mp4";
import cuaptsCoverPoster from "../assets/optimized/cuapts-cover-poster.webp";

// Types

export interface StudyDef {
  slug: string;
  title: string;
  path: string;
  load: () => Promise<{ default: ComponentType }>;
  card: Omit<StudyCard, "title" | "slug" | "palette">;
}

// Studies

export const studyList: StudyDef[] = [
  {
    slug: "cuapts",
    title: "CUApts",
    path: "/cuapts",
    load: () => import("../pages/case-studies/CuApts"),
    card: {
      date: "Fall 2026",
      context: "Cornell DTI",
      thumbnailUrl: cuaptsCoverPoster,
      video: cuaptsCover,
      subheading: "Helping college students navigate housing with AI",
    },
  },
  {
    slug: "putmeon",
    title: "Put Me On",
    path: "/putmeon",
    load: () => import("../pages/case-studies/PutMeOn"),
    card: {
      date: "Spring 2026",
      context: "Concept",
      thumbnailUrl: putmeonCoverPoster,
      video: putmeonCover,
      subheading: "a social music discovery platform & case study",
    },
  },
];

// Helpers

export const studyPaths = studyList.map((d) => d.path);

export function studyForPath(pathname: string): StudyDef | undefined {
  const clean = pathname.replace(/\/+$/, "") || "/";
  return studyList.find((d) => d.path === clean);
}

export const toCard = (d: StudyDef): StudyCard => ({
  ...d.card,
  title: d.title,
  slug: d.path,
  palette: `palette-${d.slug}`,
});
