import { motion } from "motion/react";

import { fadeUpDelayed } from "../lib/animations";
import ButtonLink from "../components/ui/ButtonLink";
import SectionDivider from "../components/ui/SectionDivider";
import Monogram from "../components/ui/Monogram";
import Arrow from "../components/ui/Arrow";

// Page

export default function NotFound() {
  return (
    <section className="home-intro-section">
      <SectionDivider fullWidth />
      <motion.div
        className="not-found"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="not-found-brand">
          {/* Brand */}
          <div className="not-found-brand-info">
            <motion.div
              variants={fadeUpDelayed}
              custom={0}
              className="not-found-brand-logo"
            >
              <Monogram />
            </motion.div>
            <motion.p
              variants={fadeUpDelayed}
              custom={0.25}
              className="not-found-brand-text text-label-sm"
            >
              Kai Harashima
              <br />
              Designer &amp; Developer
              <br />
              Westchester · Ithaca
            </motion.p>
          </div>
          {/* Message */}
          <div>
            <motion.h1
              variants={fadeUpDelayed}
              custom={0.5}
              className="not-found-title display"
            >
              404: Page not found.
            </motion.h1>
            <motion.p
              variants={fadeUpDelayed}
              custom={0.75}
              className="not-found-text body-lg"
            >
              The page you're looking for doesn't exist or has been moved.
            </motion.p>
            <div className="home-intro-actions">
              <motion.div
                variants={fadeUpDelayed}
                custom={1}
              >
                <ButtonLink
                  to="/"
                  variant="primary"
                >
                  Return home <Arrow dir="right" />
                </ButtonLink>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
