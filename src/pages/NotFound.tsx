import { motion } from "motion/react";

import { children_custom } from "../lib/animations";
import ButtonLink from "../components/ui/ButtonLink";
import SectionDivider from "../components/ui/SectionDivider";
import Monogram from "../components/ui/Monogram";
import Arrow from "../components/ui/Arrow";

export default function NotFound() {
  return (
    <section className="intro-section">
      <SectionDivider fullWidth />
      <motion.div
        className="not-found"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="not-found-brand">
          <div className="not-found-brand-info">
            <motion.div
              variants={children_custom}
              custom={0}
              className="not-found-brand-logo"
            >
              <Monogram />
            </motion.div>
            <motion.h3
              variants={children_custom}
              custom={0.25}
              className="not-found-brand-text"
            >
              KAI HARASHIMA
              <br />
              DESIGNER &amp; DEVELOPER
              <br />
              WESTCHESTER · ITHACA
            </motion.h3>
          </div>
          <div>
            <motion.p
              variants={children_custom}
              custom={0.5}
              className="not-found-title display"
            >
              404: Page not found.
            </motion.p>
            <motion.p
              variants={children_custom}
              custom={0.75}
              className="not-found-text body-lg"
            >
              The page you're looking for doesn't exist or has been moved.
            </motion.p>
            <div className="intro-actions">
              <motion.div
                variants={children_custom}
                custom={1}
              >
                <ButtonLink
                  to="/"
                  variant="primary"
                >
                  RETURN HOME <Arrow dir="right" />
                </ButtonLink>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
