import { motion } from "motion/react";
import { children_custom, container_trigger } from "../global/AnimationConsts";

import SectionDiv from "../global/SectionDiv";
import ToolPill from "./ToolPill";

const TOOLS = [
  {
    group: "DESIGN",
    items: ["ILLUSTRATOR", "FIGMA"],
  },
  {
    group: "DEVELOPMENT",
    items: ["PYTHON", "JAVA", "REACT", "TYPESCRIPT", "CSS", "HTML"],
  },
  {
    group: "FINE ARTS",
    items: ["OIL PAINT", "CALLIGRAPHY", "CNC", "SOLDERING", "LASER ENGRAVING"],
  },
  { group: "BIOLOGY", items: ["WET LAB", "IMMUNOLOGY", "CANCER BIOLOGY"] },
];

const EDUCATION = [
  {
    school: "Cornell University",
    program: "Computer Science",
    year: "CLASS OF 2029",
  },
  {
    school: "Greenwich Country Day School",
    program: "Computer Science & Visual Arts",
    year: "CLASS OF 2025",
  },
];

const EXPERIENCES = [
  {
    date: "FEB 2025 — PRESENT",
    title: "Digital Tech & Innovation @ Cornell",
    role: "UI/UX Designer",
  },
  {
    date: "JUN 2025 — AUG 2025",
    title: "Pine Island Wilderness Camp",
    role: "Sailing Instructor and Counselor",
  },
  {
    date: "JAN 2024 — AUG 2024",
    title: "Children's Brain Tumor Project @ Weill Cornell Medical",
    role: "Research Intern",
  },
  {
    date: "2018 — PRESENT",
    title: "The Love4Lucas Foundation",
    role: "Volunteer",
  },
  {
    date: "MAY 2025",
    title: "QP Global Family Offices",
    role: "Business Analyst Intern",
  },
];

export default function AboutSecond() {
  return (
    <>
      <SectionDiv
        left="// 03 — TECHNICAL TOOLKIT"
        right="EXPERIENCE & SKILLS"
      ></SectionDiv>
      <section className="about-content-secondary">
        <div className="about-body-secondary">
          <motion.div
            className="about-secondary-block"
            variants={container_trigger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h1
              variants={children_custom}
              custom={0}
            >
              Toolkit
            </motion.h1>
            <div className="about-skills">
              {TOOLS.map((g, i) => (
                <motion.div
                  key={g.group}
                  variants={children_custom}
                  custom={i * 0.2 + 0.2}
                >
                  <h2 className="about-skill-group">{g.group}</h2>
                  <div className="about-skill-list">
                    {g.items.map((it) => (
                      <ToolPill key={it}>{it}</ToolPill>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.h1
              style={{ margin: "56px 0 28px" }}
              variants={children_custom}
              custom={1.0}
            >
              Education
            </motion.h1>
            <div className="about-education">
              {EDUCATION.map((e, i) => (
                <motion.div
                  key={e.school}
                  className="about-education-list"
                  variants={children_custom}
                  custom={i * 0.2 + 1.2}
                >
                  <span className="about-education-star">✦</span>
                  <div>
                    <div className="about-education-name">{e.school}</div>
                    <div className="about-education-program">{e.program}</div>
                    <div className="about-education-year">{e.year}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            className="about-secondary-block"
            variants={container_trigger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h1
              variants={children_custom}
              custom={0}
            >
              <span className="alternative_c">Experiences</span>
            </motion.h1>
            <div className="about-experiences">
              {EXPERIENCES.map((x, i) => (
                <motion.div
                  key={x.title}
                  className="about-experiences-item"
                  variants={children_custom}
                  custom={i * 0.25 + 0.25}
                >
                  <div className="about-experiences-date">{x.date}</div>
                  <div className="about-experiences-title">{x.title}</div>
                  <div className="about-experiences-role">{x.role}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
