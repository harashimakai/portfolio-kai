import { motion } from "motion/react";
import { children_custom, container_m } from "../global/AnimationConsts";
import { Link } from "react-router-dom";

export default function Mission() {
  return (
    <section className="mission-content">
      <motion.div
        className="mission-container"
        variants={container_m}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2
          variants={children_custom}
          custom={0}
        >
          // 01 — INTRODUCTION
        </motion.h2>
        <div className="mission-body">
          <motion.p
            className="mission-intro"
            variants={children_custom}
            custom={0.15}
          >
            Hi. I'm Kai, a student at&nbsp;
            <a
              target="_blank"
              href="https://www.cs.cornell.edu/"
            >
              Cornell University
            </a>{" "}
            focused on the intersection of{" "}
            <span className="italic">
              <span className="alternative_b">creative desi</span>gn
            </span>{" "}
            principles and{" "}
            <span className="italic alternative_b">technical skill</span> in
            computer science and UI/UX.
          </motion.p>

          <div className="mission-stats">
            <motion.div
              className="mission-stat-row"
              variants={children_custom}
              custom={0.35}
            >
              <h2>NOW</h2>
              <p className="mission-desc">
                <a
                  target="_blank"
                  href="https://new.cornelldti.org/"
                >
                  Cornell DTI
                </a>
                , Ithaca NY
              </p>
            </motion.div>
            <motion.div
              className="mission-stat-row"
              variants={children_custom}
              custom={0.5}
            >
              <h2>STUDYING</h2>
              <p className="mission-desc">Computer Science · Product Design</p>
            </motion.div>
            <motion.div
              className="mission-stat-row"
              variants={children_custom}
              custom={0.65}
            >
              <h2>INDEX</h2>
              <p className="mission-desc">
                08 selected artworks, 01 case study
              </p>
            </motion.div>
          </div>

          <div className="action-buttons">
            <motion.div
              variants={children_custom}
              custom={0.85}
              style={{ display: "inline-block", width: "fit-content" }}
            >
              <Link to="/work">
                <motion.button whileHover={{ scale: 1.05 }}>
                  <h2>CASE STUDIES →</h2>
                </motion.button>
              </Link>
            </motion.div>
            <motion.div
              variants={children_custom}
              custom={1.0}
              style={{ display: "inline-block", width: "fit-content" }}
            >
              <Link to="/about">
                <motion.button
                  className="btn-secondary"
                  whileHover={{ scale: 1.05 }}
                >
                  <h2>ABOUT</h2>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
