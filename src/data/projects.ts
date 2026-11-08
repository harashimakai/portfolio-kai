import type { Project } from "../types/project";
import thesisCover from "../assets/optimized/thesis-poster-final.webp";
import ashokanCover from "../assets/optimized/ashokan-reservoir.webp";
import icelandCover from "../assets/optimized/iceland.webp";
import backyard1Cover from "../assets/optimized/backyard-1-thumb.webp";
import backyard2Cover from "../assets/optimized/backyard-2-thumb.webp";
import backyard3Cover from "../assets/optimized/backyard-3-thumb.webp";
import notebooks1Cover from "../assets/optimized/notebook-comission-closeup.webp";

import thesisExpanded from "../assets/optimized/thesis-poster-flat-large.webp";
import backyard1Expanded from "../assets/optimized/backyard-1-large.webp";
import backyard2Expanded from "../assets/optimized/backyard-2-large.webp";
import backyard3Expanded from "../assets/optimized/backyard-3-large.webp";

export const projects: Project[] = [
  {
    id: "1",
    title:
      "Strategy, Subterfuge, and Deception - Science Communication via Graphic Design",
    shortTitle: "Strategy, Subterfuge, and Deception",
    medium: "GRAPHIC DESIGN",
    year: "2024",
    shortDescription:
      "A series of posters translating PhD-level cancer biology—oncogenes, immune evasion, checkpoint inhibition—into visual language. Hand-drawn prototypes refined in Adobe Illustrator over the course of a year.",
    thumbnailUrl: thesisCover,
    expandedUrl: thesisExpanded,
    imagePos: "center 30%",
  },
  {
    id: "2",
    title: "The Ashokan Reservoir",
    medium: "OIL ON CANVAS",
    year: "2022",
    shortDescription:
      "A monochromatic study of the Hudson River Valley landscape. Restraint of palette as a study in texture and value.",
    thumbnailUrl: ashokanCover,
    imagePos: "center 60%",
  },
  {
    id: "3",
    title: "The Icelandic Coastline",
    medium: "OIL ON CANVAS",
    year: "2024",
    shortDescription:
      "A white house holds its ground against primordial wind and stone — composition as unmoving defiance.",
    thumbnailUrl: icelandCover,
    imagePos: "center 35%",
  },
  {
    id: "4",
    title: "Scenes From My Backyard: I",
    medium: "OIL ON CANVAS",
    year: "2025",
    shortDescription:
      "A triptych study in texture, light, and composition. The first in a series drawn from photos of overlooked nature.",
    thumbnailUrl: backyard1Cover,
    expandedUrl: backyard1Expanded,
    imagePos: "center 55%",
  },
  {
    id: "5",
    title: "Scenes From My Backyard: II",
    medium: "OIL ON CANVAS",
    year: "2025",
    shortDescription:
      "Inspired by Rembrandt's baroque style: loose, gestural brushwork becomes depth and detail upon stepping back.",
    thumbnailUrl: backyard2Cover,
    expandedUrl: backyard2Expanded,
    imagePos: "center 100%",
  },
  {
    id: "6",
    title: "Scenes From My Backyard: III",
    medium: "OIL ON CANVAS",
    year: "2025",
    shortDescription:
      "Beauty at a minute scale. Most landscapes look to coastlines or mountain ranges, but small, meditative moments can be found everywhere—even right below our feet.",
    thumbnailUrl: backyard3Cover,
    expandedUrl: backyard3Expanded,
    imagePos: "center 70%",
    extra: true,
  },
  {
    id: "7",
    title: "Notebooks: Composition and Balance in Calligraphy",
    medium: "CALLIGRAPHY",
    year: "2025",
    shortDescription:
      "A study in flourishes, composition, and use of white space as restraint.",
    thumbnailUrl: notebooks1Cover,
    imagePos: "center 70%",
  },
];

const homeOrder = ["2", "3", "4", "5", "1", "6"];
const homePhoneOrder = ["3", "2", "1", "4", "5", "6"];
const expandedOrder = ["3", "2", "4", "5", "6", "1"];

const byId = Object.fromEntries(projects.map((p) => [p.id, p]));

export const homeProjects = homeOrder.map((id) => byId[id]);
export const homePhoneProjects = homePhoneOrder.map((id) => byId[id]);
export const expandedProjects = expandedOrder.map((id) => byId[id]);
