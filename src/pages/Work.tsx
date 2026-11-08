import CaseStudyList from "../features/case-study/CaseStudyList";
import { studyList, toCard } from "../data/caseStudies";

const studies = studyList.map(toCard);

// Switch to 2 to lay the case studies out in two columns (≥768px).
const COLUMNS: 1 | 2 = 1;

export default function Work() {
  return (
    <CaseStudyList
      studies={studies}
      className={COLUMNS === 2 ? "case-list case-list-2col" : "case-list"}
      delay={0.3}
    />
  );
}
