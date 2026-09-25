import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import SectionDiv from "../global/SectionDiv";
import { BLUR_IN, BLUR_NONE } from "../global/AnimationConsts";

const INTERVAL = 9000;

type Quote = { node: ReactNode; author: string };

const QUOTES: Quote[] = [
  {
    node: (
      <>
        “What mazes there are in this world. The branches of trees, the filigree
        of roots, the matrix of crystals, the streets her father recreated in
        his models. Mazes in the nodules on murex shells and in the textures of
        sycamore bark and inside the hollow bones of eagles. None more
        complicated than the human brain, Etienne would say, what may be the
        most complex object in existence; one wet kilogram within which spin
        universes.”
      </>
    ),
    author: "ANTHONY DOERR, ALL THE LIGHT WE CANNOT SEE",
  },
  {
    node: (
      <>
        “Once there were brook trout in the streams in the mountains… They
        smelled of moss in your hand. Polished and muscular and torsional. On
        their backs were vermiculate patterns that were maps of the world in its
        becoming. Maps and mazes. Of a thing which could not be put back. Not be
        made right again. In the deep glens where they lived all things were
        older than man and they hummed of mystery.”
      </>
    ),
    author: "CORMAC MCCARTHY, THE ROAD",
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
    author: "ANTHONY DOERR, ALL THE LIGHT WE CANNOT SEE",
  },
  {
    node: (
      <>
        “He walked out in the gray light and stood and he saw for a brief moment
        the absolute truth of the world. The cold relentless circling of the
        intestate earth. Darkness implacable. The blind dogs of the sun in their
        running. The crushing black vacuum of the universe. And somewhere two
        hunted animals trembling like ground-foxes in their cover. Borrowed time
        and borrowed world and borrowed eyes with which to sorrow it. ”
      </>
    ),
    author: "CORMAC MCCARTHY, THE ROAD",
  },
  {
    node: (
      <>
        “The brain is locked in total darkness, of course, children. It floats
        in a clear liquid inside the skull, never in the light. And yet the
        world it constructs in the mind is full of light. It brims with color
        and movement. So how, children, does the brain, which lives without a
        spark of light, build for us a world full of light?”
      </>
    ),
    author: "ANTHONY DOERR, ALL THE LIGHT WE CANNOT SEE",
  },
  {
    node: (
      <>
        “Open your eyes and see what you can with them before they close
        forever.”
      </>
    ),
    author: "ANTHONY DOERR, ALL THE LIGHT WE CANNOT SEE",
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
    author: "HERNAN DIAZ, TRUST",
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
    author: "HERNAN DIAZ, TRUST",
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
    author: "ROBERT FROST",
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
    author: "HERNAN DIAZ, TRUST",
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
    author: "CORMAC MCCARTHY, THE ROAD",
  },
  {
    node: (
      <>
        “Learning does not make one learned: there are those who have knowledge
        and those who have understanding. The first requires memory and the
        second philosophy.”
      </>
    ),
    author: "ALEXANDRE DUMAS, THE COUNT OF MONTE CRISTO",
  },
  {
    node: (
      <>
        “You can’t get away from yourself by moving from one place to another.”
      </>
    ),
    author: "ERNEST HEMINGWAY, THE SUN ALSO RISES",
  },
  {
    node: (
      <>
        “We are travelers on a cosmic journey, stardust, swirling and dancing in
        the eddies and whirlpools of infinity. Life is eternal. We have stopped
        for a moment to encounter each other, to meet, to love, to share. This
        is a precious moment. It is a little parenthesis in eternity.”
      </>
    ),
    author: "PAULO COELHO, THE ALCHEMIST",
  },
  {
    node: (
      <>
        "When you compare the sorrows of real life to the pleasures of the
        imaginary one, you will never want to live again, only to dream
        forever."
      </>
    ),
    author: "ALEXANDRE DUMAS, THE COUNT OF MONTE CRISTO",
  },
  {
    node: (
      <>
        “Autumn leaves don’t fall; they fly. They take their time and wander on
        this, their only chance to soar.”
      </>
    ),
    author: "DELIA OWENS, WHERE THE CRAWDADS SING",
  },
  {
    node: (
      <>
        “I thought once that gods are the opposite of death, but I see now they
        are more dead than anything, for they are unchanging, and can hold
        nothing in their hands.”
      </>
    ),
    author: "MADELINE MILLER, CIRCE",
  },
];

export default function AboutSplash() {
  // `dir` keeps the outgoing quote leaving the way the incoming one arrives,
  // so stepping backwards through the dots reads as backwards.
  const [state, setState] = useState({ index: 0, prev: -1, dir: 1 });

  const go = useCallback((next: number) => {
    setState((s) =>
      next === s.index
        ? s
        : { index: next, prev: s.index, dir: next > s.index ? 1 : -1 },
    );
  }, []);

  // Keyed on the current index, so choosing a quote restarts the dwell rather
  // than inheriting whatever was left of the previous one.
  useEffect(() => {
    const timer = setTimeout(() => {
      setState((s) => ({
        index: (s.index + 1) % QUOTES.length,
        prev: s.index,
        dir: 1,
      }));
    }, INTERVAL);
    return () => clearTimeout(timer);
  }, [state.index]);

  return (
    <>
      <SectionDiv />
      <div className="about-quote-container">
        <div className="about-quote-stage">
          {/* All quotes share the same grid cell; the container sizes to the tallest. */}
          <div
            className="about-quote-overlay"
            style={{ display: "grid", alignItems: "center" }}
          >
            {QUOTES.map((quote, i) => {
              const active = i === state.index;
              const leaving = i === state.prev;
              return (
                <motion.blockquote
                  key={i}
                  className="about-quote quote"
                  style={{
                    gridArea: "1 / 1",
                    userSelect: active ? "auto" : "none",
                    pointerEvents: active ? "auto" : "none",
                  }}
                  initial={false}
                  animate={{
                    opacity: active ? 1 : 0,
                    y: active ? 0 : (leaving ? -20 : 20) * state.dir,
                    filter: active ? BLUR_NONE : BLUR_IN,
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
        <div className="about-quote-dots">
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
