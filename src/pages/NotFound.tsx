import { useState, useEffect } from "react";
import { motion } from "motion/react";

import "../css/work.css";

import {
  children_custom,
  container_trigger,
} from "../components/global/AnimationConsts";
import { Link } from "react-router-dom";
import SectionDiv from "../components/global/SectionDiv";
import Monogram from "../components/global/Monogram";
import Arrow from "../components/global/Arrow";

interface Props {
  setSideOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NotFound({ setSideOpen }: Props) {
  useEffect(() => {
    window.scrollTo(0, 0);
    setSideOpen(false);
  }, []);

  return (
    <section className="mission-content">
      <SectionDiv fullWidth={true} />
      <motion.div
        className="missing-container"
        variants={container_trigger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="centerpiece-container">
          <div className="centerpiece-info">
            <motion.div
              variants={children_custom}
              custom={0}
              className="centerpiece-logos"
            >
              <Monogram />
            </motion.div>
            <motion.h3
              variants={children_custom}
              custom={0.25}
              className="centerpiece-desc"
            >
              KAI HARASHIMA
              <br />
              WESTCHESTER · ITHACA
              <br />
              ESTAB. MMXXVI
            </motion.h3>
          </div>
          <div>
            <motion.p
              variants={children_custom}
              custom={0.5}
              className="missing-header display"
            >
              <span className="italic accent">404</span> — Page not found.
            </motion.p>
            <motion.p
              variants={children_custom}
              custom={0.75}
              className="missing-body body-lg"
            >
              No record of this page in the index. It may have moved or been
              retired.
            </motion.p>
            <div className="action-buttons">
              <motion.div
                variants={children_custom}
                custom={1}
                style={{ display: "inline-block", width: "fit-content" }}
              >
                <Link
                to="/"
                tabIndex={-1}
              >
                  <motion.button
                    className="btn-secondary"
                    whileHover={{ scale: 1.05 }}
                  >
                    <h3>
                      RETURN HOME <Arrow dir="right" />
                    </h3>
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
