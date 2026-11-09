import CaseStudyList from "../features/case-study/CaseStudyList";
import { studyList, toCard } from "../data/caseStudies";

const studies = studyList.map(toCard);

// Page

export default function Work() {
  return (
    <>
      <h1 className="visually-hidden">Work</h1>
      <CaseStudyList
        studies={studies}
        className="case-list"
        delay={0.3}
      />
    </>
  );
}
