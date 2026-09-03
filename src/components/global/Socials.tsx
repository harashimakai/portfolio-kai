import { motion } from "motion/react";
import { container_s, children } from "./AnimationConsts";

export default function Socials({
  caseStudy = false,
}: {
  caseStudy?: boolean;
}) {
  return (
    <footer
      className="social-container"
      style={caseStudy ? { backgroundColor: "#222225" } : undefined}
    >
      <motion.div
        className="social-grid"
        variants={container_s}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <motion.div className="social-box social-box-aside">
          <motion.h2 variants={children}>ASIDE</motion.h2>
          <motion.p
            className="body-lg"
            variants={children}
          >
            Set in The Seasons and Inter Tight. Built in React, designed in
            Figma.
          </motion.p>
        </motion.div>
        <motion.div className="social-box">
          <motion.h2 variants={children}>GET IN TOUCH</motion.h2>
          <motion.p
            className="body-lg"
            variants={children}
          >Westchester, NY</motion.p>
          <motion.a
            className="body-lg"
            target="_blank"
            href="mailto:kh862@cornell.edu"
            variants={children}
          >
            kh862@cornell.edu &nbsp;
            <span className="sans">{"\u2197\uFE0E"}</span>
          </motion.a>
          <motion.a
            className="body-lg"
            target="_blank"
            href="mailto:harashimakai@gmail.com"
            variants={children}
          >
            harashimakai@gmail.com &nbsp;
            <span className="sans">{"\u2197\uFE0E"}</span>
          </motion.a>
        </motion.div>
        <motion.div className="social-box">
          <motion.h2 variants={children}>ELSEWHERE</motion.h2>
          <motion.a
            className="body-lg"
            target="_blank"
            href="https://www.instagram.com/kaiharashima/"
            variants={children}
          >
            Instagram &nbsp;<span className="sans">{"\u2197\uFE0E"}</span>
          </motion.a>
          <motion.a
            className="body-lg"
            target="_blank"
            href="https://www.linkedin.com/in/kai-harashima-109164364"
            variants={children}
          >
            LinkedIn &nbsp;<span className="sans">{"\u2197\uFE0E"}</span>
          </motion.a>
          <motion.a
            className="body-lg"
            target="_blank"
            href="https://github.com/harashimakai"
            variants={children}
          >
            Github &nbsp;<span className="sans">{"\u2197\uFE0E"}</span>
          </motion.a>
        </motion.div>
      </motion.div>
      <motion.div
        className="social-bottom"
        variants={children}
      >
        <h2>© KAI HARASHIMA · MMXXVI</h2>
        <h2>DESIGN PORTFOLIO · No. 02 / 02</h2>
        <button
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <h2>{"\u2191\uFE0E"} BACK TO TOP</h2>
        </button>
      </motion.div>
    </footer>
  );
}
