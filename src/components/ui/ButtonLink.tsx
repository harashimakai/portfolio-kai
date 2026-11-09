import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

const MotionLink = motion.create(Link);

interface Props {
  to: string;
  variant: "primary" | "secondary";
  children: ReactNode;
}

// Button link

export default function ButtonLink({ to, variant, children }: Props) {
  return (
    <MotionLink
      to={to}
      className={`button button-${variant}`}
      whileHover={{ scale: 1.05 }}
    >
      <span className="text-label-sm">{children}</span>
    </MotionLink>
  );
}
