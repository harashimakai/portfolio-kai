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

interface Props {
  setSideOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Work({ setSideOpen }: Props) {
  const [activeFilter, setActiveFilter] = useState("ALL");

  useEffect(() => {
    window.scrollTo(0, 0);
    setSideOpen(false);
  }, []);

  return (
    <>
      <ChapterHeading
        id="case-studies"
        chapter="CASE STUDIES"
        subtitle="VOL. I · FIGMA · I STUDY"
        intro={
          <>
            An <span className="italic alternative_b">exploration</span> into
            how user research shapes design.
          </>
        }
        sub={
          <>Designing end-to-end, from lo-fi sketches to developer handoff.</>
        }
      />
      <SectionDiv
        left="2026"
        right="UX & PRODUCT"
      />
      <section className="case-content">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={children_custom}
          custom={0.6}
        >
          <CaseStudyCard item={putmeon} />
        </motion.div>
      </section>
    </>
  );
}
