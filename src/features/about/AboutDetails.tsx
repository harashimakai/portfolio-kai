import { useRef, useState } from "react";
import { motion } from "motion/react";
import useMediaQuery from "../../hooks/useMediaQuery";
import { children_custom } from "../../lib/animations";

import SectionDivider from "../../components/ui/SectionDivider";
import { EDUCATION, EXPERIENCES, SKILLS } from "../../data/about";

const EDUCATION_START = 1.2;
const EDUCATION_STEP = 0.2;
const LEFT_END =
  EDUCATION_START + EDUCATION.length * EDUCATION_STEP;

export default function AboutDetails() {
  const stacked = useMediaQuery("(max-width: 1189px)");
  const leftStart = useRef(0);
  const [rightShown, setRightShown] = useState(false);
  const [rightOffset, setRightOffset] = useState(0);

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
          <motion.div
            className="about-secondary-block"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            onViewportEnter={() => {
              leftStart.current ||= performance.now();
            }}
          >
            <motion.h1
              variants={children_custom}
              custom={0}
            >
              Repertoire
            </motion.h1>
            <div className="about-skills">
              {SKILLS.map((g, i) => (
                <motion.div
                  key={g.group}
                  variants={children_custom}
                  custom={i * 0.2 + 0.2}
                >
                  <h2 className="about-skill-group">{g.group}</h2>
                  <div className="about-skill-list">
                    {g.items.map((it) => (
                      <span
                        key={it}
                        className="tool-pill"
                      >
                        <h3>{it}</h3>
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.h1
              className="about-secondary-next"
              variants={children_custom}
              custom={1.0}
            >
              Education
            </motion.h1>
            <div className="about-education">
              {EDUCATION.map((e, i) => (
                <motion.div
                  key={e.school}
                  className="about-education-entry"
                  variants={children_custom}
                  custom={EDUCATION_START + i * EDUCATION_STEP}
                >
                  <span className="about-education-star">✦</span>
                  <div>
                    <div className="about-education-name entry-title">{e.school}</div>
                    <div className="about-education-program body-sm">{e.program}</div>
                    <h2 className="about-education-year">{e.year}</h2>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            className="about-secondary-block"
            initial="hidden"
            animate={rightShown ? "visible" : "hidden"}
            viewport={{ once: true }}
            onViewportEnter={showRight}
          >
            <motion.h1
              variants={children_custom}
              custom={rightOffset}
            >
              <span className="font-ss04">Experiences</span>
            </motion.h1>
            <div className="about-experiences">
              {EXPERIENCES.map((x, i) => (
                <motion.div
                  key={x.title}
                  className="about-experiences-item"
                  variants={children_custom}
                  custom={rightOffset + 0.25 + i * 0.25}
                >
                  <h2 className="about-experiences-date">{x.date}</h2>
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
