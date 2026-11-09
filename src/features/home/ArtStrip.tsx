import { useState } from "react";
import { motion } from "motion/react";

import useMediaQuery from "../../hooks/useMediaQuery";
import { PHONE_QUERY } from "../../lib/media";
import { staggerContainer, fadeUp } from "../../lib/animations";
import SectionHead from "../../components/ui/SectionHead";
import { homeProjects, homePhoneProjects } from "../../data/projects";
import { Tile } from "../art/ArtGallery";
import Lightbox from "../../components/ui/Lightbox";

// Art strip

export default function ArtStrip() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const phone = useMediaQuery(PHONE_QUERY);
  const projects = phone ? homePhoneProjects : homeProjects;

  return (
    <section className="home-art">
      {/* Header */}
      <SectionHead
        title="Artwork"
        to="/art"
        linkLabel="See more"
      />
      {/* Strip */}
      <motion.div
        className="home-art-strip"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            className={project.extra ? "home-art-cell home-art-cell-extra" : "home-art-cell"}
            variants={fadeUp}
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
      {/* Lightbox */}
      <Lightbox
        projects={projects}
        index={openIndex}
        onChange={setOpenIndex}
      />
    </section>
  );
}
