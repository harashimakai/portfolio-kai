import { motion } from "motion/react";
import { children_custom } from "../global/AnimationConsts";
import { Project } from "../global/ProjectData";
import "../../css/art.css";

/* Per-piece crop, keyed by project id. Pieces without an entry show at
   their natural proportions.                                               */
export interface TileLayout {
  aspect?: string; /* CSS aspect-ratio; the image is cropped to it */
}

interface Props {
  projects: Project[];
  onOpen: (index: number) => void;
  layout?: Record<string, TileLayout>;
  /* Two pieces for the first row, 60 / 40. `natural` shows uncropped in
     the narrow column and sets the row height; `crop` fills the wide
     column at that height.                                                 */
  feature?: { crop: string; natural: string };
}

export default function ArtGallery({
  projects,
  onOpen,
  layout = {},
  feature,
}: Props) {
  const pair = (feature ? [feature.crop, feature.natural] : [])
    .map((id) => projects.findIndex((p) => p.id === id))
    .filter((i) => i >= 0);
  const rest = projects
    .map((_, i) => i)
    .filter((i) => !pair.includes(i));

  const tile = (index: number, role?: "lead" | "fill") => (
    <Tile
      key={projects[index].id}
      project={projects[index]}
      aspect={role ? undefined : layout[projects[index].id]?.aspect}
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
        {pair.length === 2 && (
          <div className="art-feature">
            {tile(pair[0], "fill")}
            {tile(pair[1], "lead")}
          </div>
        )}
        <div className="art-mosaic">{rest.map((i) => tile(i))}</div>
      </motion.div>
    </section>
  );
}

interface TileProps {
  project: Project;
  aspect?: string;
  role?: "lead" | "fill";
  onOpen: () => void;
}

function Tile({ project, aspect, role, onOpen }: TileProps) {
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
          style={cropped ? { aspectRatio: aspect } : undefined}
        >
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            decoding="async"
            style={
              cropped && project.imagePos
                ? { objectPosition: project.imagePos }
                : undefined
            }
          />
        </div>
        <p className="art-tile-title entry-title">{project.title}</p>
      </button>
    </article>
  );
}
