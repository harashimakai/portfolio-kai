import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

import NavLinks from "./NavLinks";
import ThemeToggle from "./ThemeToggle";
import Monogram from "../ui/Monogram";
import { menuPanel } from "../../lib/animations";
import { INTRO } from "../../data/site";

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const focusables = () =>
      Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    const focusTimer = setTimeout(() => focusables()[0]?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setOpen(false);
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const i = items.indexOf(document.activeElement as HTMLElement);
      const step = e.shiftKey ? -1 : 1;
      e.preventDefault();
      items[(i + step + items.length) % items.length].focus();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
      toggleRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <motion.button
        ref={toggleRef}
        className="menu-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        initial={false}
        animate={open ? "open" : "closed"}
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 22.5 16"
        >
          <motion.path
            className="menu-toggle-line"
            variants={{
              closed: { d: "M 2 2.5 L 20 2.5" },
              open: { d: "M 3 16.5 L 17 2.5" },
            }}
          />
          <motion.path
            className="menu-toggle-line"
            d="M 2 9.423 L 20 9.423"
            variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
            transition={{ duration: 0.1 }}
          />
          <motion.path
            className="menu-toggle-line"
            variants={{
              closed: { d: "M 2 16.346 L 20 16.346" },
              open: { d: "M 3 2.5 L 17 16.346" },
            }}
          />
        </svg>
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            ref={panelRef}
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            variants={menuPanel}
            initial="hidden"
            animate="visible"
            exit="hidden"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 1, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80 || info.velocity.x < -400) setOpen(false);
            }}
          >
            <Link
              to="/"
              className="mobile-menu-logo"
              aria-label="Home"
              onClick={() => setOpen(false)}
            >
              <Monogram />
            </Link>
            <p className="mobile-menu-intro body-lg">{INTRO}</p>
            <nav className="mobile-menu-links">
              <NavLinks />
            </nav>
            <hr />
            <ThemeToggle showLabel />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
