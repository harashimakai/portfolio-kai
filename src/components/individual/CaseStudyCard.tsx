import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

import "../../css/case.css";
import { Study } from "./StudyData";

interface LogoProps {
  height: number;
  style?: object;
  itemUrl: string;
  title: string;
}

interface Props {
  item: Study;
}

export default function CaseStudyCard({ item }: Props) {
  return (
    <article
      className="card-container"
      style={item.theme as React.CSSProperties}
    >
      <div className="card-left">
        <img
          loading="lazy"
          src={item.thumbnailUrl}
          alt={item.title}
        />
      </div>
      <div className="card-right">
        <div className="card-header">
          <h2 className="card-tag">CASE STUDY</h2>
          <h2 className="card-subtitle">{item.sub}</h2>
        </div>
        <BrandLogo
          height={item.logoHeight}
          itemUrl={item.logoUrl}
          title={item.title}
        />
        <p className="card-subheading">{item.subheading}</p>
        <p className="card-desc">{item.desc}</p>

        <div className="card-buttons">
          <Link
            to={"/comingsoon"}
            style={{ display: "inline-block", width: "fit-content" }}
          >
            <motion.button whileHover={{ scale: 1.05 }}>
              <h1>READ CASE STUDY →</h1>
            </motion.button>
          </Link>
          <h2>
            {item.sectionNum} SECTIONS · CASE STUDY {item.id}
          </h2>
        </div>
      </div>
    </article>
  );
}

function BrandLogo({ height = 80, style = {}, itemUrl, title }: LogoProps) {
  return (
    <img
      src={itemUrl}
      alt={title}
      style={{ height, width: "fit-content", display: "block", ...style }}
    />
  );
}
