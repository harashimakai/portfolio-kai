import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { motion } from "motion/react";
import { children_custom, container_m } from "../../lib/animations";
import SectionDivider from "../../components/ui/SectionDivider";

const reveal = (delay: number) => ({
  variants: children_custom,
  custom: delay,
  initial: "hidden" as const,
  whileInView: "visible" as const,
  viewport: { once: true, amount: 0.2 },
});

const stagger = (amount = 0.2) => ({
  variants: container_m,
  initial: "hidden" as const,
  whileInView: "visible" as const,
  viewport: { once: true, amount },
});

const child = (i: number, step = 0.15) => ({
  variants: children_custom,
  custom: 0.1 + i * step,
});

function useHeroOffset() {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState<number | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const vh = window.innerHeight;
      if (window.innerWidth <= vh) {
        setOffset(null);
        return;
      }
      const nav = document.querySelector<HTMLElement>(".navbar")?.offsetHeight ?? 0;
      setOffset(nav + Math.max(16, (vh - nav - el.offsetHeight) / 2));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return { ref, offset };
}

interface HeroProps {
  logoSvg: string;
  logoAlt: string;
  subtitle: ReactNode;
  video: { src: string; poster: string } | null;
  meta: { label: string; lines: ReactNode[] }[];
}

export function StudyHero({ logoSvg, logoAlt, subtitle, video, meta }: HeroProps) {
  const hero = useHeroOffset();
  return (
    <motion.header
      className={video ? "study-hero has-video" : "study-hero"}
      style={video && hero.offset !== null ? { paddingTop: hero.offset } : undefined}
      variants={container_m}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {!video && (
        <div
          className="study-hero-bg"
          aria-hidden="true"
        />
      )}
      {video ? (
        <>
          <motion.figure
            ref={hero.ref}
            className="study-hero-video"
            variants={children_custom}
            custom={0.15}
          >
            <video
              src={video.src || undefined}
              poster={video.poster}
              aria-label={logoAlt}
              autoPlay
              muted
              loop
              playsInline
            />
          </motion.figure>
          <motion.h1
            className="study-hero-title"
            variants={children_custom}
            custom={0.3}
          >
            {subtitle}
          </motion.h1>
        </>
      ) : (
        <>
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
        </>
      )}
      <dl
        className="study-hero-meta"
      >
        {meta.map((col, i) => (
          <motion.div
            key={col.label}
            variants={children_custom}
            custom={0.45 + i * 0.15}
          >
            <dt>{col.label}</dt>
            {col.lines.map((line, j) => (
              <dd key={j}>{line}</dd>
            ))}
          </motion.div>
        ))}
      </dl>
    </motion.header>
  );
}

export type Role = "label" | "eyebrow" | "header" | "heading" | "content";
export type Gap = "none" | "item" | "eyebrow" | "header" | "block" | "group";

export function gapBetween(prev: Role | null, cur: Role): Gap {
  if (prev === null || prev === "heading") return "none";
  if (prev === "label" || prev === "eyebrow") return "eyebrow";
  if (prev === "header") return "header";
  return cur === "content" ? "block" : "group";
}

export function Slot({
  gap,
  tools,
  children,
}: {
  gap: Gap;
  tools: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={`study-slot study-gap-${gap}`}>
      {tools}
      {children}
    </div>
  );
}

export function StudySection({
  id,
  label,
  children,
  aside,
  below,
  narrow = false,
}: {
  id: string;
  label?: ReactNode;
  children: ReactNode;
  aside?: ReactNode;
  below?: ReactNode;
  narrow?: boolean;
}) {
  const heading = label && (
    <motion.h2
      className="study-section-label"
      {...reveal(0)}
    >
      {label}
    </motion.h2>
  );
  return (
    <>
      <SectionDivider />
      <section
        id={id}
        className="study-section"
      >
        {aside ? (
          <div className={narrow ? "study-section-split is-narrow" : "study-section-split"}>
            <div>
              {heading}
              {children}
            </div>
            <div className="study-section-aside">{aside}</div>
          </div>
        ) : (
          <>
            {heading}
            {children}
          </>
        )}
        {below}
      </section>
    </>
  );
}

export function Statement({ children, small }: { children: ReactNode; small?: boolean }) {
  return (
    <motion.h1
      className={small ? "study-statement is-small" : "study-statement"}
      {...reveal(0.1)}
    >
      {children}
    </motion.h1>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <motion.h2
      className="study-kicker"
      {...reveal(0)}
    >
      {children}
    </motion.h2>
  );
}

