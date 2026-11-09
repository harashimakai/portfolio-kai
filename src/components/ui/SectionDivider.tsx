import { motion } from "motion/react";
import { staggerContainer } from "../../lib/animations";

// Motion

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.7, ease: [0.4, 0, 0.3, 1] as const },
  },
};

// Types

interface Props {
  fullWidth?: boolean;
}

// Section divider

export default function SectionDivider({ fullWidth = false }: Props) {
  return (
    <div
      className={fullWidth ? "section-divider section-divider-full" : "section-divider"}
    >
      <motion.div
        className="section-divider-inner"
        variants={staggerContainer}
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
