import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

import NavLinks from "./NavLinks";
import ThemeToggle from "./ThemeToggle";
import Monogram from "../ui/Monogram";
import useDialog from "../../hooks/useDialog";
import { menuPanel } from "../../lib/animations";
import { INTRO } from "../../data/site";

// Constants

const MENU_FOCUS_DELAY = 50;
const SWIPE_CLOSE_OFFSET = -80;
const SWIPE_CLOSE_VELOCITY = -400;

// Mobile menu

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();

  // Effects

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useDialog(panelRef, {
    open,
    onClose: () => setOpen(false),
    returnFocus: toggleRef,
    focusDelay: MENU_FOCUS_DELAY,
  });

  return (
    <>
      {/* Toggle */}
      <motion.button
        ref={toggleRef}
        type="button"
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
          aria-hidden="true"
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

      {/* Panel */}
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
              if (info.offset.x < SWIPE_CLOSE_OFFSET || info.velocity.x < SWIPE_CLOSE_VELOCITY) setOpen(false);
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
