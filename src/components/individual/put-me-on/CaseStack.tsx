import { motion } from "motion/react";
import { ReactNode } from "react";
import { children_custom, container_m } from "../../global/AnimationConsts";

interface Props {
  bullets: ReactNode[];
  dark?: boolean;
}

export default function CaseStack({ bullets, dark = false }: Props) {
  return (
    <motion.ul
      variants={container_m}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="case-stack"
    >
      {bullets.map((b, idx) => (
        <motion.li
          variants={children_custom}
          custom={idx * 0.3}
          key={idx}
        >
          <span className="case-stack-index">0{idx + 1}.</span>
          <p
            className={`case-section-small-text ${dark ? "case-light" : "case-dark"}`}
          >
            {b}
          </p>
        </motion.li>
      ))}
    </motion.ul>
  );
}
