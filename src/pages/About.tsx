import { motion } from "motion/react";
import {
  children_custom,
  container_m,
} from "../components/global/AnimationConsts";
import { useEffect } from "react";

import "../css/about.css";

import AboutMain from "../components/about/AboutMain";
import AboutSecond from "../components/about/AboutSecond";
import AboutSplash from "../components/about/AboutSplash";

interface Props {
  setSideOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function About({ setSideOpen }: Props) {
  useEffect(() => {
    window.scrollTo(0, 0);
    setSideOpen(false);
  }, []);

  return (
    <>
      <section className="about-content">
        <motion.div variants={container_m} initial="hidden" animate="visible">
          <motion.h2 variants={children_custom} custom={0}>
            // 01 — ABOUT
          </motion.h2>
          <motion.h1
            className="about-hero"
            variants={children_custom}
            custom={0.15}
          >
            KAI H<span className="alternative_c">A</span>RASHIMA
          </motion.h1>
        </motion.div>
      </section>
      <AboutMain></AboutMain>

      <AboutSecond></AboutSecond>

      <AboutSplash></AboutSplash>
    </>
  );
}
