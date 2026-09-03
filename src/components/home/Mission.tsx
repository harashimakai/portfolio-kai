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
          custom={0.1}
        >
          INTRODUCTION
        </motion.h2>
        <div className="mission-body">
          <motion.p
            className="mission-intro lead"
            variants={children_custom}
            custom={0.1}
          >
            Hi! I’m Kai, a product designer at Cornell University focused on the
            intersection of creative design principles and technical skill in
            computer science.
          </motion.p>

          <div className="mission-stats">
            <motion.div
              className="mission-stat-row"
              variants={children_custom}
              custom={0.2}
            >
              <h3>NOW</h3>
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
              custom={0.3}
            >
              <h3>STUDYING</h3>
              <p className="mission-desc">Computer Science</p>
            </motion.div>
            <motion.div
              className="mission-stat-row"
              variants={children_custom}
              custom={0.4}
            >
              <h3>EMAIL</h3>
              <a
                className="mission-desc"
                target="_blank"
                href="mailto:kh862@cornell.edu"
              >
                kh862@cornell.edu &nbsp;
                <span className="sans">{"\u2197\uFE0E"}</span>
              </a>
            </motion.div>
          </div>

          <div className="action-buttons">
            <motion.div
              variants={children_custom}
              custom={0.5}
              style={{ display: "inline-block", width: "fit-content" }}
            >
              <Link to="/work">
                <motion.button whileHover={{ scale: 1.05 }}>
                  <h3>CASE STUDIES →</h3>
                </motion.button>
              </Link>
            </motion.div>
            <motion.div
              variants={children_custom}
              custom={0.6}
              style={{ display: "inline-block", width: "fit-content" }}
            >
              <Link to="/about">
                <motion.button
                  className="btn-secondary"
                  whileHover={{ scale: 1.05 }}
                >
                  <h3>ABOUT</h3>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
