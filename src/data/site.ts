import { studyPaths } from "./caseStudies";

export const INTRO =
  "I’m Kai, a student at Cornell exploring the intersection of computer science and design.";

export interface NavItem {
  to: string;
  label: string;
  alsoActive?: string[];
}

export const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "HOME" },
  { to: "/work", label: "WORK", alsoActive: studyPaths },
  { to: "/art", label: "ART" },
  { to: "/about", label: "ABOUT" },
];

export const EMAILS = {
  school: "kh862@cornell.edu",
  personal: "harashimakai@gmail.com",
};

export const LINKS = {
  resume:
    "https://drive.google.com/file/d/11wb1SoarL96mU4PIX8ObmXxljO8bAm7y/view?usp=sharing",
  instagram: "https://www.instagram.com/kaiharashima/",
  linkedin: "https://www.linkedin.com/in/kai-harashima-109164364",
  github: "https://github.com/harashimakai",
  dti: "https://new.cornelldti.org/",
};

export const SOCIALS = [
  { label: "Instagram", href: LINKS.instagram },
  { label: "LinkedIn", href: LINKS.linkedin },
  { label: "Github", href: LINKS.github },
];
