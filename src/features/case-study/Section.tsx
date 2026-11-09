import type { ReactNode } from "react";
import { motion } from "motion/react";

import SectionDivider from "../../components/ui/SectionDivider";
import { reveal } from "../../lib/animations";

// Types

export interface SectionProps {
  label?: string;
  id?: string;
  showcase?: boolean;
  children: ReactNode;
}

// Section

export const sectionId = ({ id, label }: Pick<SectionProps, "id" | "label">) =>
  id ?? (label ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function Section({ label, id, showcase = false, children }: SectionProps) {
  const heading = label && (
    <motion.h2
      className="study-section-label"
      {...reveal(0)}
    >
      {label}
    </motion.h2>
  );
  return (
    <>
      <SectionDivider />
      <section
        id={sectionId({ id, label })}
        className="study-section study-flow"
      >
        {showcase ? (
          <div className="study-section-showcase study-flow">
            {heading}
            {children}
          </div>
        ) : (
          <>
            {heading}
            {children}
          </>
        )}
      </section>
    </>
  );
}

// Split

export function Split({ aside, children }: { aside: ReactNode; children: ReactNode }) {
  return (
    <div className="study-split">
      <div className="study-split-main study-flow">{children}</div>
      <div className="study-split-aside">{aside}</div>
    </div>
  );
}
