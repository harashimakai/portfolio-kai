import { motion } from "motion/react";
import { children_custom, container_m } from "../../lib/animations";
import Arrow from "../../components/ui/Arrow";
import { EMAILS, INTRO, LINKS } from "../../data/site";
import ButtonLink from "../../components/ui/ButtonLink";

export default function HomeIntro() {
  return (
    <section className="intro-section">
      <motion.div
        className="intro"
        variants={container_m}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="intro-body">
          <motion.p
            className="intro-lead lead"
            variants={children_custom}
            custom={0.1}
          >
            {INTRO}
          </motion.p>
        </div>
        <div className="intro-stats">
          <motion.div
            className="intro-stat"
            variants={children_custom}
            custom={0.2}
          >
            <p className="intro-stat-label">Now</p>
            <p className="intro-stat-value">
              Designer &amp; Developer @{" "}
              <a
                target="_blank"
                href={LINKS.dti}
              >
                Cornell DTI
              </a>
            </p>
          </motion.div>
          <motion.div
            className="intro-stat"
            variants={children_custom}
            custom={0.3}
          >
            <p className="intro-stat-label">Studying</p>
            <p className="intro-stat-value">Computer Science</p>
          </motion.div>
          <motion.div
            className="intro-stat"
            variants={children_custom}
            custom={0.4}
          >
            <p className="intro-stat-label">Email</p>
            <a
              className="intro-stat-value"
              href={`mailto:${EMAILS.school}`}
            >
              {EMAILS.school} <Arrow dir="ne" />
            </a>
          </motion.div>
          <div className="intro-actions">
            <motion.div
              variants={children_custom}
              custom={0.5}
            >
              <ButtonLink
                to="/work"
                variant="primary"
              >
                CASE STUDIES <Arrow dir="right" />
              </ButtonLink>
            </motion.div>
            <motion.div
              variants={children_custom}
              custom={0.6}
            >
              <ButtonLink
                to="/about"
                variant="secondary"
              >
                ABOUT
              </ButtonLink>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
