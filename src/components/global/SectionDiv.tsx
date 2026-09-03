import { motion } from "motion/react";
import { container_m } from "./AnimationConsts";

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.7, ease: [0.4, 0, 0.3, 1] as const },
  },
};

interface Props {
  strong?: boolean;
  fullWidth?: boolean;
  id?: string;
}

export default function SectionDiv({ strong, fullWidth, id }: Props) {
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
        <motion.div
          className="divider-line"
          variants={lineVariants}
          style={{ originX: 0 }}
        />
      </motion.div>
    </div>
  );
}
