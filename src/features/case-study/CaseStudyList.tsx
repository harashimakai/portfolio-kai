import { motion } from "motion/react";
import { fadeUpDelayed } from "../../lib/animations";
import CaseStudyCard from "./CaseStudyCard";
import type { StudyCard } from "../../types/caseStudy";

// Types

interface Props {
  studies: StudyCard[];
  className: string;
  delay: number;
}

// List

export default function CaseStudyList({ studies, className, delay }: Props) {
  return (
    <section className={className}>
      {studies.map((item) => (
        <motion.div
          key={item.slug}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpDelayed}
          custom={delay}
        >
          <CaseStudyCard item={item} />
        </motion.div>
      ))}
    </section>
  );
}