export function Subheading({ children, logo }: { children: ReactNode; logo?: string }) {
  return (
    <motion.h3
      className={logo ? "study-subheading has-logo" : "study-subheading"}
      {...reveal(0.1)}
    >
      {logo && (
        <span
          className="study-subheading-badge"
          aria-hidden="true"
        >
          <span
            className="study-subheading-logo"
            style={{ maskImage: `url("${logo}")`, WebkitMaskImage: `url("${logo}")` }}
          />
        </span>
      )}
      {children}
    </motion.h3>
  );
}

export function Body({ children }: { children: ReactNode }) {
  return (
    <motion.p
      className="study-body"
      {...reveal(0.15)}
    >
      {children}
    </motion.p>
  );
}

export function Bullets({ items, grid = false }: { items: ReactNode[]; grid?: boolean }) {
  return (
    <motion.ul
      className={grid ? "study-bullets is-grid" : "study-bullets"}
      {...stagger(0.3)}
    >
      {items.map((item, i) => (
        <motion.li
          key={i}
          {...child(i, 0.1)}
        >
          <span
            className="study-bullet"
            aria-hidden="true"
          />
          <p>{item}</p>
        </motion.li>
      ))}
    </motion.ul>
  );
}

function Points({ pros, cons }: { pros: ReactNode[]; cons: ReactNode[] }) {
  if (pros.length === 0 && cons.length === 0) return null;
  return (
    <ul className="study-points">
      {pros.map((p, j) => (
        <li
          key={`p${j}`}
          className="is-pro"
        >
          <span
            role="img"
            aria-label="Pro"
          >
            ✓
          </span>
          <p>{p}</p>
        </li>
      ))}
      {cons.map((c, j) => (
        <li
          key={`c${j}`}
          className="is-con"
        >
          <span
            role="img"
            aria-label="Con"
          >
            ✕
          </span>
          <p>{c}</p>
        </li>
      ))}
    </ul>
  );
}

const ARROW_TIP = 1.5 * Math.SQRT2;

function SequenceArrow() {
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
          strokeWidth="3"
        >
          <path d={`M-9999 0H${-ARROW_TIP}`} />
          <path d={`M${-12 - ARROW_TIP} -12L${-ARROW_TIP} 0l-12 12`} />
        </g>
      </svg>
    </svg>
  );
}

interface Pointed {
  pros: ReactNode[];
  cons: ReactNode[];
}

