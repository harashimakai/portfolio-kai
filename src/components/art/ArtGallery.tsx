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
            <div
              key={r}
              className={
                [
                  "art-feature",
                  row.naturalFirst && "art-feature-lead-first",
                  row.height && "art-feature-fixed",
                ]
                  .filter(Boolean)
                  .join(" ")
              }
              style={
                row.height
                  ? ({
                      "--art-lead-height": row.height,
                      "--art-lead-ratio": row.ratio,
                    } as React.CSSProperties)
                  : undefined
              }
            >
              {row.naturalFirst
                ? [tile(indexOf(row.natural), "lead"), tile(indexOf(row.crop), "fill")]
                : [tile(indexOf(row.crop), "fill"), tile(indexOf(row.natural), "lead")]}
            </div>
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

export interface TileProps {
  project: Project;
  /* Overrides the hover title; the alt text stays the full title. */
  title?: string;
  aspect?: string;
  maxHeight?: string;
  image?: "thumbnail" | "expanded";
  position?: string;
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
  role,
  onOpen,
}: TileProps) {
  const cropped = Boolean(aspect) || role === "fill";

  return (
    <article className={role ? `art-tile art-tile-${role}` : "art-tile"}>
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
