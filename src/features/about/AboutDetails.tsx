import { useRef, useState } from "react";
import { motion } from "motion/react";
import useMediaQuery from "../../hooks/useMediaQuery";
import { TABLET_QUERY } from "../../lib/media";
import { fadeUpDelayed } from "../../lib/animations";

import SectionDivider from "../../components/ui/SectionDivider";
import { EDUCATION, EXPERIENCES, SKILLS } from "../../data/about";

// Constants

const EDUCATION_START = 1.2;
const EDUCATION_STEP = 0.2;
const LEFT_END =
  EDUCATION_START + EDUCATION.length * EDUCATION_STEP;

// Details

export default function AboutDetails() {
  const stacked = useMediaQuery(TABLET_QUERY);
  const leftStart = useRef(0);
  const [rightShown, setRightShown] = useState(false);
  const [rightOffset, setRightOffset] = useState(0);

  // Handlers

  const showRight = () => {
    if (rightShown) return;
    const elapsed = leftStart.current
      ? (performance.now() - leftStart.current) / 1000
      : 0;
    setRightOffset(stacked ? Math.max(0, LEFT_END - elapsed) : 0);
    setRightShown(true);
  };

  return (
    <>
      <SectionDivider />
      <section className="about-content-secondary">
        <div className="about-body-secondary">
          {/* Left column */}
          <motion.div
            className="about-secondary-block"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            onViewportEnter={() => {
              leftStart.current ||= performance.now();
            }}
          >
            <motion.h2
              className="text-heading"
              variants={fadeUpDelayed}
              custom={0}
            >
              Repertoire
            </motion.h2>
            <div className="about-skills">
              {SKILLS.map((g, i) => (
                <motion.div
                  key={g.group}
                  variants={fadeUpDelayed}
                  custom={i * 0.2 + 0.2}
                >
                  <h3 className="about-skill-group text-label">{g.group}</h3>
                  <div className="about-skill-list">
                    {g.items.map((it) => (
                      <span
                        key={it}
                        className="about-tool-pill"
                      >
                        <span className="text-label-sm">{it}</span>
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.h2
              className="about-secondary-next text-heading"
              variants={fadeUpDelayed}
              custom={1.0}
            >
              Education
            </motion.h2>
            <div className="about-education">
              {EDUCATION.map((e, i) => (
                <motion.div
                  key={e.school}
                  className="about-education-entry"
                  variants={fadeUpDelayed}
                  custom={EDUCATION_START + i * EDUCATION_STEP}
                >
                  <span className="about-education-star">✦</span>
                  <div>
                    <div className="about-education-name entry-title">{e.school}</div>
                    <div className="about-education-program body-sm">{e.program}</div>
                    <p className="about-education-year text-label">{e.year}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          {/* Right column */}
          <motion.div
            className="about-secondary-block"
            initial="hidden"
            animate={rightShown ? "visible" : "hidden"}
            viewport={{ once: true }}
            onViewportEnter={showRight}
          >
            <motion.h2
              className="text-heading"
              variants={fadeUpDelayed}
              custom={rightOffset}
            >
              <span className="font-ss04">Experiences</span>
            </motion.h2>
            <div className="about-experiences">
              {EXPERIENCES.map((x, i) => (
                <motion.div
                  key={x.title}
                  className="about-experiences-item"
                  variants={fadeUpDelayed}
                  custom={rightOffset + 0.25 + i * 0.25}
                >
                  <p className="about-experiences-date text-label">{x.date}</p>
                  <div className="about-experiences-title entry-title">{x.title}</div>
                  <div className="about-experiences-role body-sm">{x.role}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
