import { Link } from "react-router-dom";

import type { StudyCard } from "../../types/caseStudy";

interface Props {
  item: StudyCard;
}

export default function CaseStudyCard({ item }: Props) {
  return (
    <Link
      to={item.slug}
      className="case-card"
      data-cursor="View project"
    >
      <div className="case-card-image">
        {item.video ? (
          <video
            src={item.video}
            poster={item.thumbnailUrl}
            aria-label={item.title}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img
            loading="eager"
            decoding="async"
            fetchPriority="high"
            src={item.thumbnailUrl}
            alt={item.title}
          />
        )}
      </div>

      <div className="case-card-meta">
        <p className="case-card-text">
          <span className="case-card-title entry-title">{item.title}</span>
          <span className="case-card-excerpt body-xs">{item.subheading}</span>
        </p>
        <h3>
          {item.context} · {item.date}
        </h3>
      </div>
    </Link>
  );
}
