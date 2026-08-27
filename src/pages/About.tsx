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
        <motion.div
          variants={container_m}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            variants={children_custom}
            custom={0}
          >
            // 01 — ABOUT
          </motion.h2>
          <div className="about-status">
            <motion.h1
              className="about-hero"
              variants={children_custom}
              custom={0.15}
            >
              KAI H<span className="alternative_c">A</span>RASHIMA
            </motion.h1>
            <div className="about-status-links">
              <motion.a
                className="underline-hover"
                target="_blank"
                href="https://drive.google.com/file/d/11wb1SoarL96mU4PIX8ObmXxljO8bAm7y/view?usp=sharing"
                variants={children_custom}
                custom={0.3}
              >
                RÉSUMÉ {"\u2197\uFE0E"}
              </motion.a>
              <motion.a
                className="underline-hover"
                target="_blank"
                href="mailto:harashimakai@gmail.com"
                variants={children_custom}
                custom={0.45}
              >
                EMAIL {"\u2197\uFE0E"}
              </motion.a>
              <motion.a
                className="underline-hover"
                target="_blank"
                href="https://www.linkedin.com/in/kai-harashima-109164364"
                variants={children_custom}
                custom={0.6}
              >
                LINKEDIN {"\u2197\uFE0E"}
              </motion.a>
            </div>
          </div>
        </motion.div>
      </section>

      <AboutMain />

      <AboutSecond />

      <AboutSplash />
    </>
  );
}
