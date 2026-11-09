import { motion } from "motion/react";

import { staggerContainer, fadeUp } from "../../lib/animations";
import { EMAILS, SOCIALS } from "../../data/site";
import Arrow from "../ui/Arrow";

// Footer

export default function Footer() {
  return (
    <footer className="site-footer">
      <motion.div
        className="site-footer-grid"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        {/* Aside */}
        <motion.div className="site-footer-column site-footer-aside">
          <motion.h2 variants={fadeUp}>Aside</motion.h2>
          <motion.p
            className="body-lg"
            variants={fadeUp}
          >
            Typeset in The Seasons and Geist. Built in React, designed in Figma.
          </motion.p>
        </motion.div>
        {/* Contact */}
        <motion.div className="site-footer-column">
          <motion.h2 variants={fadeUp}>Get in touch</motion.h2>
          <motion.p
            className="body-lg"
            variants={fadeUp}
          >
            Westchester, NY
          </motion.p>
          {[EMAILS.school, EMAILS.personal].map((email) => (
            <motion.a
              key={email}
              className="body-lg"
              href={`mailto:${email}`}
              variants={fadeUp}
            >
              {email} <Arrow dir="ne" />
            </motion.a>
          ))}
        </motion.div>
        {/* Elsewhere */}
        <motion.div className="site-footer-column">
          <motion.h2 variants={fadeUp}>Elsewhere</motion.h2>
          {SOCIALS.map(({ label, href }) => (
            <motion.a
              key={label}
              className="body-lg"
              target="_blank"
              rel="noopener noreferrer"
              href={href}
              variants={fadeUp}
            >
              {label} <Arrow dir="ne" />
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
      {/* Bottom bar */}
      <motion.div
        className="site-footer-bottom"
        variants={fadeUp}
      >
        <p className="text-label">© Kai Harashima &nbsp;✦&nbsp; {new Date().getFullYear()}</p>
        <p className="text-label">Design portfolio</p>
        <button
          type="button"
          className="site-footer-top-link"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <span className="text-label">
            <Arrow
              dir="up"
              lead
            />{" "}
            Back to top
          </span>
        </button>
      </motion.div>
    </footer>
  );
}
