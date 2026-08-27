import { motion } from "motion/react";
import { children_custom, container_trigger } from "../global/AnimationConsts";

import profile from "../../assets/profile.webp";
import SectionDiv from "../global/SectionDiv";

export default function AboutMain() {
  return (
    <>
      <SectionDiv
        left="// 02 — BIO"
        right="NOW & THEN"
      ></SectionDiv>
      <motion.section
        className="about-body"
        variants={container_trigger}
        initial="hidden"
        animate="visible"
      >
        <div className="about-text-block">
          <motion.p
            variants={children_custom}
            custom={0.4}
          >
            I’ve always felt like I stand at a crossroads. I’m analytical and
            detail-oriented. But I’m also creative, and my eye for design has
            constantly pushed me toward clarity and experimentation in my work.
            For a long time, I felt forced to to choose one—causing these
            aspects of myself to clash—but eventually I realized this overlap is
            actually where my work thrives.
          </motion.p>
          <motion.p
            variants={children_custom}
            custom={0.6}
            style={{ margin: "24px 0 24px" }}
          >
            I’m currently exploring UI/UX at{" "}
            <a
              target="_blank"
              href="https://new.cornelldti.org/"
            >
              Cornell DTI
            </a>
            . Before that, a summer at Weill Cornell Medical College sparked a
            year-long research project on cancer biology: 20 pages of writing
            and 4 infographic posters, translating PhD-level immunology to be
            accessible for anyone—not just scientists. It’s this work that
            convinced me to spend my time designing.
          </motion.p>
          <hr />
          <motion.p
            variants={children_custom}
            custom={0.8}
            style={{ margin: "24px 0 0" }}
          >
            On the technical side: I taught myself Adobe Illustrator and Python
            in high school, and more recently became self-taught in Figma and
            React. This site is my first front-end project.
          </motion.p>
          <motion.p
            variants={children_custom}
            custom={1.0}
            style={{ margin: "24px 0 0" }}
          >
            Outside of work, I crave either speed or stillness: sailing, skiing,
            tennis, and squash on one end; reading, piano, and oil painting and
            on another. I’m also a huge foodie.
          </motion.p>
        </div>
        <motion.div
          variants={children_custom}
          custom={0.4}
        >
          <div className="about-image">
            <img
              src={profile}
              alt="Kai Harashima"
            />
          </div>
          <div className="about-image-caption">
            <span>PORTRAIT</span>
            <span>WESTCHESTER, NY · 2025</span>
          </div>
        </motion.div>
      </motion.section>
    </>
  );
}
