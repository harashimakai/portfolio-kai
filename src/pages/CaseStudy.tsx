import { useEffect } from "react";
import { useParams } from "react-router-dom";
import StudyPage from "../components/study/StudyPage";
import { studies } from "../studies";
import NotFound from "./NotFound";

interface Props {
  setSideOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /* Fixed slug for a dedicated route; otherwise read from /work/:slug. */
  slug?: string;
}

/* Renders any registered case study from its content file. */
export default function CaseStudy({ setSideOpen, slug }: Props) {
  const params = useParams();
  const def = studies[slug ?? params.slug ?? ""];

  useEffect(() => {
    window.scrollTo(0, 0);
    setSideOpen(false);
  }, [def]);

  if (!def) return <NotFound setSideOpen={setSideOpen} />;
  return (
    <StudyPage
      key={def.slug}
      file={def.slug}
      content={def.content}
      assets={def.assets}
      logo={def.logo}
      logoDark={def.logoDark}
      logoAlt={def.title}
    />
  );
}
