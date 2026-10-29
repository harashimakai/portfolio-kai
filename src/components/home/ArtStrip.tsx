import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { container_s, children, children_custom } from "../global/AnimationConsts";
import Arrow from "../global/Arrow";
import { homeProjects, Project } from "../global/ProjectData";
import { Tile } from "../art/ArtGallery";
import Lightbox from "../art/Lightbox";
import "../../css/home.css";

interface Props {
  projects?: Project[];
}

/* The home page's row of artworks: the same tiles as the art page, with
   its hover state, and the same lightbox on click.                      */
export default function ArtStrip({ projects = homeProjects }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="grid-content">
      <motion.div
        className="art-strip"
        variants={container_s}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            className={project.extra ? "art-cell art-cell-extra" : "art-cell"}
            variants={children}
            transition={{ ease: "easeOut" }}
          >
            <Tile
              project={project}
              aspect="1 / 1"
              onOpen={() => setOpenIndex(i)}
            />
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        className="art-strip-more"
        variants={children_custom}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.2}
      >
        <Link to="/art">
          <h2 className="underline-hover">
            SEE MORE <Arrow dir="right" />
          </h2>
        </Link>
      </motion.div>
      <Lightbox
        projects={projects}
        index={openIndex}
        onChange={setOpenIndex}
      />
    </section>
  );
}
