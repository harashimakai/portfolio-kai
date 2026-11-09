import { motion } from "motion/react";
import { fadeUpDelayed, staggerContainer } from "../../lib/animations";
import Arrow from "../../components/ui/Arrow";
import { EMAILS, INTRO, LINKS } from "../../data/site";
import ButtonLink from "../../components/ui/ButtonLink";

// Intro

export default function HomeIntro() {
  return (
    <section className="home-intro-section">
      <motion.div
        className="home-intro"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Lead */}
        <div className="home-intro-body">
          <motion.h1
            className="home-intro-lead lead"
            variants={fadeUpDelayed}
            custom={0.1}
          >
            {INTRO}
          </motion.h1>
        </div>
        {/* Stats */}
        <div className="home-intro-stats">
          <motion.div
            className="home-intro-stat"
            variants={fadeUpDelayed}
            custom={0.2}
          >
            <p className="home-intro-stat-label">Now</p>
            <p className="home-intro-stat-value">
              Designer & Developer @{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={LINKS.dti}
              >
                Cornell DTI
              </a>
            </p>
          </motion.div>
          <motion.div
            className="home-intro-stat"
            variants={fadeUpDelayed}
            custom={0.3}
          >
            <p className="home-intro-stat-label">Studying</p>
            <p className="home-intro-stat-value">Computer Science</p>
          </motion.div>
          <motion.div
            className="home-intro-stat"
            variants={fadeUpDelayed}
            custom={0.4}
          >
            <p className="home-intro-stat-label">Email</p>
            <a
              className="home-intro-stat-value"
              href={`mailto:${EMAILS.school}`}
            >
              {EMAILS.school} <Arrow dir="ne" />
            </a>
          </motion.div>
          {/* Actions */}
          <div className="home-intro-actions">
            <motion.div
              variants={fadeUpDelayed}
              custom={0.5}
            >
              <ButtonLink
                to="/work"
                variant="primary"
              >
                Case studies <Arrow dir="right" />
              </ButtonLink>
            </motion.div>
            <motion.div
              variants={fadeUpDelayed}
              custom={0.6}
            >
              <ButtonLink
                to="/about"
                variant="secondary"
              >
                About
              </ButtonLink>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
