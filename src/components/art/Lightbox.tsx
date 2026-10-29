import { useEffect, useRef, useState } from "react";
import { Project } from "../global/ProjectData";
import "../../css/art.css";

interface Props {
  projects: Project[];
  index: number | null;
  onChange: (index: number | null) => void;
}

/* The dialog stays mounted and fades with a CSS transition. It keeps the
   last opened piece while closing, so nothing swaps or remounts under the
   fade-out. It renders in place rather than through a portal so it sits
   inside the theme wrapper and inherits the colour variables.             */
export default function Lightbox({ projects, index, onChange }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = index !== null;
  const [shown, setShown] = useState<{ item: Project; index: number } | null>(
    null,
  );

  useEffect(() => {
    if (index !== null) setShown({ item: projects[index], index });
  }, [index, projects]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onChange]);

  const total = projects.length;

  return (
    <div
      className="lightbox"
      data-open={open ? "true" : "false"}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      aria-label={shown?.item.title}
      onClick={() => onChange(null)}
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
              tabIndex={open ? 0 : -1}
            >
              <h2>CLOSE</h2>
            </button>
          </div>

          <div className="lightbox-inner">
            {/* Only the image and the label swallow clicks; anywhere else
                in the dialog closes it. */}
            <div className="lightbox-row">
              <figure
                className="lightbox-figure"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={shown.item.expandedUrl ?? shown.item.thumbnailUrl}
                  alt={shown.item.title}
                  decoding="async"
                />
              </figure>
              {/* Wall label: title, then medium and year, then the text. */}
              <aside
                className="lightbox-info"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="lightbox-title entry-title">{shown.item.title}</p>
                <h3 className="lightbox-meta">
                  {shown.item.medium} · {shown.item.year}
                </h3>
                <p className="lightbox-desc body-xs">
                  {shown.item.fullDescription ?? shown.item.shortDescription}
                </p>
              </aside>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
