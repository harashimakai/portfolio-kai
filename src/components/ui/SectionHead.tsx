import { motion } from "motion/react";
import { Link } from "react-router-dom";

import Arrow from "./Arrow";
import { fadeUpDelayed, staggerContainer } from "../../lib/animations";

// Types

interface Props {
  title: string;
  to: string;
  linkLabel: string;
  className?: string;
}

// Section head

export default function SectionHead({ title, to, linkLabel, className }: Props) {
  return (
    <motion.div
      className={className ? `section-head ${className}` : "section-head"}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <motion.h2
        variants={fadeUpDelayed}
        custom={0}
      >
        {title}
      </motion.h2>
      <motion.div
        variants={fadeUpDelayed}
        custom={0.1}
      >
        <Link
          className="section-head-link"
          to={to}
        >
          <span className="text-label underline-hover">
            {linkLabel} <Arrow dir="right" />
          </span>
        </Link>
      </motion.div>
    </motion.div>
  );
}
