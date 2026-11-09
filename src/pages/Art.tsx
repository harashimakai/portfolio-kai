import { useState } from "react";

import { expandedProjects } from "../data/projects";
import ArtGallery, {
  type GalleryRow,
  type TileLayout,
} from "../features/art/ArtGallery";
import Lightbox from "../components/ui/Lightbox";
import usePreload from "../hooks/usePreload";

// Layout

const fit = "calc(100dvh - var(--nav-height) - 2 * var(--space-gap) - 64px)";

const rows: GalleryRow[] = [
  {
    kind: "feature",
    natural: "3",
    crop: "2",
    naturalFirst: true,
    height: fit,
    ratio: "738 / 1064",
  },
  { kind: "mosaic", ids: ["4", "5", "6"] },
  { kind: "mosaic", ids: ["1"], columns: "minmax(0, 1fr)" },
];

const layout: Record<string, TileLayout> = {
  "4": { aspect: "4 / 5" },
  "5": { aspect: "4 / 5" },
  "6": { aspect: "4 / 5" },
  "1": {
    image: "expanded",
    aspect: "1.65",
    position: "center 60%",
    naturalOnPhones: true,
  },
};

const thumbnails = expandedProjects.map((p) => p.thumbnailUrl);

// Page

export default function Art() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ready = usePreload(thumbnails);

  if (!ready) return <div className="page-pending" />;

  return (
    <>
      <h1 className="visually-hidden">Art</h1>
      <ArtGallery
        projects={expandedProjects}
        onOpen={setOpenIndex}
        rows={rows}
        layout={layout}
      />
      <Lightbox
        projects={expandedProjects}
        index={openIndex}
        onChange={setOpenIndex}
      />
    </>
  );
}
