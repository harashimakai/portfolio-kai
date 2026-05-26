import { motion } from "motion/react";
import { children, container_m } from "../global/AnimationConsts";

const FILTERS = [
  "ALL",
  "PAINTING",
  "DESIGN",
  "CALLIGRAPHY",
  "FABRICATION",
] as const;

interface Props {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function WorkSplash({ activeFilter, onFilterChange }: Props) {
  return (
    <section className="splash-content">
      <motion.div
        className="splash-container"
        variants={container_m}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div className="splash-body" variants={children}>
          <p className="splash-intro">
            <span className="italic">Across</span> mediums.
          </p>
        </motion.div>
        <motion.div className="filter-buttons" variants={children}>
          {FILTERS.map((filter) => (
            <h2
              key={filter}
              className={activeFilter === filter ? "filter-active" : ""}
              onClick={() => onFilterChange(filter)}
            >
              {filter}
            </h2>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
//           <div className="navbar-line" />
//          <h2
//            key="CASE"
//            className={activeFilter === "CASE" ? "filter-active" : ""}
//            onClick={() => onFilterChange("CASE")}
//          >
//            CASE STUDY
//          </h2>
