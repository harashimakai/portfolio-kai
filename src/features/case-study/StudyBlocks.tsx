import type { ReactNode } from "react";
import { motion } from "motion/react";
import { children_custom, container_m } from "../../lib/animations";
import SectionDivider from "../../components/ui/SectionDivider";

const reveal = {
  variants: children_custom,
  initial: "hidden" as const,
  whileInView: "visible" as const,
  viewport: { once: true, amount: 0.2 },
};

export interface MetaColumn {
  label: string;
  value: ReactNode | ReactNode[];
}

interface HeroProps {
  logoSvg: string;
  logoAlt: string;
  subtitle: ReactNode;
  meta: MetaColumn[];
}

export function StudyHero({
  logoSvg,
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
      <div
        className="study-hero-bg"
        aria-hidden="true"
      />
      <motion.div
        className="study-hero-logo"
        role="img"
        aria-label={logoAlt}
        variants={children_custom}
        custom={0.15}
        dangerouslySetInnerHTML={{ __html: logoSvg }}
      />
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

export type Role = "label" | "eyebrow" | "header" | "content";
export type Gap = "none" | "eyebrow" | "header" | "block" | "group";

export function gapBetween(prev: Role | null, cur: Role): Gap {
  if (prev === null) return "none";
  if (prev === "label" || prev === "eyebrow") return "eyebrow";
  if (prev === "header") return "header";
  return cur === "content" ? "block" : "group";
}

export function Slot({
  gap,
  children,
  chrome,
}: {
  gap: Gap;
  children: ReactNode;
  chrome: ReactNode;
}) {
  return (
    <div className={`study-slot study-gap-${gap}`}>
      {chrome}
      {children}
    </div>
  );
}

interface SectionProps {
  id: string;
  label?: ReactNode;
  children: ReactNode;
}

export function StudySection({ id, label, children }: SectionProps) {
  return (
    <>
      <SectionDivider />
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

export interface RowItem {
  src: string;
  alt: string;
  label: ReactNode;
  note: ReactNode;
}

function SequenceArrow() {
  const TIP = 2 * Math.SQRT2;
  return (
    <svg
      className="study-sequence-arrow"
      aria-hidden="true"
      focusable="false"
    >
      <svg
        x="100%"
        y="50%"
        overflow="visible"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="butt"
          strokeLinejoin="miter"
        >
          <path d={`M-9999 0H${-TIP}`} />
          <path d={`M${-12 - TIP} -12L${-TIP} 0l-12 12`} />
        </g>
      </svg>
    </svg>
  );
}

export function FigureRow({
  items,
  columns,
  sequence,
}: {
  items: RowItem[];
  columns: 2 | 3;
  sequence: boolean;
}) {
  return (
    <motion.div
      className={[
        "study-row",
        `study-row-${columns}`,
        sequence && "study-row-sequence",
      ]
        .filter(Boolean)
        .join(" ")}
      variants={container_m}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {items.map((item, i) => (
        <motion.figure
          key={i}
          className="study-figure study-figure-frame"
          variants={children_custom}
          custom={0.1 + i * 0.15}
        >
          <div className="study-figure-media">
            <img
              src={item.src}
              alt={item.alt}
              loading="lazy"
              decoding="async"
            />
            {sequence && i < items.length - 1 && <SequenceArrow />}
          </div>
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
  caption: ReactNode;
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
      <figcaption>
        <h3>{caption}</h3>
      </figcaption>
    </motion.figure>
  );
}

export interface CardItem {
  title: ReactNode;
  lines: ReactNode[];
}

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
