import { useState, useEffect, useCallback, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import SectionDivider from "../../components/ui/SectionDivider";
import { BLUR_IN, BLUR_NONE } from "../../lib/animations";

const INTERVAL = 10000;

type Quote = { node: ReactNode; author: string };

const QUOTES: Quote[] = [
  {
    node: (
      <>
        “Once there were brook trout in the streams in the mountains. They
        smelled of moss in your hand. Polished and muscular and torsional. On
        their backs were vermiculate patterns that were maps of the world in its
        becoming. Maps and mazes. Of a thing which could not be put back. Not be
        made right again. In the deep glens where they lived all things were
        older than man and they hummed of mystery.”
      </>
    ),
    author: "Cormac McCarthy, The Road",
  },
  {
    node: (
      <>
        “Learning does not make one learned: there are those who have knowledge
        and those who have understanding. The first requires memory and the
        second philosophy.”
      </>
    ),
    author: "Alexandre Dumas, The Count of Monte Cristo",
  },

  {
    node: (
      <>
        “What mazes there are in this world. The branches of trees, the filigree
        of roots, the matrix of crystals. Mazes in the nodules on murex shells
        and in the textures of sycamore bark and inside the hollow bones of
        eagles. None more complicated than the human brain, what may be the most
        complex object in existence; one wet kilogram within which spin
        universes.”
      </>
    ),
    author: "Anthony Doerr, All the Light We Cannot See",
  },
  {
    node: (
      <>
        “He walked out in the gray light and stood and he saw for a brief moment
        the absolute truth of the world. The cold relentless circling of the
        intestate earth. Darkness implacable. The crushing black vacuum of the
        universe. Borrowed time and borrowed world and borrowed eyes with which
        to sorrow it.”
      </>
    ),
    author: "Cormac McCarthy, The Road",
  },
  {
    node: (
      <>
        “Our flesh is the debris of dead stars, and this is also true of the
        apple and its tree, of each hair on the spider’s legs, and of the rock
        rusting on planet Mars. Each minuscule being has spokes radiating out to
        all of creation. From one living thing, the properties of any other may
        be predicted. Looking at any particle with sufficient care, and
        following the chain that links all things together, we can arrive at the
        universe.”
      </>
    ),
    author: "Hernan Diaz, In the Distance",
  },
  {
    node: (
      <>
        “The brain is locked in total darkness, of course. It floats in a clear
        liquid inside the skull, never in the light. And yet the world it
        constructs in the mind is full of light. It brims with color and
        movement. So how does the brain, which lives without a spark of light,
        build for us a world full of light?”
      </>
    ),
    author: "Anthony Doerr, All the Light We Cannot See",
  },
  {
    node: (
      <>
        “Most of us prefer to believe we are the active subjects of our
        victories but only the passive objects of our defeats. We triumph, but
        it is not really we who fail — we are ruined by forces beyond our
        control.”
      </>
    ),
    author: "Hernan Diaz, Trust",
  },
  {
    node: (
      <>
        “Nature’s first green is gold,
        <br /> Her hardest hue to hold.
        <br />
        Her early leaf&thinsp;’s a flower; <br />
        But only so an hour. <br />
        Then leaf subsides to leaf. <br />
        So Eden sank to grief, <br />
        So dawn goes down to day. <br />
        Nothing gold can stay.”
      </>
    ),
    author: "Robert Frost",
  },
  {
    node: (
      <>
        “Every life is organized around a small number of events that either
        propel us or bring us to a grinding halt. We spend the years between
        these episodes benefiting or suffering from their consequences until the
        arrival of the next forceful moment.”
      </>
    ),
    author: "Hernan Diaz, Trust",
  },
  {
    node: (
      <>
        “A man’s worth is established by the number of these defining
        circumstances he is able to create for himself. He need not always be
        successful, for there can be great honor in defeat. But he ought to be
        the main actor in the decisive scenes in his existence, whether they be
        epic or tragic.”
      </>
    ),
    author: "Hernan Diaz, Trust",
  },
  {
    node: (
      <>
        “When you compare the sorrows of real life to the pleasures of the
        imaginary one, you will never want to live again, only to dream
        forever.”
      </>
    ),
    author: "Alexandre Dumas, The Count of Monte Cristo",
  },
  {
    node: (
      <>
        “Each day had its own sun. During its journey across the sky, the bright
        disc would burn out, sink, and melt on the horizon, pouring down the
        precipice at the end of the earth like wax. And just like a candle
        maker, god would reuse these drippings to make a new sun overnight.”
      </>
    ),
    author: "Hernan Diaz, In the Distance",
  },
  {
    node: (
      <>
        “What do we call visible light? We call it color. But the
        electromagnetic spectrum runs to zero in one direction and infinity in
        the other, so really, children, mathematically, all of light is
        invisible.”
      </>
    ),
    author: "Anthony Doerr, All the Light We Cannot See",
  },
  {
    node: (
      <>
        “The love of literature, of language, of the mystery of the mind and
        heart showing themselves in the minute, strange, and unexpected
        combinations of letters and words, in the blackest and coldest print—the
        love which he had hidden as if it were illicit and dangerous, he began
        to display, tentatively at first, and then boldly, and then proudly.”
      </>
    ),
    author: "John Williams, Stoner",
  },
  {
    node: (
      <>
        “Nothing left behind in the wilderness could ever be retrieved. Every
        encounter was final. Nobody came back from beyond the horizon. It was
        impossible to return to anything or anyone. Whatever was out of sight
        was forever lost.”
      </>
    ),
    author: "Hernan Diaz, In the Distance",
  },
  {
    node: (
      <>
        “Perhaps in the world’s destruction it would be possible at last to see
        how it was made. Oceans, mountains. The ponderous counterspectacle of
        things ceasing to be. The sweeping waste, hydroptic and coldly secular.
        The silence.”
      </>
    ),
    author: "Cormac McCarthy, The Road",
  },
  {
    node: (
      <>
        “After thousands of nights under those same stars, he woke up as many
        thousands of mornings under that same sun and trudged for as many
        thousands of days under the same sky, always feeling out of place.”
      </>
    ),
    author: "Hernan Diaz, In the Distance",
  },
];

export default function AboutQuotes() {
  const reduceMotion = useReducedMotion();
  const [state, setState] = useState({ index: 0, prev: -1, dir: 1 });

  const go = useCallback((next: number, dir?: number) => {
    setState((s) =>
      next === s.index
        ? s
        : { index: next, prev: s.index, dir: dir ?? (next > s.index ? 1 : -1) },
    );
  }, []);

  const step = useCallback((delta: 1 | -1) => {
    setState((s) => ({
      index: (s.index + delta + QUOTES.length) % QUOTES.length,
      prev: s.index,
      dir: delta,
    }));
  }, []);

  const drag = useRef<{ x: number; y: number; id: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const start = drag.current;
    drag.current = null;
    if (!start || start.id !== e.pointerId) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
    if (e.pointerType === "mouse" && window.getSelection()?.toString()) return;
    step(dx < 0 ? 1 : -1);
  };
  const onPointerCancel = () => {
    drag.current = null;
  };

  const dots = useRef<HTMLDivElement>(null);
  const onDotsKeyDown = (e: React.KeyboardEvent) => {
    let next: number;
    if (e.key === "ArrowRight") next = (state.index + 1) % QUOTES.length;
    else if (e.key === "ArrowLeft")
      next = (state.index - 1 + QUOTES.length) % QUOTES.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = QUOTES.length - 1;
    else return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : undefined;
    go(next, dir);
    dots.current?.querySelectorAll("button")[next]?.focus();
  };

  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => step(1), INTERVAL);
    return () => clearTimeout(timer);
  }, [state.index, step, paused]);

  return (
    <>
      <SectionDivider />
      <div className="about-quote-container">
        <div
          className="about-quote-stage"
          onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
          onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
        >
          <div className="about-quote-overlay">
            {QUOTES.map((quote, i) => {
              const active = i === state.index;
              const leaving = i === state.prev;
              const x = reduceMotion
                ? 0
                : active
                  ? [40 * state.dir, 0]
                  : 40 * (leaving ? -1 : 1) * state.dir;
              return (
                <motion.blockquote
                  key={i}
                  className="about-quote quote"
                  style={{
                    userSelect: active ? "auto" : "none",
                    pointerEvents: active ? "auto" : "none",
                  }}
                  initial={false}
                  animate={{
                    opacity: active ? 1 : 0,
                    x,
                    filter: active || reduceMotion ? BLUR_NONE : BLUR_IN,
                  }}
                  transition={
                    active
                      ? { duration: 0.4, ease: "easeInOut", delay: 0.4 }
                      : { duration: 0.4, ease: "easeInOut" }
                  }
                  aria-hidden={!active}
                >
                  {quote.node}
                  <h3 className="about-quote-attr">— {quote.author}</h3>
                </motion.blockquote>
              );
            })}
          </div>
        </div>
        <div className="about-quote-dots" ref={dots} onKeyDown={onDotsKeyDown}>
          {QUOTES.map((quote, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-current={i === state.index}
              aria-label={`Quote ${i + 1} of ${QUOTES.length} — ${quote.author}`}
            >
              <span />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
