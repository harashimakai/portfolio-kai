import { motion } from "motion/react";
import CasePill from "./CasePill";
import { children_custom, container_m } from "../../global/AnimationConsts";

interface Props {
  pill?: string;
  title: React.ReactNode;
  dark?: boolean;
  sub?: boolean;
  small?: boolean;
  column?: boolean;
  columnBody?: React.ReactNode;
}

export default function CaseBand({
  pill,
  title,
  dark = false,
  sub = false,
  small = false,
  column = false,
  columnBody,
}: Props) {
  return (
    <motion.div
      variants={container_m}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      className={column ? "case-double-content" : undefined}
    >
      <motion.div
        variants={children_custom}
        custom={0}
      >
        {pill && (
          <CasePill color={dark ? undefined : "var(--cs-bg)"}> {pill}</CasePill>
        )}
        <motion.h1
          variants={children_custom}
          custom={0.15}
          className={
            dark
              ? sub
                ? "case-section-subheading case-light"
                : small
                  ? "case-section-small-heading case-light"
                  : "case-section-heading case-light"
              : sub
                ? "case-section-subheading case-dark"
                : small
                  ? "case-section-small-heading case-dark"
                  : "case-section-heading case-dark"
          }
        >
          {title}
        </motion.h1>
      </motion.div>
      {columnBody && (
        <motion.div
          variants={children_custom}
          custom={0.3}
          className="case-section-container"
        >
          <p
            className={
              dark
                ? "case-section-body case-light"
                : "case-section-body case-dark"
            }
          >
            {columnBody}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