export function FigureRow({
  items,
  sequence,
}: {
  items: (Pointed & { src: string; alt: string; label: ReactNode })[];
  sequence: boolean;
}) {
  return (
    <motion.div
      className="study-row"
      {...stagger()}
    >
      {items.map((item, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <motion.div
              className="study-row-spacer"
              aria-hidden="true"
              {...child(i)}
            >
              {sequence && <SequenceArrow />}
            </motion.div>
          )}
          <motion.figure
            className="study-figure is-framed"
            {...child(i)}
          >
            <img
              src={item.src}
              alt={item.alt}
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <h3>{item.label}</h3>
            </figcaption>
            <Points
              pros={item.pros}
              cons={item.cons}
            />
          </motion.figure>
        </Fragment>
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
  const [portrait, setPortrait] = useState(false);
  return (
    <motion.figure
      className={portrait ? "study-figure study-video is-portrait" : "study-figure study-video"}
      {...reveal(0.1)}
    >
      <video
        src={src}
        poster={poster}
        onLoadedMetadata={(e) =>
          setPortrait(e.currentTarget.videoHeight > e.currentTarget.videoWidth)
        }
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

export function Cards({
  items,
  stacked = false,
}: {
  items: { title: ReactNode; lines: ReactNode[]; logo?: string; image?: string }[];
  stacked?: boolean;
}) {
  return (
    <motion.div
      className={stacked ? "study-cards is-stacked" : "study-cards"}
      {...stagger()}
    >
      {items.map((card, i) => (
        <motion.div
          key={i}
          className="study-card"
          {...child(i)}
        >
          {card.image && (
            <img
              className="study-card-image"
              src={card.image}
              alt=""
              loading="lazy"
              decoding="async"
            />
          )}
          {card.logo && (
            <span
              className="study-card-logo"
              style={{ maskImage: `url("${card.logo}")`, WebkitMaskImage: `url("${card.logo}")` }}
              aria-hidden="true"
            />
          )}
          <p className="study-card-title">{card.title}</p>
          {card.lines.length === 1 ? (
            <p className="study-card-text">{card.lines[0]}</p>
          ) : (
            <Bullets items={card.lines} />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

interface EntryView {
  title: ReactNode;
  body: ReactNode;
}

export function Takeaways({ items, grid = false }: { items: EntryView[]; grid?: boolean }) {
  return (
    <motion.ol
      className={grid ? "study-takeaways is-grid" : "study-takeaways"}
      {...stagger()}
    >
      {items.map((t, i) => (
        <motion.li
          key={i}
          {...child(i)}
        >
          {!grid && <h3>{String(i + 1).padStart(2, "0")}</h3>}
          <div>
            <p className="study-takeaway-title">{t.title}</p>
            <p className="study-takeaway-body">{t.body}</p>
          </div>
        </motion.li>
      ))}
    </motion.ol>
  );
}

export function Stats({ items }: { items: { value: ReactNode; label: ReactNode }[] }) {
  return (
    <motion.dl
      className="study-stats"
      {...stagger(0.3)}
    >
      {items.map((stat, i) => (
        <motion.div
          key={i}
          className="study-stat"
          {...child(i, 0.12)}
        >
          <dt className="study-stat-value">{stat.value}</dt>
          <dd className="study-stat-label">{stat.label}</dd>
        </motion.div>
      ))}
    </motion.dl>
  );
}

export function Columns({
  items,
}: {
  items: { title: ReactNode; body?: ReactNode; lines?: ReactNode[] }[];
}) {
  return (
    <motion.div
      className="study-columns"
      {...stagger(0.3)}
    >
      {items.map((item, i) => (
        <motion.div
          key={i}
          {...child(i)}
        >
          <p className="study-column-title">{item.title}</p>
          {item.body && <p className="study-body">{item.body}</p>}
          {item.lines && <Bullets items={item.lines} />}
        </motion.div>
      ))}
    </motion.div>
  );
}

export function Steps({ items }: { items: EntryView[] }) {
  return (
    <motion.ol
      className="study-steps"
      {...stagger(0.3)}
    >
      {items.map((step, i) => (
        <motion.li
          key={i}
          {...child(i, 0.12)}
        >
          <p className="study-step-title">
            {i + 1}: {step.title}
          </p>
          <p className="study-step-body">{step.body}</p>
        </motion.li>
      ))}
    </motion.ol>
  );
}

export function Callout({
  label,
  text,
  plain = false,
}: {
  label: ReactNode;
  text: ReactNode;
  plain?: boolean;
}) {
  return (
    <motion.aside
      className={plain ? "study-callout is-plain" : "study-callout"}
      {...reveal(0.1)}
    >
      <h2 className="study-callout-label">{label}</h2>
      <p className="study-callout-text">{text}</p>
    </motion.aside>
  );
}

export function Quotes({ items }: { items: ReactNode[] }) {
  return (
    <motion.div
      className="study-quotes"
      {...stagger()}
    >
      {items.map((quote, i) => (
        <motion.blockquote
          key={i}
          className="study-quote"
          {...child(i)}
        >
          {quote}
        </motion.blockquote>
      ))}
    </motion.div>
  );
}

export function Decision({
  title,
  problem,
  solution,
  src,
  tools,
}: {
  title: ReactNode;
  problem: ReactNode;
  solution: ReactNode;
  src: string;
  tools: ReactNode;
}) {
  return (
    <motion.div
      className="study-decision"
      {...stagger()}
    >
      <motion.div {...child(0)}>
        <p className="study-decision-title">{title}</p>
        <div className="study-decision-part">
          <h2>PROBLEM</h2>
          <p className="study-body">{problem}</p>
        </div>
        <div className="study-decision-part">
          <h2>SOLUTION</h2>
          <p className="study-body">{solution}</p>
        </div>
      </motion.div>
      <motion.figure
        className="study-figure is-framed"
        {...child(1)}
      >
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
        />
        {tools}
      </motion.figure>
    </motion.div>
  );
}

export function Options({
  items,
}: {
  items: (Pointed & { src: string; title: ReactNode; chosen: boolean })[];
}) {
  const [ratios, setRatios] = useState<Record<number, number>>({});
  const loaded = Object.values(ratios);
  const frame = loaded.length ? Math.min(...loaded) : 16 / 10;
  return (
    <motion.div
      className="study-options"
      style={{ "--frame-ratio": frame } as CSSProperties}
      {...stagger()}
    >
      {items.map((option, i) => (
        <motion.div
          key={i}
          className="study-option"
          {...child(i)}
        >
          <figure className="study-figure is-framed">
            <img
              src={option.src}
              alt=""
              loading="lazy"
              decoding="async"
              onLoad={(e) => {
                const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
                setRatios((r) => ({ ...r, [i]: w / h }));
              }}
            />
          </figure>
          <div className="study-option-head">
            <p className="study-option-title">{option.title}</p>
            {option.chosen && (
              <span className="study-option-badge-line">
                <h3 className="study-option-badge">FINAL</h3>
              </span>
            )}
          </div>
          <Points
            pros={option.pros}
            cons={option.cons}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

export function WideImage({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: ReactNode;
}) {
  return (
    <motion.figure
      className="study-figure study-image"
      {...reveal(0.1)}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
      />
      <figcaption>
        <h3>{caption}</h3>
      </figcaption>
    </motion.figure>
  );
}

export function ImageRow({
  items,
}: {
  items: { src: string; alt: string; caption: ReactNode }[];
}) {
  const [ratios, setRatios] = useState<Record<number, number>>({});
  return (
    <motion.div
      className="study-image-row"
      {...stagger()}
    >
      {items.map((item, i) => (
        <motion.figure
          key={i}
          className="study-figure study-image"
          style={{ "--ratio": ratios[i] ?? 1 } as CSSProperties}
          {...child(i)}
        >
          <img
            src={item.src}
            alt={item.alt}
            loading="lazy"
            decoding="async"
            onLoad={(e) => {
              const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
              setRatios((r) => ({ ...r, [i]: w / h }));
            }}
          />
          <figcaption>
            <h3>{item.caption}</h3>
          </figcaption>
        </motion.figure>
      ))}
    </motion.div>
  );
}

function useTypewriter(lines: string[]) {
  const [text, setText] = useState(lines[0] ?? "");
  const key = lines.join("\n");

  useEffect(() => {
    const all = key.split("\n").filter(Boolean);
    if (all.length < 2) return;
    let line = 0;
    let length = all[0].length;
    let deleting = false;
    let timer: number;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = () => {
      if (reduced) {
        line = (line + 1) % all.length;
        setText(all[line]);
        timer = window.setTimeout(tick, 3200);
        return;
      }
      const full = all[line];
      if (!deleting && length < full.length) {
        length += 1;
        setText(full.slice(0, length));
        timer = window.setTimeout(tick, 45);
      } else if (!deleting) {
        deleting = true;
        timer = window.setTimeout(tick, 2400);
      } else if (length > 0) {
        length -= 1;
        setText(full.slice(0, length));
        timer = window.setTimeout(tick, 22);
      } else {
        deleting = false;
        line = (line + 1) % all.length;
        timer = window.setTimeout(tick, 350);
      }
    };
    timer = window.setTimeout(tick, 2400);
    return () => window.clearTimeout(timer);
  }, [key]);

  return text;
}

export function Prompts({ label, prompts }: { label: ReactNode; prompts: string[] }) {
  const text = useTypewriter(prompts);
  const longest = prompts.reduce((a, b) => (b.length > a.length ? b : a), "");
  return (
    <motion.aside
      className="study-callout"
      {...reveal(0.1)}
    >
      <h2 className="study-callout-label">{label}</h2>
      <p
        className="study-callout-text study-prompts-text"
        aria-label={prompts.join(" / ")}
      >
        <span
          className="study-prompts-sizer"
          aria-hidden="true"
        >
          {longest}
        </span>
        <span aria-hidden="true">
          {text}
          <span className="study-prompts-caret" />
        </span>
      </p>
    </motion.aside>
  );
}

export function AnnotatedImage({
  src,
  alt,
  cards,
}: {
  src: string;
  alt: string;
  cards: { title: ReactNode; lines: ReactNode[] }[];
}) {
  const stackRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();

  useLayoutEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;
    const observer = new ResizeObserver(() => setHeight(stack.offsetHeight));
    observer.observe(stack);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="study-annotated"
      style={height ? ({ "--stack-height": `${height}px` } as CSSProperties) : undefined}
    >
      <motion.figure
        className="study-figure study-image"
        {...reveal(0.1)}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
        />
      </motion.figure>
      <div ref={stackRef}>
        <Cards
          items={cards}
          stacked
        />
      </div>
    </div>
  );
}
