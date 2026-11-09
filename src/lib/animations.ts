import { stagger } from "motion/react";

// Blur

export const BLUR_IN = "blur(2px)";
export const BLUR_NONE = "blur(0px)";

// Variants

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { delayChildren: stagger(0.15) },
  },
};
export const fadeUp = {
  hidden: { opacity: 0, y: 10, filter: BLUR_IN },
  visible: {
    opacity: 1,
    y: 0,
    filter: BLUR_NONE,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};
export const fadeUpDelayed = {
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

// Scroll reveal

const ITEM_START = 0.1;
const ITEM_STEP = 0.15;

const REVEAL_AMOUNT = 0.2;

const onScroll = (amount: number) => ({
  initial: "hidden" as const,
  whileInView: "visible" as const,
  viewport: { once: true, amount },
});

export const reveal = (delay = 0) => ({
  ...onScroll(REVEAL_AMOUNT),
  variants: fadeUpDelayed,
  custom: delay,
});

export const revealGroup = (amount = REVEAL_AMOUNT) => ({
  ...onScroll(amount),
  variants: staggerContainer,
});

export const revealItem = (i: number) => ({
  variants: fadeUpDelayed,
  custom: ITEM_START + i * ITEM_STEP,
});
