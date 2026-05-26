import thesisCover from "../../assets/project-covers/thesis-poster-final.webp";
import ashokanCover from "../../assets/project-covers/ashokan-reservoir.webp";
import icelandCover from "../../assets/project-covers/iceland.webp";
import icelandFullCover from "../../assets/full-images/iceland.webp";
import backyard1Cover from "../../assets/project-covers/backyard-1.webp";
import backyard2Cover from "../../assets/project-covers/backyard-2.webp";
import backyard3Cover from "../../assets/project-covers/backyard-3.webp";
import notebooks1Cover from "../../assets/project-covers/notebook-comission-closeup.webp";
import ledSignCover from "../../assets/project-covers/led-sign.webp";

import thesisExpanded from "../../assets/full-images/thesis-poster-flat.webp";
import ashokanExpanded from "../../assets/full-images/ashokan-reservoir.webp";
import backyard1Expanded from "../../assets/full-images/backyard-1.webp";
import backyard2Expanded from "../../assets/full-images/backyard-2.webp";
import backyard3Expanded from "../../assets/full-images/backyard-3.webp";
import notebooks1Expanded from "../../assets/full-images/notebook-comission-closeup.webp";
import ledSignExpanded from "../../assets/full-images/led-sign.webp";

export interface Project {
  id: string;
  title: string;
  slug: string;
  medium: string;
  year: string;
  shortDescription: string;
  fullDescription?: string;
  thumbnailUrl: string;
  mosaicThumbnailUrl?: string;
  expandedUrl: string;
  imagePos?: string;
  grid: string;
  mainFont: string;
  secondFont: string;
  letterSpacing: string;
  height?: string;
  category: string;
  onHome: boolean;
  onWork: boolean;
}

export const projects: Project[] = [
  {
    id: "1",
    title:
      "Strategy, Subterfuge, and Deception - Science Communication via Graphic Design",
    slug: "/work/1",
    medium: "GRAPHIC DESIGN",
    year: "2024",
    shortDescription:
      "A series of posters translating PhD-level cancer biology—oncogenes, immune evasion, checkpoint inhibition—into visual language. Hand-drawn prototypes refined in Adobe Illustrator over the course of a year.",
    thumbnailUrl: thesisCover,
    expandedUrl: thesisExpanded,
    grid: "span 8",
    mainFont: "32px",
    secondFont: "17px",
    letterSpacing: "-0.16px",
    category: "DESIGN",
    onHome: true,
    onWork: true,
  },
  {
    id: "2",
    title: "The Ashokan Reservoir",
    slug: "/work/2",
    medium: "OIL ON CANVAS",
    year: "2022",
    shortDescription:
      "A monochromatic stdy of the Hudson River Valley landscape. Restraint of palette as a study in texture and value.",
    thumbnailUrl: ashokanCover,
    expandedUrl: ashokanExpanded,
    grid: "span 4",
    mainFont: "22px",
    secondFont: "15px",
    letterSpacing: "-0.11px",
    category: "PAINTING",
    onHome: true,
    onWork: true,
  },
  {
    id: "3",
    title: "The Icelandic Coastline",
    slug: "/work/3",
    medium: "OIL ON CANVAS",
    year: "2024",
    shortDescription:
      "A white house holds its ground against primordial wind and sstone — composition as unmoving defiance.",
    thumbnailUrl: icelandCover,
    mosaicThumbnailUrl: icelandFullCover,
    expandedUrl: icelandFullCover,
    grid: "span 4",
    mainFont: "22px",
    secondFont: "15px",
    letterSpacing: "-0.11px",
    height: "fit-content",
    category: "PAINTING",
    onHome: true,
    onWork: true,
  },
  {
    id: "4",
    title: "Scenes From My Backyard: I",
    slug: "/work/4",
    medium: "OIL ON CANVAS",
    year: "2025",
    shortDescription:
      "A triptych study in texture, light, and composition. The first in a series drawn from photos of overlooked nature.",
    thumbnailUrl: backyard1Cover,
    expandedUrl: backyard1Expanded,
    grid: "span 4",
    mainFont: "22px",
    secondFont: "15px",
    letterSpacing: "-0.11px",
    category: "PAINTING",
    onHome: true,
    onWork: true,
  },
  {
    id: "5",
    title: "Scenes From My Backyard: II",
    slug: "/work/5",
    medium: "OIL ON CANVAS",
    year: "2025",
    shortDescription:
      "Inspired by Rembrandt's baroque style: loose, gestural brushwork becomes depth and detail upon stepping back.",
    thumbnailUrl: backyard2Cover,
    expandedUrl: backyard2Expanded,
    grid: "span 4",
    mainFont: "22px",
    secondFont: "15px",
    letterSpacing: "-0.11px",
    category: "PAINTING",
    onHome: true,
    onWork: true,
  },
  {
    id: "6",
    title: "Scenes From My Backyard: III",
    slug: "/work/6",
    medium: "OIL ON CANVAS",
    year: "2025",
    shortDescription:
      "Beauty at a minute scale. Most landscapes look to coastlines or mountain ranges, but small, meditative moments can be found everywhere—even right below our feet.",
    thumbnailUrl: backyard3Cover,
    expandedUrl: backyard3Expanded,
    grid: "span 4",
    mainFont: "22px",
    secondFont: "15px",
    letterSpacing: "-0.11px",
    category: "PAINTING",
    onHome: true,
    onWork: true,
  },
  {
    id: "7",
    title: "Notebooks: Composition and Balance in Calligraphy",
    slug: "/work/7",
    medium: "CALLIGRAPHY",
    year: "2025",
    shortDescription:
      "A study in flourishes, composition, and use of white space as restraint.",
    thumbnailUrl: notebooks1Cover,
    expandedUrl: notebooks1Expanded,
    grid: "span 4",
    mainFont: "22px",
    secondFont: "15px",
    letterSpacing: "-0.11px",
    category: "CALLIGRAPHY",
    onHome: false,
    onWork: true,
  },
  {
    id: "9",
    title: "connect - Merging Fine Arts and Fabrication",
    slug: "/work/9",
    medium: "CNC · Soldering · Illustrator",
    year: "2023",
    shortDescription:
      "A single word — connect — translated from pen to vector to engraved oak and LED. An exercise in carrying one idea across four mediums.",
    thumbnailUrl: ledSignCover,
    expandedUrl: ledSignExpanded,
    grid: "span 4",
    mainFont: "22px",
    secondFont: "15px",
    letterSpacing: "-0.11px",
    category: "FABRICATION",
    onHome: false,
    onWork: true,
  },
];

// Display order for each context
export const homeOrder = ["1", "2", "3", "4", "5", "6"];
export const mosaicOrder = ["1", "3", "4", "5", "6", "2", "7", "9"];
export const workOrder = ["4", "5", "6", "1", "3", "2", "7", "9"];

const byId = Object.fromEntries(projects.map((p) => [p.id, p]));

export const homeProjects = homeOrder.map((id) => byId[id]);
export const mosaicProjects = mosaicOrder.map((id) => byId[id]);
export const workProjects = workOrder.map((id) => byId[id]);
