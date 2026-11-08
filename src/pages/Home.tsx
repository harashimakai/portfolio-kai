
import HomeIntro from "../features/home/HomeIntro";
import SectionDivider from "../components/ui/SectionDivider";
import CaseStudyList from "../features/case-study/CaseStudyList";

import { studyList, toCard } from "../data/caseStudies";
import { homeProjects } from "../data/projects";
import ArtStrip from "../features/home/ArtStrip";
import usePreload from "../hooks/usePreload";

const latest = studyList.slice(0, 1).map(toCard);

const firstScreen = [
  ...latest.map((s) => s.thumbnailUrl),
  ...homeProjects.map((p) => p.thumbnailUrl),
];

export default function Home() {
  const ready = usePreload(firstScreen);

  if (!ready) return <div className="page-pending" />;

  return (
    <>
      <HomeIntro />
      <CaseStudyList
        studies={latest}
        className="home-case-list"
        delay={0.1}
      />
      <SectionDivider />
      <ArtStrip />
    </>
  );
}
