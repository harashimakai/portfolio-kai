import { useEffect } from "react";
import { motion } from "motion/react";

import "../css/home.css";

import Mission from "../components/home/Mission";
import SectionDiv from "../components/global/SectionDiv";
import ProjectGrid from "../components/home/ProjectGrid";
import CaseStudyCard from "../components/individual/CaseStudyCard";

import { putmeon } from "../components/individual/StudyData";
import ArtStrip from "../components/home/ArtStrip";
import { children_custom } from "../components/global/AnimationConsts";

interface Props {
  setSideOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Home({ setSideOpen }: Props) {
  useEffect(() => {
    window.scrollTo(0, 0);
    setSideOpen(false);
  }, []);

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
