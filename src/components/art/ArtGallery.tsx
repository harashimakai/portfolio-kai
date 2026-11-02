import { useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { children_custom } from "../global/AnimationConsts";
import { Project } from "../global/ProjectData";
import "../../css/art.css";

/* Per-piece crop, keyed by project id. Pieces without an entry show at
   their natural proportions.                                               */
export interface TileLayout {
  aspect?: string; /* CSS aspect-ratio; the image is cropped to it */
  maxHeight?: string; /* CSS length; past it the image crops top and bottom */
  image?: "thumbnail" | "expanded"; /* which of the piece's images to show */
  position?: string; /* object-position for a cropped image */
  naturalOnPhones?: boolean; /* drop the crop once the gallery is one column */
}

/* A row is either a mosaic of even tiles (or, with `columns`, tiles in
   custom grid columns), or a feature pair: `natural` shows uncropped and
   sets the row height; `crop` fills the other column at that height.
   By default the pair is 60 / 40 with `crop` first. With `height` (and
   the natural piece's `ratio`), the row is that tall instead: the
   natural piece takes exactly the width that gives at that height and
   `crop` fills the rest.                                                   */
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
  layout?: Record<string, TileLayout>;
  /* Row order, top to bottom. Pieces not named in any row are appended
     as a final mosaic row.                                                 */
  rows?: GalleryRow[];
}

export default function ArtGallery({
  projects,
  onOpen,
  layout = {},
  rows = [],
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
      maxHeight={role ? undefined : layout[projects[index].id]?.maxHeight}
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

/* A fixed-height pair holds its height only while the fill piece is at
   least as wide as its own proportions. Narrower than that, the crop
   would only eat into its sides, so the row falls back to the plain
   proportional pair instead; below 1190px it always does. That point depends on the viewport's
   height as well as its width, so it is measured rather than set as a
   breakpoint.                                                            */
function FeatureRow({ row, children }: FeatureRowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const probe = useRef<HTMLSpanElement>(null);
  const [snapped, setSnapped] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!row.height || !row.ratio || !el) return;
    const [w, h] = row.ratio.split("/").map(Number);
    const leadRatio = w / h;
    const check = () => {
      const img = el.querySelector<HTMLImageElement>(".art-tile-fill img");
      if (!img?.naturalWidth || !probe.current) return;
      const fillRatio = img.naturalWidth / img.naturalHeight;
      const height = probe.current.offsetHeight;
      const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
      const room = el.clientWidth - gap - height * leadRatio;
      setSnapped(
        room < height * fillRatio ||
          window.matchMedia("(max-width: 1189px)").matches,
      );
    };
    check();
    const img = el.querySelector<HTMLImageElement>(".art-tile-fill img");
    img?.addEventListener("load", check);
    const ro = new ResizeObserver(check);
    ro.observe(el);
    window.addEventListener("resize", check);
    return () => {
      img?.removeEventListener("load", check);
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
  /* Overrides the hover title; the alt text stays the full title. */
  title?: string;
  aspect?: string;
  maxHeight?: string;
  image?: "thumbnail" | "expanded";
  position?: string;
  naturalOnPhones?: boolean;
  role?: "lead" | "fill";
  onOpen: () => void;
}

/* One piece: image, hover zoom with gradient title, opens the lightbox. */
export function Tile({
  project,
  title,
  aspect,
  maxHeight,
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
          style={cropped ? { aspectRatio: aspect, maxHeight } : undefined}
        >
          <img
            src={
              image === "expanded"
                ? (project.expandedUrl ?? project.thumbnailUrl)
                : project.thumbnailUrl
            }
            alt={project.title}
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
