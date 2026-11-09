import CaseStudyList from "./CaseStudyList";
import SectionDivider from "../../components/ui/SectionDivider";
import SectionHead from "../../components/ui/SectionHead";
import { studyList, toCard } from "../../data/caseStudies";

// Types

interface Props {
  current: string;
  preview: boolean;
}

// More studies

export default function MoreStudies({ current, preview }: Props) {
  const others = studyList
    .filter((d) => d.slug !== current)
    .slice(0, 2)
    .map(toCard);
  if (others.length < 2 && !(preview && others.length > 0)) return null;
  return (
    <aside>
      <SectionDivider />
      <SectionHead
        className="study-more-head"
        title="More case studies"
        to="/work"
        linkLabel="Back to work"
      />
      <CaseStudyList
        studies={others}
        className="study-more-list"
        delay={0.1}
      />
    </aside>
  );
}
