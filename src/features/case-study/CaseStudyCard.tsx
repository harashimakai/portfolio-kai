import { Link } from "react-router-dom";

import type { StudyCard } from "../../types/caseStudy";
import InViewVideo from "../../components/ui/InViewVideo";

// Types

interface Props {
  item: StudyCard;
}

// Card

export default function CaseStudyCard({ item }: Props) {
  return (
    <Link
      to={item.slug}
      className={`case-card ${item.palette}`}
      data-cursor="View project"
    >
      <div className="case-card-image">
        {item.video ? (
          <InViewVideo
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
            loading="lazy"
            decoding="async"
            src={item.thumbnailUrl}
            alt={item.title}
          />
        )}
      </div>

      <div className="case-card-meta">
        <p className="case-card-text">
          <span className="case-card-title">{item.title}</span>
          <span className="case-card-sub">
            <span className="case-card-slash" aria-hidden="true">/</span>
            <span className="case-card-excerpt">{item.subheading}</span>
          </span>
        </p>
        <p className="case-card-info">
          {item.context} <span className="case-card-dot">·</span> {item.date}
        </p>
      </div>
    </Link>
  );
}
