import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

import "../../css/case.css";
import { Study } from "./StudyData";

interface LogoProps {
  width: number;
  style?: object;
  itemUrl: string;
  title: string;
}

interface Props {
  item: Study;
}

export default function CaseStudyCardNew({ item }: Props) {
  return (
    <Link
      to={item.slug || "/comingsoon"}
      className="case-card"
    >
      <div className="card-image">
        <img
          loading="lazy"
          src={item.thumbnailUrl}
          alt={item.title}
        />
      </div>

      <div className="card-meta">
        <p className="card-text">
          <span className="card-title">{item.title}</span>
          <span className="card-excerpt">{item.subheading}</span>
        </p>
        <h2>
          {item.context} · {item.date}
        </h2>
      </div>
    </Link>
  );
}

function BrandLogo({ width = 80, style = {}, itemUrl, title }: LogoProps) {
  return (
    <img
      className="card-logo"
      src={itemUrl}
      alt={title}
      style={{ width, height: "auto", display: "block", ...style }}
    />
  );
}
