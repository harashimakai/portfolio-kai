import { motion } from "motion/react";
import { container_s, children } from "../global/AnimationConsts";
import { homeProjects, Project } from "../global/ProjectData";
import ItemCard from "../global/ItemCard";
import "../../css/home.css";

interface Props {
  projects?: Project[];
  variant?: "home" | "mosaic";
}

export default function ProjectGrid({
  projects = homeProjects,
  variant = "home",
}: Props) {
  const isMosaic = variant === "mosaic";

  return (
    <section className={isMosaic ? "mosaic-content" : "grid-content"}>
      <motion.div
        className={isMosaic ? "mosaic-grid" : "project-grid"}
        variants={container_s}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {projects.map((project, index) => (
          <motion.article
            key={project.id}
            className="item-card"
            style={isMosaic ? { gridColumn: project.grid } : undefined}
            variants={children}
            transition={{ ease: "easeOut" }}
          >
            <ItemCard
              item={project}
              index={index}
              total={projects.length}
              mosaic={isMosaic}
            />
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
