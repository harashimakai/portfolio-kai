import { stagger } from "motion/react";

export const BLUR_IN = "blur(2px)";
export const BLUR_NONE = "blur(0px)";

export const container_m = {
  hidden: {},
  visible: {
    transition: { delayChildren: stagger(0.15) },
  },
};
export const children = {
  hidden: { opacity: 0, y: 10, filter: BLUR_IN },
  visible: {
    opacity: 1,
    y: 0,
    filter: BLUR_NONE,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};
export const children_custom = {
  hidden: { opacity: 0, y: 10, filter: BLUR_IN },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    filter: BLUR_NONE,
    transition: { duration: 0.5, delay, ease: "easeOut" as const },
  }),
};
export const menuPanel = {
  hidden: { opacity: 0, x: "-100%", transition: { duration: 0.3 } },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};
