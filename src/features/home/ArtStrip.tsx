import { useState } from "react";
import useMediaQuery from "../../hooks/useMediaQuery";
import { PHONE_QUERY } from "../../lib/media";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { container_m, children, children_custom } from "../../lib/animations";
import Arrow from "../../components/ui/Arrow";
import { homeProjects, homePhoneProjects } from "../../data/projects";
import { Tile } from "../art/ArtGallery";
import Lightbox from "../art/Lightbox";

export default function ArtStrip() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const phone = useMediaQuery(PHONE_QUERY);
  const projects = phone ? homePhoneProjects : homeProjects;

  return (
    <section className="home-art">
      <motion.div
        className="art-strip-head"
        variants={container_m}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2
          variants={children_custom}
          custom={0}
        >
          Artwork
        </motion.h2>
        <motion.div
          className="art-strip-more"
          variants={children_custom}
          custom={0.1}
        >
          <Link to="/art">
            <h2 className="underline-hover">
              See more <Arrow dir="right" />
            </h2>
          </Link>
        </motion.div>
      </motion.div>
      <motion.div
        className="art-strip"
        variants={container_m}
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
              title={project.shortTitle ?? project.title}
              aspect="1 / 1"
              onOpen={() => setOpenIndex(i)}
            />
          </motion.div>
        ))}
      </motion.div>
      <Lightbox
        projects={projects}
        index={openIndex}
        onChange={setOpenIndex}
      />
    </section>
  );
}
