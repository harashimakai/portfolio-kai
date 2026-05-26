import { useEffect } from "react";

import "../css/home.css";

import Mission from "../components/home/Mission";
import SectionDiv from "../components/global/SectionDiv";
import ProjectGrid from "../components/home/ProjectGrid";
import CaseStudyCard from "../components/individual/CaseStudyCard";

import { putmeon } from "../components/individual/StudyData";
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
      <SectionDiv
        left="// FEATURED CASE STUDY"
        right="UX · FEB 2026"
        strong={true}
      />
      <section className="case-content">
        <CaseStudyCard item={putmeon} />
      </section>
      <SectionDiv left="// 02 — SELECTED WORK" right="09 WORKS · 2022—2026" />
      <ProjectGrid />
    </>
  );
}
