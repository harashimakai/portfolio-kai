import { motion } from "motion/react";
import { children_custom, container_trigger } from "../global/AnimationConsts";

interface Props {
  id?: string;
  chapter: string;
  subtitle: string;
  intro: React.ReactNode;
  sub?: React.ReactNode;
  filters?: readonly string[];
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
}

export default function ChapterHeading({
  id,
  chapter,
  subtitle,
  intro,
  sub,
  filters,
  activeFilter,
  onFilterChange,
}: Props) {
  return (
    <motion.section
      id={id}
      className="splash-heading-content"
      variants={container_trigger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="splash-heading-container">
        <motion.h2
          variants={children_custom}
          custom={0}
        >
          <span className="splash-strong">{chapter}</span>
        </motion.h2>
        <motion.h2
          variants={children_custom}
          custom={0.15}
        >
          {subtitle}
        </motion.h2>
      </div>
      <div className={filters ? "splash-heading-body" : undefined}>
        <div>
          <motion.h1
            className="splash-intro"
            variants={children_custom}
            custom={0.3}
          >
            {intro}
          </motion.h1>
          {sub && (
            <motion.h1
              className="splash-sub"
              variants={children_custom}
              custom={0.45}
            >
              {sub}
            </motion.h1>
          )}
        </div>
        {filters && (
          <div className="filter-buttons splash-heading-filters">
            {filters.map((filter, i) => (
              <motion.button
                key={filter}
                type="button"
                variants={children_custom}
                custom={0.3 + i * 0.2}
                className={activeFilter === filter ? "filter-active" : ""}
                onClick={() => onFilterChange?.(filter)}
              >
                {filter}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}
