import { useEffect } from "react";
import { motion } from "motion/react";

import "../css/home.css";

import Mission from "../components/home/Mission";
import SectionDiv from "../components/global/SectionDiv";
import ProjectGrid from "../components/home/ProjectGrid";
import CaseStudyCard from "../components/individual/CaseStudyCard";

import { putmeon } from "../components/individual/StudyData";
import { homeProjects } from "../components/global/ProjectData";
import ArtStrip from "../components/home/ArtStrip";
import { children_custom } from "../components/global/AnimationConsts";
import usePreload from "../components/global/usePreload";

/* What the first screen needs before its entrances play. */
const firstScreen = [
  putmeon.thumbnailUrl,
  ...homeProjects.map((p) => p.thumbnailUrl),
];

interface Props {
  setSideOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Home({ setSideOpen }: Props) {
  const ready = usePreload(firstScreen);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSideOpen(false);
  }, []);

  if (!ready) return null;

  return (
    <>
      <Mission />
      <section className="home-case-content">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={children_custom}
          custom={0.1}
        >
          <CaseStudyCard item={putmeon} />
        </motion.div>
      </section>
      <SectionDiv />
      <ArtStrip />
    </>
  );
}
