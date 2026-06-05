import { motion } from "motion/react";
import { container_m, children, children_custom } from "./AnimationConsts";

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.7, ease: [0.4, 0, 0.3, 1] as const },
  },
};

interface Props {
  left: string;
  right: string;
  strong?: boolean;
  fullWidth?: boolean;
  id?: string;
}

export default function SectionDiv({
  left,
  right,
  strong,
  fullWidth,
  id,
}: Props) {
  return (
    <div
      id={id}
      className={fullWidth ? "divider divider-full" : "divider"}
    >
      <motion.div
        className={
          strong ? "divider-container divider-strong" : "divider-container"
        }
        variants={container_m}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2
          className={
            strong ? "divider-text-strong divider-left" : "divider-left"
          }
          variants={children_custom}
          custom={0}
        >
          {left}
        </motion.h2>
        <motion.div
          className="divider-line"
          variants={lineVariants}
          style={{ originX: 0 }}
        />
        <motion.h2
          className={
            strong ? "divider-text-strong divider-right" : "divider-right"
          }
          variants={children_custom}
          custom={0.65}
        >
          {right}
        </motion.h2>
      </motion.div>
    </div>
  );
}
