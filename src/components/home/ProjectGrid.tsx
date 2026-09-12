import { motion } from "motion/react";
import { children, children_custom } from "../global/AnimationConsts";
import { homeProjects, Project } from "../global/ProjectData";
import ItemCard from "../global/ItemCard";
import "../../css/home.css";

interface Props {
  projects?: Project[];
}

export default function ProjectGrid({ projects = homeProjects }: Props) {
  return (
    <section className="grid-content">
      {/* The grid resolves as a single block rather than card by card. */}
      <motion.div
        className="project-grid"
        variants={children_custom}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.3}
      >
        {projects.map((project, index) => (
          <article
            key={project.id}
            className="item-card"
          >
            <ItemCard
              item={project}
              index={index}
              total={projects.length}
            />
          </article>
        ))}
      </motion.div>
    </section>
  );
}
