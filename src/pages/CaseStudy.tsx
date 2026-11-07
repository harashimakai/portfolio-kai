import StudyPage from "../features/case-study/StudyPage";
import type { StudyDef } from "../types/caseStudy";

interface Props {
  study: StudyDef;
}

export default function CaseStudy({ study }: Props) {
  return (
    <StudyPage
      key={study.slug}
      study={study}
    />
  );
}
