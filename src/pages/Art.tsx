import { useState, useEffect } from "react";

import { expandedProjects } from "../components/global/ProjectData";
import ArtGallery, { TileLayout } from "../components/art/ArtGallery";
import Lightbox from "../components/art/Lightbox";

interface Props {
  setSideOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/* Row 1: thesis poster (60%, cropped) beside Iceland (40%, uncropped).
   Row 2: the three backyard paintings, cropped alike so they align.
   Row 3: Ashokan at natural proportions; the calligraphy and LED pieces
   are cropped to Ashokan's ratio (829 x 947) so the row is level.          */
const layout: Record<string, TileLayout> = {
  "4": { aspect: "4 / 5" },
  "5": { aspect: "4 / 5" },
  "6": { aspect: "4 / 5" },
  "7": { aspect: "829 / 947" },
  "9": { aspect: "829 / 947" },
};

export default function Art({ setSideOpen }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSideOpen(false);
  }, []);

  return (
    <>
      <ArtGallery
        projects={expandedProjects}
        onOpen={setOpenIndex}
        layout={layout}
        feature={{ crop: "1", natural: "3" }}
      />
      <Lightbox
        projects={expandedProjects}
        index={openIndex}
        onChange={setOpenIndex}
      />
    </>
  );
}
