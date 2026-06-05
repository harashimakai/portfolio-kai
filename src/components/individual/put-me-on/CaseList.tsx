import { motion } from "motion/react";
import CasePill from "./CasePill";
import { children_custom, container_m } from "../../global/AnimationConsts";

interface Props {
  bullets: string[];
  dark?: boolean;
  time?: number;
}

export default function CaseList({ bullets, dark = false, time = 0 }: Props) {
  return (
    <motion.ul
      variants={container_m}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      className="case-list"
    >
      {bullets.map((b, idx) => (
        <motion.li
          variants={children_custom}
          custom={time + idx * 0.15}
        >
          <span className="case-accent">-</span>
          <span className={dark ? "case-dark" : "case-light"}>{b}</span>
        </motion.li>
      ))}
    </motion.ul>
  );
}
