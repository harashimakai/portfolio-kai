import CaseStudyList from "./CaseStudyList";
import SectionDivider from "../../components/ui/SectionDivider";
import { studyList, toCard } from "../../data/caseStudies";

interface Props {
  current: string;
  preview: boolean;
}

export default function MoreStudies({ current, preview }: Props) {
  const others = studyList
    .filter((d) => d.slug !== current)
    .slice(0, 2)
    .map(toCard);
  if (others.length < 2 && !(preview && others.length > 0)) return null;
  return (
    <aside>
      <SectionDivider />
      <h2 className="study-more-label">More case studies</h2>
      <CaseStudyList
        studies={others}
        className="study-more-list"
        delay={0.1}
      />
    </aside>
  );
}
