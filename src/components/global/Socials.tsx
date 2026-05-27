import { motion } from "motion/react";
import { container_s, children } from "./AnimationConsts";

export default function Socials() {
  return (
    <footer className="social-container">
      <motion.div
        className="social-grid"
        variants={container_s}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <motion.div className="social-box social-box-aside">
          <motion.h1 variants={children}>// ASIDE</motion.h1>
          <motion.p variants={children}>
            Set in The Seasons and Inter Tight. Built in React, designed in
            Figma.
          </motion.p>
        </motion.div>
        <motion.div className="social-box">
          <motion.h1 variants={children}>GET IN TOUCH</motion.h1>
          <motion.p variants={children}>Westchester, NY</motion.p>
          <motion.p variants={children}>kh862@cornell.edu</motion.p>
          <motion.p variants={children}>harashimakai@gmail.com</motion.p>
        </motion.div>
        <motion.div className="social-box">
          <motion.h1 variants={children}>ELSEWHERE</motion.h1>
          <motion.a
            target="_blank"
            href="https://www.instagram.com/kaiharashima/"
            variants={children}
          >
            Instagram →
          </motion.a>
          <motion.a
            target="_blank"
            href="https://www.linkedin.com/in/kai-harashima-109164364"
            variants={children}
          >
            LinkedIn →
          </motion.a>
          <motion.a variants={children}>Github →</motion.a>
        </motion.div>
      </motion.div>
      <motion.div
        className="social-bottom"
        variants={children}
      >
        <h2>© KAI HARASHIMA — MMXXVI</h2>
        <h2>PORTFOLIO II · No. 02 / 02</h2>
        <button
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑ BACK TO TOP
        </button>
      </motion.div>
    </footer>
  );
}
