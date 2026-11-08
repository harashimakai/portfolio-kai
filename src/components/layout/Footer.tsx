import { motion } from "motion/react";
import { container_m, children } from "../../lib/animations";
import { EMAILS, SOCIALS } from "../../data/site";
import Arrow from "../ui/Arrow";

export default function Footer() {
  return (
    <footer className="site-footer">
      <motion.div
        className="site-footer-grid"
        variants={container_m}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <motion.div className="site-footer-column site-footer-aside">
          <motion.h2 variants={children}>Aside</motion.h2>
          <motion.p
            className="body-lg"
            variants={children}
          >
            Typeset in The Seasons and Geist. Built in React, designed in Figma.
          </motion.p>
        </motion.div>
        <motion.div className="site-footer-column">
          <motion.h2 variants={children}>Get in touch</motion.h2>
          <motion.p
            className="body-lg"
            variants={children}
          >
            Westchester, NY
          </motion.p>
          {[EMAILS.school, EMAILS.personal].map((email) => (
            <motion.a
              key={email}
              className="body-lg"
              href={`mailto:${email}`}
              variants={children}
            >
              {email} <Arrow dir="ne" />
            </motion.a>
          ))}
        </motion.div>
        <motion.div className="site-footer-column">
          <motion.h2 variants={children}>Elsewhere</motion.h2>
          {SOCIALS.map(({ label, href }) => (
            <motion.a
              key={label}
              className="body-lg"
              target="_blank"
              href={href}
              variants={children}
            >
              {label} <Arrow dir="ne" />
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
      <motion.div
        className="site-footer-bottom"
        variants={children}
      >
        <h2>© Kai Harashima &nbsp;✦&nbsp; {new Date().getFullYear()}</h2>
        <h2>Design portfolio</h2>
        <button
          className="site-footer-top-link"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <h2>
            <Arrow
              dir="up"
              lead
            />{" "}
            Back to top
          </h2>
        </button>
      </motion.div>
    </footer>
  );
}
