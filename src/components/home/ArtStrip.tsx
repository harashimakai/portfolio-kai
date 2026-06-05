import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { container_s, children } from "../global/AnimationConsts";
import { homeProjects, Project } from "../global/ProjectData";
import PageView from "../work/PageView";
import "../../css/home.css";

interface Props {
  projects?: Project[];
}

export default function ArtStrip({ projects = homeProjects }: Props) {
  const [selected, setSelected] = useState<{ id: string; index: number } | null>(null);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  return (
    <>
      <section className="grid-content">
        <motion.div
          className="art-strip"
          variants={container_s}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {projects.map((project, index) => (
            <motion.article
              key={project.id}
              className={
                project.extra
                  ? "art-cell-container art-cell-extra"
                  : "art-cell-container"
              }
              variants={children}
              transition={{ ease: "easeOut" }}
              onClick={() => setSelected({ id: project.id, index: index + 1 })}
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

      {selected && (
        <div className="page-view-overlay">
          <PageView
            id={selected.id}
            plateNum={selected.index}
            onClose={() => setSelected(null)}
          />
        </div>
      )}
    </>
  );
}
