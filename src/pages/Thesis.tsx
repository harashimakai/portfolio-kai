import { motion } from "motion/react";
import { children } from "../components/global/AnimationConsts";
import { useEffect } from "react";

import "../css/about.css";

import AboutMain from "../components/about/AboutMain";
import AboutSecond from "../components/about/AboutSecond";
import AboutSplash from "../components/about/AboutSplash";

interface Props {
  setSideOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Thesis({ setSideOpen }: Props) {
  useEffect(() => {
    window.scrollTo(0, 0);
    setSideOpen(false);
  }, []);

  return (
    <>
      <AboutMain></AboutMain>
      <motion.hr
        variants={children}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      ></motion.hr>
      <AboutSecond></AboutSecond>
      <motion.hr
        variants={children}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      ></motion.hr>
      <AboutSplash></AboutSplash>
    </>
  );
}
