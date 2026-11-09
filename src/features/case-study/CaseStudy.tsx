import { Children, isValidElement, useMemo, type ReactNode } from "react";

import MoreStudies from "./MoreStudies";
import { Section, sectionId, type SectionProps } from "./Section";
import { StudyHero, type HeroProps } from "./StudyHero";
import StudyNav from "./StudyNav";

// Types

interface Props extends HeroProps {
  slug: string;
  preview?: boolean;
  children: ReactNode;
}

// Nav

function navFrom(children: ReactNode) {
  return Children.toArray(children).flatMap((node) =>
    isValidElement<SectionProps>(node) && node.type === Section && node.props.label
      ? [{ id: sectionId(node.props), label: node.props.label }]
      : [],
  );
}

// Page

export default function CaseStudy({
  slug,
  preview = false,
  children,
  ...hero
}: Props) {
  const nav = useMemo(() => navFrom(children), [children]);
  return (
    <>
      <article className="study">
        <StudyHero {...hero} />
        <StudyNav sections={nav} />
        {children}
      </article>
      <MoreStudies
        current={slug}
        preview={preview}
      />
    </>
  );
}
