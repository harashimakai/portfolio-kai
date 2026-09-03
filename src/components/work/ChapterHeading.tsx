import { motion } from "motion/react";
import { children_custom, container_trigger } from "../global/AnimationConsts";

interface Props {
  id?: string;
  chapter: string;
  intro: React.ReactNode;
  sub?: React.ReactNode;
  filters?: readonly string[];
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
}

export default function ChapterHeading({
  id,
  chapter,
  intro,
  sub,
  filters,
  activeFilter,
  onFilterChange,
}: Props) {
  return (
    <motion.section
      id={id}
      className="chapter-header"
      variants={container_trigger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="chapter-label-row">
        <motion.h2
          variants={children_custom}
          custom={0.1}
        >
          <span>{chapter}</span>
        </motion.h2>
      </div>
      <div className={filters ? "chapter-body" : undefined}>
        <div>
          <motion.h1
            className="chapter-title"
            variants={children_custom}
            custom={0.2}
          >
            {intro}
          </motion.h1>
        </div>
        {filters && (
          <div className="filter-buttons chapter-filters">
            {filters.map((filter, i) => (
              <motion.button
                key={filter}
                type="button"
                variants={children_custom}
                custom={0.1 + i * 0.1}
                className={activeFilter === filter ? "filter-active" : ""}
                data-label={filter}
                onClick={() => onFilterChange?.(filter)}
              >
                <h2>{filter}</h2>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}
