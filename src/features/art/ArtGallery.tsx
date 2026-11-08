import { useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { children_custom } from "../../lib/animations";
import type { Project } from "../../types/project";
export interface TileLayout {
  aspect?: string;
  image?: "thumbnail" | "expanded";
  position?: string;
  naturalOnPhones?: boolean;
}

export type GalleryRow =
  | { kind: "mosaic"; ids: string[]; columns?: string }
  | {
      kind: "feature";
      crop: string;
      natural: string;
      naturalFirst?: boolean;
      height?: string;
      ratio?: string;
    };

interface Props {
  projects: Project[];
  onOpen: (index: number) => void;
  layout: Record<string, TileLayout>;
  rows: GalleryRow[];
}

export default function ArtGallery({
  projects,
  onOpen,
  layout,
  rows,
}: Props) {
  const indexOf = (id: string) => projects.findIndex((p) => p.id === id);
  const named = new Set(
    rows.flatMap((r) =>
      r.kind === "feature" ? [r.crop, r.natural] : r.ids,
    ),
  );
  const rest = projects
    .map((_, i) => i)
    .filter((i) => !named.has(projects[i].id));

  const tile = (index: number, role?: "lead" | "fill") => (
    <Tile
      key={projects[index].id}
      project={projects[index]}
      aspect={role ? undefined : layout[projects[index].id]?.aspect}
      image={layout[projects[index].id]?.image}
      position={layout[projects[index].id]?.position}
      naturalOnPhones={layout[projects[index].id]?.naturalOnPhones}
      role={role}
      onOpen={() => onOpen(index)}
    />
  );

  return (
    <section className="art-gallery">
      <motion.div
        className="art-layout"
        variants={children_custom}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.3}
      >
        {rows.map((row, r) =>
          row.kind === "feature" ? (
            <FeatureRow
              key={r}
              row={row}
            >
              {row.naturalFirst
                ? [tile(indexOf(row.natural), "lead"), tile(indexOf(row.crop), "fill")]
                : [tile(indexOf(row.crop), "fill"), tile(indexOf(row.natural), "lead")]}
            </FeatureRow>
          ) : (
            <div
              key={r}
              className={row.columns ? "art-mosaic art-mosaic-custom" : "art-mosaic"}
              style={
                row.columns
                  ? ({ "--art-columns": row.columns } as React.CSSProperties)
                  : undefined
              }
            >
              {row.ids.map((id) => tile(indexOf(id)))}
            </div>
          ),
        )}
        {rest.length > 0 && (
          <div className="art-mosaic">{rest.map((i) => tile(i))}</div>
        )}
      </motion.div>
    </section>
  );
}

type FeatureRowProps = {
  row: Extract<GalleryRow, { kind: "feature" }>;
  children: ReactNode;
};

function FeatureRow({ row, children }: FeatureRowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const probe = useRef<HTMLSpanElement>(null);
  const [snapped, setSnapped] = useState(false);
  // The snap transition stays off until the first real measurement lands,
  // so the initial size is applied instantly instead of easing in.
  const [animate, setAnimate] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!row.height || !row.ratio || !el) return;
    const [w, h] = row.ratio.split("/").map(Number);
    const leadRatio = w / h;
    let armed = false;
    let raf = 0;
    const measure = () => {
      // Narrow viewports always snap; no need to wait for the image.
      if (window.matchMedia("(max-width: 1189px)").matches) return true;
      const img = el.querySelector<HTMLImageElement>(".art-tile-fill img");
      if (!img?.naturalWidth || !probe.current) return null;
      const fillRatio = img.naturalWidth / img.naturalHeight;
      const height = probe.current.offsetHeight;
      const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
      const room = el.clientWidth - gap - height * leadRatio;
      return room < height * fillRatio;
    };
    const check = () => {
      const next = measure();
      if (next === null) return;
      setSnapped(next);
      if (!armed) {
        armed = true;
        raf = requestAnimationFrame(() => {
          raf = requestAnimationFrame(() => setAnimate(true));
        });
      }
    };
    check();
    const img = el.querySelector<HTMLImageElement>(".art-tile-fill img");
    img?.addEventListener("load", check);
    const ro = new ResizeObserver(check);
    ro.observe(el);
    window.addEventListener("resize", check);
    return () => {
      img?.removeEventListener("load", check);
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", check);
    };
  }, [row.height, row.ratio]);

  return (
    <div
      ref={ref}
      className={[
        "art-feature",
        row.naturalFirst && "art-feature-lead-first",
        row.height && "art-feature-fixed",
        snapped && "art-feature-snapped",
        animate && "art-feature-animate",
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        row.height
          ? ({
              "--art-lead-height": row.height,
              "--art-lead-ratio": row.ratio,
            } as React.CSSProperties)
          : undefined
      }
    >
      {row.height && (
        <span
          ref={probe}
          className="art-feature-probe"
          aria-hidden
        />
      )}
      {children}
    </div>
  );
}

export interface TileProps {
  project: Project;
  title?: string;
  aspect?: string;
  image?: "thumbnail" | "expanded";
  position?: string;
  naturalOnPhones?: boolean;
  role?: "lead" | "fill";
  onOpen: () => void;
}

export function Tile({
  project,
  title,
  aspect,
  image = "thumbnail",
  position,
  naturalOnPhones,
  role,
  onOpen,
}: TileProps) {
  const cropped = Boolean(aspect) || role === "fill";
  const cls = [
    "art-tile",
    role && `art-tile-${role}`,
    naturalOnPhones && "art-tile-natural-sm",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={cls}>
      <button
        type="button"
        className="art-tile-button"
        onClick={onOpen}
        aria-label={`Open ${project.title}`}
      >
        <div
          className={cropped ? "art-tile-image art-tile-cropped" : "art-tile-image"}
          style={cropped ? { aspectRatio: aspect } : undefined}
        >
          <img
            src={
              image === "expanded"
                ? (project.expandedUrl ?? project.thumbnailUrl)
                : project.thumbnailUrl
            }
            alt={project.title}
            loading="lazy"
            decoding="async"
            style={
              cropped && (position ?? project.imagePos)
                ? { objectPosition: position ?? project.imagePos }
                : undefined
            }
          />
        </div>
        <p className="art-tile-title entry-title">{title ?? project.title}</p>
      </button>
    </article>
  );
}
