import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, Variants } from "motion/react";
import { BLUR_IN, BLUR_NONE } from "../../lib/animations";
import type { Project } from "../../types/project";
interface Props {
  projects: Project[];
  index: number | null;
  onChange: (index: number | null) => void;
}

const SHIFT = 24;
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

  const step = (delta: number) => {
    if (index === null || total === 0) return;
    dirRef.current = delta < 0 ? -1 : 1;
    onChange((index + delta + total) % total);
  };

  useEffect(() => {
    if (index !== null) setShown({ item: projects[index], index });
  }, [index, projects]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "Tab") {
        const items = Array.from(
          rootRef.current?.querySelectorAll<HTMLElement>(
            'button:not([tabindex="-1"])',
          ) ?? [],
        );
        if (items.length === 0) return;
        const i = items.indexOf(document.activeElement as HTMLElement);
        const next = e.shiftKey
          ? items[(i - 1 + items.length) % items.length]
          : items[(i + 1) % items.length];
        e.preventDefault();
        next.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, total, onChange]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      if (rootRef.current?.contains(document.activeElement)) {
        (document.activeElement as HTMLElement).blur();
      }
    };
  }, [open]);

  const tab = open ? 0 : -1;
  const dir = dirRef.current;
  const swallow = (e: React.MouseEvent) => e.stopPropagation();

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchRef.current;
    touchRef.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) {
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
          <div className="lightbox-bar">
            <h3>
              {String(shown.index + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </h3>
            <button
              ref={closeRef}
              type="button"
              className="lightbox-control"
              onClick={() => onChange(null)}
              aria-label="Close"
              tabIndex={tab}
            >
              <h2>Close</h2>
            </button>
          </div>

          <div className="lightbox-inner">
            <div className="lightbox-row">
              <AnimatePresence mode="wait" custom={dir} initial={false}>
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

              <div className="lightbox-side">
                <AnimatePresence mode="wait" custom={dir} initial={false}>
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
                        <h2>Prev</h2>
                      </button>
                      <button
                        type="button"
                        className="lightbox-nav-button"
                        onClick={() => step(1)}
                        aria-label="Next piece"
                        tabIndex={tab}
                      >
                        <h2>Next</h2>
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
