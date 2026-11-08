import type { StudyCard, StudyContent, StudyDef } from "../types/caseStudy";
import putmeonContent from "./content/putmeon.json";
import cuaptsContent from "./content/cuapts.json";

import home1 from "../assets/optimized/putmeon-home1.webp";
import home2 from "../assets/optimized/putmeon-home2.webp";
import home3 from "../assets/case-studies/putmeon/home3.mp4";
import home3Poster from "../assets/optimized/putmeon-home3-poster.webp";
import homePopup from "../assets/optimized/putmeon-home-popup.webp";
import account1 from "../assets/optimized/putmeon-account1.webp";
import account2 from "../assets/optimized/putmeon-account2.webp";
import account3 from "../assets/case-studies/putmeon/account3.mp4";
import account3Poster from "../assets/optimized/putmeon-account3-poster.webp";
import library from "../assets/optimized/putmeon-library.webp";
import onboarding from "../assets/case-studies/putmeon/onboarding.mp4";
import onboardingPoster from "../assets/optimized/putmeon-onboarding-poster.webp";
import demo from "../assets/case-studies/putmeon/demo.mp4";
import demoPoster from "../assets/optimized/putmeon-demo-poster.webp";
import wordmark from "../assets/case-studies/putmeon/wordmark.svg?raw";
import cover from "../assets/case-studies/putmeon/cover.mp4";
import coverPoster from "../assets/optimized/putmeon-cover-poster.webp";

import cuaptsResults from "../assets/optimized/cuapts-results.webp";
import cuaptsBreakdown from "../assets/optimized/cuapts-results-breakdown.webp";
import cuaptsAiPageV1 from "../assets/optimized/cuapts-ai-page-v1.webp";
import cuaptsModeSwitch from "../assets/optimized/cuapts-mode-switch.webp";
import cuaptsInlineQuotes from "../assets/optimized/cuapts-inline-quotes.webp";
import cuaptsListingCards from "../assets/optimized/cuapts-listing-cards.webp";
import cuaptsLofi from "../assets/optimized/cuapts-lofi.webp";
import cuaptsGrid from "../assets/optimized/cuapts-grid.webp";
import cuaptsTextAnswer from "../assets/optimized/cuapts-text-answer.webp";
import cuaptsComposed from "../assets/optimized/cuapts-answer-composed.webp";
import logoClaude from "../assets/case-studies/cuapts/logos/claude.svg";
import logoChatgpt from "../assets/case-studies/cuapts/logos/openai.svg";
import logoPerplexity from "../assets/case-studies/cuapts/logos/perplexity.svg";
import logoGoogle from "../assets/case-studies/cuapts/logos/google.svg";
import cuaptsCover from "../assets/case-studies/cuapts/cover.mp4";
import cuaptsCoverPoster from "../assets/optimized/cuapts-cover-poster.webp";
import cuaptsLogo from "../assets/case-studies/cuapts/logo.svg?raw";

export const studyList: StudyDef[] = [
  {
    slug: "cuapts",
    title: "CUApts",
    path: "/cuapts",
    content: cuaptsContent as StudyContent,
    assets: {
      cover: { src: cuaptsCover, poster: cuaptsCoverPoster },
      results: { src: cuaptsResults },
      breakdown: { src: cuaptsBreakdown },
      aiPageV1: { src: cuaptsAiPageV1 },
      modeSwitch: { src: cuaptsModeSwitch },
      inlineQuotes: { src: cuaptsInlineQuotes },
      listingCards: { src: cuaptsListingCards },
      lofi: { src: cuaptsLofi },
      grid: { src: cuaptsGrid },
      textAnswer: { src: cuaptsTextAnswer },
      composed: { src: cuaptsComposed },
      logoClaude: { src: logoClaude },
      logoChatgpt: { src: logoChatgpt },
      logoPerplexity: { src: logoPerplexity },
      logoGoogle: { src: logoGoogle },
    },
    logoSvg: cuaptsLogo,
    card: {
      date: "Spring 2026",
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
    content: putmeonContent as StudyContent,
    assets: {
      home1: { src: home1 },
      home2: { src: home2 },
      home3: { src: home3, poster: home3Poster },
      homePopup: { src: homePopup },
      account1: { src: account1 },
      account2: { src: account2 },
      account3: { src: account3, poster: account3Poster },
      library: { src: library },
      onboarding: { src: onboarding, poster: onboardingPoster },
      demo: { src: demo, poster: demoPoster },
    },
    logoSvg: wordmark,
    card: {
      date: "Feb 2026",
      context: "Concept",
      thumbnailUrl: coverPoster,
      video: cover,
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
