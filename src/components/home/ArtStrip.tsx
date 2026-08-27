import { motion } from "motion/react";
import { container_s, children } from "../global/AnimationConsts";
import { homeProjects, Project } from "../global/ProjectData";
import "../../css/home.css";

interface Props {
  projects?: Project[];
}

export default function ArtStrip({ projects = homeProjects }: Props) {
  return (
    <section className="grid-content">
      <motion.div
        className="art-strip"
        variants={container_s}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {projects.map((project) => (
          <motion.article
            key={project.id}
            className={
              project.extra
                ? "art-cell-container art-cell-extra"
                : "art-cell-container"
            }
            variants={children}
            transition={{ ease: "easeOut" }}
          >
            <img
              loading="lazy"
              src={project.thumbnailUrl}
              alt={project.title}
              style={
                project.imagePos
                  ? { objectPosition: project.imagePos }
                  : undefined
              }
            />
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
