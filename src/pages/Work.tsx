import CaseStudyList from "../features/case-study/CaseStudyList";
import { studyList, toCard } from "../data/caseStudies";

const studies = studyList.map(toCard);

export default function Work() {
  return (
    <CaseStudyList
      studies={studies}
      className="case-list"
      delay={0.3}
    />
  );
}
