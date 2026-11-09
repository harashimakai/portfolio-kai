import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";

import InViewVideo from "../../components/ui/InViewVideo";
import { Cards } from "./ListBlocks";
import { reveal, revealGroup, revealItem } from "../../lib/animations";
import VideoLightbox from "./VideoLightbox";

// Constants

const ARROW_STROKE = 4.5;
const ARROW_TIP = (ARROW_STROKE / 2) * Math.SQRT2;
const ARROW_HEAD = 12;
const DEFAULT_FRAME_RATIO = 16 / 10;

// Points

interface Pointed {
  pros: ReactNode[];
  cons: ReactNode[];
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

// Sequence arrow

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
          strokeWidth={ARROW_STROKE}
        >
          <path d={`M-9999 0H${-ARROW_TIP}`} />
          <path d={`M${-ARROW_HEAD - ARROW_TIP} ${-ARROW_HEAD}L${-ARROW_TIP} 0l${-ARROW_HEAD} ${ARROW_HEAD}`} />
        </g>
      </svg>
    </svg>
  );
}

// Figure row

export function FigureRow({
  items,
  sequence,
}: {
  items: (Pointed & {
    src: string;
    poster?: string;
    alt: string;
    label: ReactNode;
  })[];
  sequence: boolean;
}) {
  return (
    <motion.div
      className="study-row"
      {...revealGroup()}
    >
      {items.map((item, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <motion.div
              className="study-row-spacer"
              aria-hidden="true"
              {...revealItem(i)}
            >
              {sequence && <SequenceArrow />}
            </motion.div>
          )}
          <motion.figure
            className="study-figure is-framed"
            {...revealItem(i)}
          >
            {item.poster ? (
              <InViewVideo
                src={item.src}
                poster={item.poster}
                aria-label={item.alt}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                decoding="async"
              />
            )}
            <figcaption>
              <p className="text-label-sm">{item.label}</p>
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

// Video

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
      className={
        portrait
          ? "study-figure study-video is-portrait"
          : "study-figure study-video"
      }
      {...reveal(0.1)}
    >
      <InViewVideo
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
        <p className="text-label-sm">{caption}</p>
      </figcaption>
    </motion.figure>
  );
}

// Decision

export function Decision({
  problem,
  solution,
  src,
}: {
  problem: ReactNode;
  solution: ReactNode;
  src: string;
}) {
  return (
    <motion.div
      className="study-decision"
      {...revealGroup()}
    >
      <motion.div {...revealItem(0)}>
        <div className="study-decision-part">
          <p className="study-decision-label">Problem</p>
          <p className="study-body">{problem}</p>
        </div>
        <div className="study-decision-part">
          <p className="study-decision-label">Solution</p>
          <p className="study-body">{solution}</p>
        </div>
      </motion.div>
      <motion.figure
        className="study-figure is-framed"
        {...revealItem(1)}
      >
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
        />
      </motion.figure>
    </motion.div>
  );
}

// Options

export function Options({
  items,
}: {
  items: (Pointed & {
    src: string;
    poster?: string;
    title: ReactNode;
    chosen: boolean;
  })[];
}) {
  const [ratios, setRatios] = useState<Record<number, number>>({});
  const measure = (i: number, w: number, h: number) =>
    setRatios((r) => ({ ...r, [i]: w / h }));
  const loaded = Object.values(ratios);
  const frame = loaded.length ? Math.min(...loaded) : DEFAULT_FRAME_RATIO;
  return (
    <motion.div
      className="study-options"
      style={{ "--frame-ratio": frame } as CSSProperties}
      {...revealGroup()}
    >
      {items.map((option, i) => (
        <motion.div
          key={i}
          className="study-option"
          {...revealItem(i)}
        >
          <figure className="study-figure is-framed">
            {option.poster ? (
              <InViewVideo
                src={option.src}
                poster={option.poster}
                autoPlay
                muted
                loop
                playsInline
                onLoadedMetadata={(e) =>
                  measure(i, e.currentTarget.videoWidth, e.currentTarget.videoHeight)
                }
              />
            ) : (
              <img
                src={option.src}
                alt=""
                loading="lazy"
                decoding="async"
                onLoad={(e) =>
                  measure(i, e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)
                }
              />
            )}
          </figure>
          <div className="study-option-head">
            <p className="study-option-title">{option.title}</p>
            {option.chosen && (
              <span className="study-option-badge-line">
                <span className="study-option-badge text-label-sm">Final</span>
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

// Expandable video

function ExpandableVideo({
  src,
  poster,
  alt,
}: {
  src: string;
  poster: string;
  alt: string;
}) {
  const [open, setOpen] = useState(false);
  const [startAt, setStartAt] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [host, setHost] = useState<Element | null>(null);
  const close = useCallback(() => setOpen(false), []);
  useEffect(() => {
    setHost(buttonRef.current?.closest(".theme-light, .theme-dark") ?? document.body);
  }, []);
  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="study-video-open"
        data-cursor="View full screen"
        aria-label={`Expand video: ${alt}`}
        onClick={() => {
          setStartAt(buttonRef.current?.querySelector("video")?.currentTime ?? 0);
          setOpen(true);
        }}
      >
        <InViewVideo
          src={src}
          poster={poster}
          aria-label={alt}
          autoPlay
          muted
          loop
          playsInline
        />
      </button>
      {host &&
        createPortal(
          <VideoLightbox
            src={src}
            poster={poster}
            open={open}
            startAt={startAt}
            onClose={close}
          />,
          host,
        )}
    </>
  );
}

// Wide image

export function WideImage({
  src,
  poster,
  alt,
  caption,
}: {
  src: string;
  poster?: string;
  alt: string;
  caption: ReactNode;
}) {
  return (
    <motion.figure
      className="study-figure study-image is-wide"
      {...reveal(0.1)}
    >
      {poster ? (
        <ExpandableVideo
          src={src}
          poster={poster}
          alt={alt}
        />
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
        />
      )}
      <figcaption>
        <p className="text-label-sm">{caption}</p>
      </figcaption>
    </motion.figure>
  );
}

// Image row

export function ImageRow({
  items,
}: {
  items: { src: string; alt: string; caption: ReactNode }[];
}) {
  const [ratios, setRatios] = useState<Record<number, number>>({});
  return (
    <motion.div
      className="study-image-row"
      {...revealGroup()}
    >
      {items.map((item, i) => (
        <motion.figure
          key={i}
          className="study-figure study-image"
          style={{ "--ratio": ratios[i] ?? 1 } as CSSProperties}
          {...revealItem(i)}
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
            <p className="text-label-sm">{item.caption}</p>
          </figcaption>
        </motion.figure>
      ))}
    </motion.div>
  );
}

// Annotated image

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
      style={
        height
          ? ({ "--stack-height": `${height}px` } as CSSProperties)
          : undefined
      }
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
