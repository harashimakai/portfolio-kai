import { easeInOut, easeOut, stagger } from "motion/react";

export const container_l = {
  hidden: {},
  visible: {
    transition: { delayChildren: stagger(0.8) },
  },
};
export const container_m = {
  hidden: {},
  visible: {
    transition: { delayChildren: stagger(0.15) },
  },
};
export const container_s = {
  hidden: {},
  visible: {
    transition: { delayChildren: stagger(0.2) },
  },
};
export const children = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, easeInOut },
  },
};
export const container_trigger = {
  hidden: {},
  visible: {},
};
export const children_custom = {
  hidden: { opacity: 0, y: 10 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, easeInOut },
  }),
};
export const delay_entry = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.8,
      opacity: { ease: "easeOut" },
      y: { ease: [0.2, 0.7, 0.2, 1] as const },
    },
  },
};
export const sidebar = {
  hidden: {
    opacity: 0,
    x: -800,
    transition: { duration: 0.3 },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
};
