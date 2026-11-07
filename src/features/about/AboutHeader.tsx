import { motion } from "motion/react";
import { children_custom, container_m } from "../../lib/animations";
import { EMAILS, LINKS } from "../../data/site";
import Arrow from "../../components/ui/Arrow";

const HEADER_LINKS = [
  { label: "RÉSUMÉ", href: LINKS.resume, external: true },
  { label: "EMAIL", href: `mailto:${EMAILS.personal}`, external: false },
  { label: "LINKEDIN", href: LINKS.linkedin, external: true },
];

export default function AboutHeader() {
  return (
    <section className="about-content">
      <motion.div
        variants={container_m}
        initial="hidden"
        animate="visible"
      >
        <div className="about-status">
          <motion.h1
            className="about-hero display"
            variants={children_custom}
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
                variants={children_custom}
                custom={0.3 + i * 0.15}
              >
                <h2 className="underline-hover">
                  {label} <Arrow dir="ne" />
                </h2>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
