import type { StudyContent, Asset } from "../components/study/StudyPage";
import putmeonContent from "../content/putmeon.json";

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
import wordmark from "../assets/case-studies/putmeon/putmeon.png";
import wordmarkDark from "../assets/case-studies/putmeon/putmeonl.png";

/* One entry per case study. To add one: write src/content/<slug>.json
   (copy an existing file for the shape), import its images here, and
   add an entry. The page, the editor and the /work/<slug> route follow. */
export interface StudyDef {
  slug: string;
  title: string;
  content: StudyContent;
  assets: Record<string, Asset>;
  logo: string;
  logoDark: string;
  /* Hero gradient stops in each palette; see study.css for the fade. */
  theme?: { light: [string, string]; dark: [string, string] };
}

export const studies: Record<string, StudyDef> = {
  putmeon: {
    slug: "putmeon",
    title: "Put Me On",
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
    logo: wordmark,
    logoDark: wordmarkDark,
  },
};
