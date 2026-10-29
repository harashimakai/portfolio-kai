import { useState, useEffect } from "react";

import { expandedProjects } from "../components/global/ProjectData";
import ArtGallery, { GalleryRow, TileLayout } from "../components/art/ArtGallery";
import Lightbox from "../components/art/Lightbox";
import usePreload from "../components/global/usePreload";

interface Props {
  setSideOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/* Row 1: Iceland (738 x 1064) full height beside Ashokan. The row is
   capped so the first screen shows it whole below the nav with the top
   64px of the next row peeking in; Iceland shows uncropped at that
   height and Ashokan fills the remaining width, cropping to fit.
   Row 2: the three backyard paintings, cropped alike so they align.
   Row 3: thesis poster (60%, cropped) beside the calligraphy piece (40%,
   uncropped).                                                              */

/* The sticky nav, the gallery's top padding and the row gap (both
   --space-gap), and a 64px glimpse of the row below.                      */
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
  { kind: "feature", crop: "1", natural: "7" },
];

const layout: Record<string, TileLayout> = {
  "4": { aspect: "4 / 5" },
  "5": { aspect: "4 / 5" },
  "6": { aspect: "4 / 5" },
};

export default function Art({ setSideOpen }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ready = usePreload(expandedProjects.map((p) => p.thumbnailUrl));

  useEffect(() => {
    window.scrollTo(0, 0);
    setSideOpen(false);
  }, []);

  if (!ready) return null;

  return (
    <>
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
