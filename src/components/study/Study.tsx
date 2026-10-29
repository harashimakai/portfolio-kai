import type { ReactNode } from "react";
import { motion } from "motion/react";
import { children_custom, container_m } from "../global/AnimationConsts";
import SectionDiv from "../global/SectionDiv";
import "../../css/study.css";

/* Layout primitives for long-form case studies. The format follows the
   editorial pattern of breadcrumb, title and stacked metadata, a sticky
   section nav, then sections that each open with a statement heading and
   run short paragraphs, figures and cards; it closes on reflections.      */

const reveal = {
  variants: children_custom,
  initial: "hidden" as const,
  whileInView: "visible" as const,
  viewport: { once: true, amount: 0.2 },
};

/* ─── Hero ───────────────────────────────────────────────────────────────── */

export interface MetaColumn {
  label: string;
  /* One line, or several lines stacked. */
  value: ReactNode | ReactNode[];
}

interface HeroProps {
  /* Wordmarks for the light and dark palettes. */
  logo: string;
  logoDark: string;
  logoAlt: string;
  subtitle: ReactNode;
  meta: MetaColumn[];
}

export function StudyHero({
  logo,
  logoDark,
  logoAlt,
  subtitle,
  meta,
}: HeroProps) {
  return (
    <motion.header
      className="study-hero"
      variants={container_m}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* The gradient is CSS, drawn from theme colour tokens, so a theme
          change interpolates its colours in step with the page. */}
      <div
        className="study-hero-bg"
        aria-hidden="true"
      />
      <motion.picture
        className="study-hero-logo"
        variants={children_custom}
        custom={0.15}
      >
        <img
          className="study-hero-logo-light"
          src={logo}
          alt={logoAlt}
          decoding="async"
          fetchPriority="high"
        />
        <img
          className="study-hero-logo-dark"
          src={logoDark}
          alt={logoAlt}
          decoding="async"
        />
      </motion.picture>
      <motion.p
        className="study-hero-subtitle"
        variants={children_custom}
        custom={0.3}
      >
        {subtitle}
      </motion.p>
      <dl className="study-hero-meta">
        {meta.map((col, i) => (
          <motion.div
            key={col.label}
            variants={children_custom}
            custom={0.45 + i * 0.15}
          >
            <dt>{col.label}</dt>
            {(Array.isArray(col.value) ? col.value : [col.value]).map(
              (line, j) => (
                <dd key={j}>{line}</dd>
              ),
            )}
          </motion.div>
        ))}
      </dl>
    </motion.header>
  );
}

/* ─── Rhythm ─────────────────────────────────────────────────────────────── */
/* Every block has a role. The gap above a block depends only on its role
   and the role of the block before it, so spacing is decided here, once,
   and never per block or per page.                                        */

export type Role = "label" | "eyebrow" | "header" | "content";
export type Gap = "none" | "eyebrow" | "header" | "block" | "group";

export function gapBetween(prev: Role | null, cur: Role): Gap {
  if (prev === null) return "none";
  if (prev === "label" || prev === "eyebrow") return "eyebrow";
  if (prev === "header") return "header";
  /* After content: a new header or eyebrow starts a group. */
  return cur === "content" ? "block" : "group";
}

/* Wraps one block and carries its gap. Editors may add chrome to it. */
export function Slot({
  gap,
  children,
  chrome,
}: {
  gap: Gap;
  children: ReactNode;
  chrome?: ReactNode;
}) {
  return (
    <div className={`study-slot study-gap-${gap}`}>
      {chrome}
      {children}
    </div>
  );
}

/* ─── Section ────────────────────────────────────────────────────────────── */

interface SectionProps {
  id: string;
  /* Optional eyebrow beneath the rule, above the opening statement. */
  label?: ReactNode;
  children: ReactNode;
}

/* Every section, the first included, opens with the site's rule. */
export function StudySection({ id, label, children }: SectionProps) {
  return (
    <>
      <SectionDiv />
      <section
        id={id}
        className="study-section"
      >
        {label && (
          <motion.h2
            className="study-section-label"
            {...reveal}
            custom={0}
          >
            {label}
          </motion.h2>
        )}
        {children}
      </section>
    </>
  );
}

/* Big serif claim that opens a section or a subsection. */
export function Statement({
  children,
  small = false,
}: {
  children: ReactNode;
  small?: boolean;
}) {
  return (
    <motion.h1
      className={small ? "study-statement study-statement-small" : "study-statement"}
      {...reveal}
      custom={0.1}
    >
      {children}
    </motion.h1>
  );
}

