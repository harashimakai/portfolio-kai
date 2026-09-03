import { useState, useEffect } from "react";

import { expandedProjects } from "../components/global/ProjectData";
import "../css/work.css";

import ProjectGrid from "../components/home/ProjectGrid";
import SectionDiv from "../components/global/SectionDiv";
import ChapterHeading from "../components/work/ChapterHeading";

interface Props {
  setSideOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Art({ setSideOpen }: Props) {
  const [activeFilter, setActiveFilter] = useState("ALL");

  useEffect(() => {
    window.scrollTo(0, 0);
    setSideOpen(false);
  }, []);

  const filteredProjects =
    activeFilter === "ALL"
      ? expandedProjects
      : expandedProjects.filter((p) => p.category === activeFilter);

  return (
    <>
      <ChapterHeading
        id="selected-works"
        chapter="ARTWORKS"
        intro={<>Across mediums.</>}
        filters={["ALL", "PAINTING", "DESIGN", "CALLIGRAPHY", "FABRICATION"]}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      <SectionDiv />
      <ProjectGrid
        key={activeFilter}
        projects={filteredProjects}
      />
    </>
  );
}
