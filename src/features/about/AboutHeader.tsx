import { motion } from "motion/react";
import { fadeUpDelayed, staggerContainer } from "../../lib/animations";
import { EMAILS, LINKS } from "../../data/site";
import Arrow from "../../components/ui/Arrow";

// Links

const HEADER_LINKS = [
  { label: "Résumé", href: LINKS.resume, external: true },
  { label: "Email", href: `mailto:${EMAILS.personal}`, external: false },
  { label: "LinkedIn", href: LINKS.linkedin, external: true },
];

// Header

export default function AboutHeader() {
  return (
    <section className="about-content">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <div className="about-status">
          <motion.h1
            className="about-hero display"
            variants={fadeUpDelayed}
            custom={0.15}
          >
            KAI H<span className="font-ss04">A</span>RASHIMA
          </motion.h1>
          <div className="about-status-links">
            {HEADER_LINKS.map(({ label, href, external }, i) => (
              <motion.a
                key={label}
                href={href}
                target={external ? "_blank" : undefined}
                variants={fadeUpDelayed}
                custom={0.3 + i * 0.15}
              >
                <span className="text-label underline-hover">
                  {label} <Arrow dir="ne" />
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
