import { useState, useEffect } from "react";
import { motion } from "motion/react";

import "../css/work.css";

import {
  children_custom,
  container_trigger,
} from "../components/global/AnimationConsts";
import { Link } from "react-router-dom";
import SectionDiv from "../components/global/SectionDiv";
import monogram from "../assets/logos/monogram.svg";
import monograml from "../assets/logos/monogram-light.svg";

interface Props {
  setSideOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NotFound({ setSideOpen }: Props) {
  useEffect(() => {
    window.scrollTo(0, 0);
    setSideOpen(false);
  }, []);

  return (
    <section className="missing-content">
      <SectionDiv left="// 00 — 404" right="NO RECORD" />
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
              <img src={monogram} alt="Logo" className="monogram m-light" />
              <img src={monograml} alt="Logo" className="monogram m-dark" />
            </motion.div>
            <motion.h2
              variants={children_custom}
              custom={0.25}
              className="centerpiece-desc"
            >
              KAI HARASHIMA
              <br />
              WESTCHESTER · ITHACA
              <br />
              ESTAB. MMXXVI
            </motion.h2>
          </div>
          <div>
            <motion.p
              variants={children_custom}
              custom={0.5}
              className="missing-header"
            >
              <span className="italic accent">404</span> — Page not found.
            </motion.p>
            <motion.p
              variants={children_custom}
              custom={0.75}
              className="missing-body"
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
                <Link to="/">
                  <motion.button
                    className="btn-secondary"
                    whileHover={{ scale: 1.05 }}
                  >
                    <h2>RETURN HOME →</h2>
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
