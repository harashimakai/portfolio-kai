import { AnimatePresence, motion } from "motion/react";
import { sidebar } from "./AnimationConsts";

import monogram from "../../assets/logos/monogram.svg";
import monograml from "../../assets/logos/monogram-light.svg";

import NavButton from "./NavButton";
import DarkButton from "./DarkButton";

type SidebarProps = {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  sideOpen: boolean;
};

export default function Sidebar({
  darkMode,
  setDarkMode,
  sideOpen,
}: SidebarProps) {
  return (
    <AnimatePresence initial={false}>
      {sideOpen ? (
        <motion.div
          className="sidebar"
          variants={sidebar}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <div className="navbar-logos">
            <img src={monogram} alt="Logo" className="monogram m-light" />
            <img src={monograml} alt="Logo" className="monogram m-dark" />
          </div>

          <p className="sidebar-mission">
            Studying the intersection of{" "}
            <span className="italic alternative_b">creative design</span>{" "}
            principles and{" "}
            <span className="italic alternative_b">technical skill</span> in
            computer science and product design.
          </p>

          <NavButton to="/" label="HOME" />
          <NavButton to="/work" label="WORK" />
          <NavButton to="/about" label="ABOUT" />
          <hr />
          <DarkButton darkMode={darkMode} setDarkMode={setDarkMode} />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
