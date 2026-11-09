import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type TouchEvent,
} from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";

import useDialog from "../../hooks/useDialog";
import { BLUR_IN, BLUR_NONE } from "../../lib/animations";
import type { Project } from "../../types/project";

// Types

interface Props {
  projects: Project[];
  index: number | null;
  onChange: (index: number | null) => void;
}

// Constants

const SHIFT = 24;
const SWIPE_MIN_PX = 48;
const SWIPE_AXIS_RATIO = 1.5;
const glide = { duration: 0.4, ease: "easeInOut" as const };
const slide: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: SHIFT * dir, filter: BLUR_IN }),
  center: { opacity: 1, x: 0, filter: BLUR_NONE, transition: glide },
  exit: (dir: number) => ({
    opacity: 0,
    x: -SHIFT * dir,
    filter: BLUR_IN,
    transition: glide,
  }),
};

// Lightbox

export default function Lightbox({ projects, index, onChange }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const dirRef = useRef(1);
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const open = index !== null;
  const [shown, setShown] = useState<{ item: Project; index: number } | null>(
    null,
  );

  const total = projects.length;

  // Navigation

  const step = (delta: number) => {
    if (index === null || total === 0) return;
    dirRef.current = delta < 0 ? -1 : 1;
    onChange((index + delta + total) % total);
  };

  // Effects

  useEffect(() => {
    if (index !== null) setShown({ item: projects[index], index });
  }, [index, projects]);

  useDialog(rootRef, {
    open,
    onClose: () => onChange(null),
    initialFocus: closeRef,
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, total, onChange]);

  // Handlers

  const tab = open ? 0 : -1;
  const dir = dirRef.current;
  const swallow = (e: MouseEvent) => e.stopPropagation();

  const onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: TouchEvent) => {
    const start = touchRef.current;
    touchRef.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > SWIPE_MIN_PX && Math.abs(dx) > Math.abs(dy) * SWIPE_AXIS_RATIO) {
      step(dx < 0 ? 1 : -1);
    }
  };

  return (
    <div
      ref={rootRef}
      className="lightbox"
      data-open={open ? "true" : "false"}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      aria-label={shown?.item.title}
      onClick={() => onChange(null)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {shown && (
        <>
          {/* Bar */}
          <div className="lightbox-bar">
            <p className="text-label-sm">
              {String(shown.index + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </p>
            <button
              ref={closeRef}
              type="button"
              className="lightbox-control"
              onClick={() => onChange(null)}
              aria-label="Close"
              tabIndex={tab}
            >
              <span className="text-label">Close</span>
            </button>
          </div>

          <div className="lightbox-inner">
            <div className="lightbox-row">
              {/* Image */}
              <AnimatePresence
                mode="wait"
                custom={dir}
                initial={false}
              >
                <motion.figure
                  key={shown.item.id}
                  className="lightbox-figure"
                  variants={slide}
                  custom={dir}
                  initial="enter"
                  animate={open ? "center" : "enter"}
                  exit="exit"
                  onClick={swallow}
                >
                  <img
                    src={shown.item.expandedUrl ?? shown.item.thumbnailUrl}
                    alt={shown.item.title}
                    decoding="async"
                  />
                </motion.figure>
              </AnimatePresence>

              {/* Info */}
              <div className="lightbox-side">
                <AnimatePresence
                  mode="wait"
                  custom={dir}
                  initial={false}
                >
                  <motion.div
                    key={shown.item.id}
                    className="lightbox-side-inner"
                    variants={slide}
                    custom={dir}
                    initial="enter"
                    animate={open ? "center" : "enter"}
                    exit="exit"
                    onClick={swallow}
                  >
                    <aside className="lightbox-info">
                      <p className="lightbox-title entry-title">
                        {shown.item.title}
                      </p>
                      <p className="lightbox-meta body-xs">
                        {shown.item.medium} · {shown.item.year}
                      </p>
                      <p className="lightbox-desc body-xs">
                        {shown.item.fullDescription ??
                          shown.item.shortDescription}
                      </p>
                    </aside>

                    <div className="lightbox-nav">
                      <button
                        type="button"
                        className="lightbox-nav-button"
                        onClick={() => step(-1)}
                        aria-label="Previous piece"
                        tabIndex={tab}
                      >
                        <span className="text-label">Prev</span>
                      </button>
                      <button
                        type="button"
                        className="lightbox-nav-button"
                        onClick={() => step(1)}
                        aria-label="Next piece"
                        tabIndex={tab}
                      >
                        <span className="text-label">Next</span>
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
