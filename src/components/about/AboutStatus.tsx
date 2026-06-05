import { motion } from "motion/react";
import { children_custom, container_trigger } from "../global/AnimationConsts";

import SectionDiv from "../global/SectionDiv";

export default function AboutStatus() {
  return (
    <>
      <SectionDiv
        left="// 04 — STATUS"
        right="WHAT AM I DOING NOW?"
      />
      <motion.div
        className="about-content-status"
        variants={container_trigger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="about-status">
          <motion.span
            className="about-status-label"
            variants={children_custom}
            custom={0}
          >
            CURRENTLY
          </motion.span>
          <motion.span
            className="about-status-text"
            variants={children_custom}
            custom={0.15}
          >
            Seeking product design internships — Summer 2027
          </motion.span>
        </div>
        <div className="about-status-links">
          <motion.a
            className="underline-hover"
            target="_blank"
            variants={children_custom}
            custom={0.3}
          >
            RÉSUMÉ ↗
          </motion.a>
          <motion.a
            className="underline-hover"
            target="_blank"
            variants={children_custom}
            custom={0.45}
          >
            EMAIL ↗
          </motion.a>
          <motion.a
            className="underline-hover"
            target="_blank"
            href="https://www.linkedin.com/in/kai-harashima-109164364"
            variants={children_custom}
            custom={0.6}
          >
            LINKEDIN ↗
          </motion.a>
        </div>
      </motion.div>
    </>
  );
}
