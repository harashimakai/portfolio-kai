import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { sidebar } from "./AnimationConsts";


import NavButton from "./NavButton";
import DarkButton from "./DarkButton";
import Monogram from "./Monogram";

type SidebarProps = {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  sideOpen: boolean;
  setSideOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Sidebar({
  darkMode,
  setDarkMode,
  sideOpen,
  setSideOpen,
}: SidebarProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = sideOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sideOpen]);

  /* While open: focus moves in, Tab cycles inside, Escape closes, and
     focus returns to the menu button on close.                           */
  useEffect(() => {
    if (!sideOpen) return;
    const focusables = () =>
      Array.from(
        rootRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
    const t = setTimeout(() => focusables()[0]?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSideOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const i = items.indexOf(document.activeElement as HTMLElement);
      const next = e.shiftKey
        ? items[(i - 1 + items.length) % items.length]
        : items[(i + 1) % items.length];
      e.preventDefault();
      next.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.querySelector<HTMLElement>(".menu-button")?.focus();
    };
  }, [sideOpen, setSideOpen]);

  return (
    <AnimatePresence initial={false}>
      {sideOpen ? (
        <motion.div
          ref={rootRef}
          className="sidebar"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          variants={sidebar}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <div className="navbar-logos">
            <Monogram />
          </div>

          <p className="sidebar-mission body-lg">
            I’m Kai, a student at Cornell exploring the intersection of
            computer science and design.
          </p>

          <NavButton
            to="/"
            label="HOME"
          />
          <NavButton
            to="/work"
            label="WORK"
            alsoActive={["/putmeon"]}
          />
          <NavButton
            to="/art"
            label="ART"
          />
          <NavButton
            to="/about"
            label="ABOUT"
          />
          <hr />
          <DarkButton
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
