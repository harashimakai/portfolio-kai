import { motion } from "motion/react";
import { container_m } from "../../lib/animations";

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.7, ease: [0.4, 0, 0.3, 1] as const },
  },
};

interface Props {
  fullWidth?: boolean;
}

export default function SectionDivider({ fullWidth = false }: Props) {
  return (
    <div
      className={fullWidth ? "section-divider section-divider-full" : "section-divider"}
    >
      <motion.div
        className="section-divider-inner"
        variants={container_m}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div
          className="section-divider-line"
          variants={lineVariants}
          style={{ originX: 0 }}
        />
      </motion.div>
    </div>
  );
}
