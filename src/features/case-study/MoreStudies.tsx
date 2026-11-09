import { Link } from "react-router-dom";
import CaseStudyList from "./CaseStudyList";
import Arrow from "../../components/ui/Arrow";
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
      <div className="study-more-head">
        <h2>More case studies</h2>
        <Link
          className="study-more-link"
          to="/work"
        >
          <h2 className="underline-hover">
            Back to work <Arrow dir="right" />
          </h2>
        </Link>
      </div>
      <CaseStudyList
        studies={others}
        className="study-more-list"
        delay={0.1}
      />
    </aside>
  );
}
