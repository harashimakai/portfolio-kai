import { motion } from "motion/react";
import { container_s, children } from "../global/AnimationConsts";
import { homeProjects, Project } from "../global/ProjectData";
import ItemCard from "../global/ItemCard";
import "../../css/home.css";

interface Props {
  projects?: Project[];
}

export default function ProjectGrid({ projects = homeProjects }: Props) {
  return (
    <section className="grid-content">
      <motion.div
        className="project-grid"
        variants={container_s}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {projects.map((project, index) => (
          <motion.article
            key={project.id}
            className="item-card"
            variants={children}
            transition={{ ease: "easeOut" }}
          >
            <ItemCard item={project} index={index} total={projects.length} />
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
