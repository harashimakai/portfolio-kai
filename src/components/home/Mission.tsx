import { motion } from "motion/react";
import { children_custom, container_m } from "../global/AnimationConsts";
import { Link } from "react-router-dom";
import Arrow from "../global/Arrow";

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
        <div className="mission-body">
          <motion.p
            className="mission-intro lead"
            variants={children_custom}
            custom={0.1}
          >
            I’m Kai, a student at Cornell exploring the intersection of
            computer science and design.
          </motion.p>
        </div>
        <div className="mission-stats">
          <motion.div
            className="mission-stat-row"
            variants={children_custom}
            custom={0.2}
          >
            <h3>NOW</h3>
            <p className="mission-desc">
              Design Engineer @{" "}
              <a
                target="_blank"
                href="https://new.cornelldti.org/"
              >
                Cornell DTI
              </a>
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
              href="mailto:kh862@cornell.edu"
            >
              kh862@cornell.edu <Arrow dir="ne" />
            </a>
          </motion.div>
          <div className="action-buttons">
            <motion.div
              variants={children_custom}
              custom={0.5}
              style={{ display: "inline-block", width: "fit-content" }}
            >
              <Link
                to="/work"
                tabIndex={-1}
              >
                <motion.button data-cursor="hide" whileHover={{ scale: 1.05 }}>
                  <h3>
                    CASE STUDIES <Arrow dir="right" />
                  </h3>
                </motion.button>
              </Link>
            </motion.div>
            <motion.div
              variants={children_custom}
              custom={0.6}
              style={{ display: "inline-block", width: "fit-content" }}
            >
              <Link
                to="/about"
                tabIndex={-1}
              >
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