/* Caps eyebrow above a run of content inside a section, e.g. KEY CHANGES
   or MY ROLE. */
export function Kicker({ children }: { children: ReactNode }) {
  return (
    <motion.h2
      className="study-kicker"
      {...reveal}
      custom={0}
    >
      {children}
    </motion.h2>
  );
}

export function Body({ children }: { children: ReactNode }) {
  return (
    <motion.p
      className="study-body"
      {...reveal}
      custom={0.15}
    >
      {children}
    </motion.p>
  );
}

/* Short dash list, used for key changes and card bullets. */
export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <motion.ul
      className="study-bullets"
      variants={container_m}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {items.map((item, i) => (
        <motion.li
          key={i}
          variants={children_custom}
          custom={0.1 + i * 0.1}
        >
          <span
            className="study-bullet-dash"
            aria-hidden="true"
          />
          <p>{item}</p>
        </motion.li>
      ))}
    </motion.ul>
  );
}

/* ─── Figures ────────────────────────────────────────────────────────────── */

interface FigureProps {
  src: string;
  alt: string;
  caption?: ReactNode;
  /* `wide` spans the full gutter width; otherwise the text column. */
  wide?: boolean;
  /* Phone screens sit on the surface colour with a little padding. */
  frame?: boolean;
}

export function Figure({ src, alt, caption, wide, frame }: FigureProps) {
  return (
    <motion.figure
      className={[
        "study-figure",
        wide && "study-figure-wide",
        frame && "study-figure-frame",
      ]
        .filter(Boolean)
        .join(" ")}
      {...reveal}
      custom={0.1}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
      />
      {caption && (
        <figcaption>
          <h3>{caption}</h3>
        </figcaption>
      )}
    </motion.figure>
  );
}

/* A row of figures that share a height: phone screens three across, or
   sketches two across. Each carries a left and optional right caption.   */
export interface RowItem {
  src: string;
  alt: string;
  label: ReactNode;
  note?: ReactNode;
}

export function FigureRow({
  items,
  columns = 3,
  frame = false,
}: {
  items: RowItem[];
  columns?: 2 | 3;
  frame?: boolean;
}) {
  return (
    <motion.div
      className={`study-row study-row-${columns}`}
      variants={container_m}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {items.map((item, i) => (
        <motion.figure
          key={i}
          className={frame ? "study-figure study-figure-frame" : "study-figure"}
          variants={children_custom}
          custom={0.1 + i * 0.15}
        >
          <img
            src={item.src}
            alt={item.alt}
            loading="lazy"
            decoding="async"
          />
          <figcaption className="study-row-caption">
            <h3>{item.label}</h3>
            {item.note && <h3 className="study-row-note">{item.note}</h3>}
          </figcaption>
        </motion.figure>
      ))}
    </motion.div>
  );
}

export function Video({
  src,
  poster,
  caption,
}: {
  src: string;
  poster: string;
  caption?: ReactNode;
}) {
  return (
    <motion.figure
      className="study-figure study-figure-wide study-video"
      {...reveal}
      custom={0.1}
    >
      <video
        src={src}
        poster={poster}
        controls
        playsInline
        muted
        preload="metadata"
      />
      {caption && (
        <figcaption>
          <h3>{caption}</h3>
        </figcaption>
      )}
    </motion.figure>
  );
}

/* ─── Cards ──────────────────────────────────────────────────────────────── */

export interface CardItem {
  title: ReactNode;
  lines: ReactNode[];
}

/* Three quiet surface panels, for personas, principles or options. */
export function Cards({ items }: { items: CardItem[] }) {
  return (
    <motion.div
      className="study-cards"
      variants={container_m}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {items.map((card, i) => (
        <motion.div
          key={i}
          className="study-card"
          variants={children_custom}
          custom={0.1 + i * 0.15}
        >
          <p className="study-card-title">{card.title}</p>
          <Bullets items={card.lines} />
        </motion.div>
      ))}
    </motion.div>
  );
}

/* Numbered takeaways: a bold line, then a short paragraph. */
export interface Takeaway {
  title: ReactNode;
  body: ReactNode;
}

export function Takeaways({ items }: { items: Takeaway[] }) {
  return (
    <motion.ol
      className="study-takeaways"
      variants={container_m}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {items.map((t, i) => (
        <motion.li
          key={i}
          variants={children_custom}
          custom={0.1 + i * 0.15}
        >
          <h3>0{i + 1}</h3>
          <div>
            <p className="study-takeaway-title entry-title">{t.title}</p>
            <p className="study-takeaway-body">{t.body}</p>
          </div>
        </motion.li>
      ))}
    </motion.ol>
  );
}
