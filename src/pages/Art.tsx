import { useState, useEffect } from "react";
import { motion } from "motion/react";

import { mosaicProjects, workProjects } from "../components/global/ProjectData";
import "../css/work.css";

import ProjectGrid from "../components/home/ProjectGrid";
import SectionDiv from "../components/global/SectionDiv";
import CaseStudyCard from "../components/individual/CaseStudyCard";
import { putmeon } from "../components/individual/StudyData";
import { projects } from "../components/global/ProjectData";
import ChapterHeading from "../components/work/ChapterHeading";
import { children_custom } from "../components/global/AnimationConsts";
import Splash from "../components/old/Splash";

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
      ? mosaicProjects
      : workProjects.filter((p) => p.category === activeFilter);

  return (
    <>
      <ChapterHeading
        id="selected-works"
        chapter="THE PORTFOLIO"
        subtitle={`VOL. II · FINE ARTS · VIII WORKS`}
        intro={
          <>
            <span className="italic">Across</span> mediums.
          </>
        }
        filters={["ALL", "PAINTING", "DESIGN", "CALLIGRAPHY", "FABRICATION"]}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      <SectionDiv
        left="2022 — 2026"
        right="FINE ARTS"
      />
      <ProjectGrid
        key={activeFilter}
        projects={filteredProjects}
        variant={activeFilter === "ALL" ? "mosaic" : "home"}
      />
    </>
  );
}
