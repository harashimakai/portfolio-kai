import { useState, useEffect } from "react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import SectionDiv from "../global/SectionDiv";

// Interleaved so no two adjacent quotes share the same author.
// Order: McCarthy · Doerr · Diaz · McCarthy · Doerr · Diaz · McCarthy · Doerr · Diaz · McCarthy · Doerr · Dumas · McCarthy · Coelho · Owens
//
// `text` is the plain string fallback. Add `node` to render styled <span> elements.
type Quote = { text: string; node?: ReactNode; author: string };

const QUOTES: Quote[] = [
  {
    text: '"He walked out in the gray light and stood and he saw for a brief moment the absolute truth of the world. The cold relentless circling of the intestate earth. Darkness implacable. The crushing black vacuum of the universe. And somewhere two hunted animals trembling like ground-foxes in their cover. Borrowed time and borrowed world and borrowed eyes with which to sorrow it."',
    node: (
      <>
        “He walked out in the gray light and stood and he saw for a brief moment
        the absolute truth of the world. The cold relentless circling of the
        intestate earth. Darkness implacable. The crushing black vacuum of the
        universe...{" "}
        <span className="accent">
          Borrowed time and borrowed world and borrowed eyes with which to
          sorrow it.
        </span>
        ”
      </>
    ),
    author: "CORMAC MCCARTHY, THE ROAD",
  },
  {
    text: '"Open your eyes and see what you can with them before they close forever."',
    node: (
      <>
        “Open your eyes and see what you can with them before they close
        forever.”
      </>
    ),
    author: "ANTHONY DOERR, ALL THE LIGHT WE CANNOT SEE",
  },
  {
    text: '"Most of us prefer to believe we are the active subjects of our victories but only the passive objects of our defeats. We triumph, but it is not really we who fail — we are ruined by forces beyond our control."',
    node: (
      <>
        “Most of us prefer to believe we are the active subjects of our
        victories but only the passive objects of our defeats.{" "}
        <span className="accent">
          We triumph, but it is not really we who fail
        </span>{" "}
        — we are ruined by forces beyond our control.”
      </>
    ),
    author: "HERNAN DIAZ, TRUST",
  },
  {
    text: '"Once there were brook trout in the streams in the mountains… They smelled of moss in your hand. Polished and muscular and torsional. On their backs were vermiculate patterns that were maps of the world in its becoming. Maps and mazes. Of a thing which could not be put back. Not be made right again. In the deep glens where they lived all things were older than man and they hummed of mystery."',
    node: (
      <>
        “Once there were brook trout in the streams in the mountains… They
        smelled of moss in your hand. Polished and muscular and torsional. On
        their backs were vermiculate patterns that were{" "}
        <span className="accent">maps of the world in its becoming.</span> Maps
        and mazes. Of a thing which could not be put back. Not be made right
        again. In the deep glens where they lived all things were older than man
        and they hummed of mystery.”
      </>
    ),
    author: "CORMAC MCCARTHY, THE ROAD",
  },
  {
    text: '"What do we call visible light? We call it color. But the electromagnetic spectrum runs to zero in one direction and infinity in the other, so really, children, mathematically, all of light is invisible."',
    node: (
      <>
        “What do we call visible light? We call it color. But the
        electromagnetic spectrum runs to zero in one direction and infinity in
        the other, so really, children, mathematically,{" "}
        <span className="accent">all of light is invisible.</span>”
      </>
    ),
    author: "ANTHONY DOERR, ALL THE LIGHT WE CANNOT SEE",
  },
  {
    text: '"Every life is organized around a small number of events that either propel us or bring us to a grinding halt. We spend the years between these episodes benefiting or suffering from their consequences until the arrival of the next forceful moment."',
    node: (
      <>
        “Every life is organized around a small number of events that either
        propel us or bring us to a grinding halt. We spend the years between
        these episodes benefiting or suffering from their consequences{" "}
        <span className="accent">
          until the arrival of the next forceful moment.
        </span>
        ”
      </>
    ),
    author: "HERNAN DIAZ, TRUST",
  },
  {
    text: '"Query: How does the never to be differ from what never was?"',
    node: (
      <>
        “<span className="italic">Query</span>: How does the never to be differ
        from what never was?”
      </>
    ),
    author: "CORMAC MCCARTHY, THE ROAD",
  },
  {
    text: '"What mazes there are in this world. The branches of trees, the filigree of roots, the matrix of crystals, the streets her father recreated in his models... None more complicated than the human brain, Etienne would say, what may be the most complex object in existence; one wet kilogram within which spin universes."',
    node: (
      <>
        “What mazes there are in this world. The branches of trees, the filigree
        of roots, the matrix of crystals, the streets her father recreated in
        his models... None more complicated than the human brain, Etienne would
        say, what may be the most complex object in existence;{" "}
        <span className="accent">
          one wet kilogram within which spin universes.
        </span>
        ”
      </>
    ),
    author: "ANTHONY DOERR, ALL THE LIGHT WE CANNOT SEE",
  },
  {
    text: '"A man\'s worth is established by the number of these defining circumstances he is able to create for himself. He need not always be successful, for there can be great honor in defeat. But he ought to be the main actor in the decisive scenes in his existence, whether they be epic or tragic."',
    node: (
      <>
        “A man’s worth is established by the number of these defining
        circumstances he is able to create for himself. He need not always be
        successful, for there can be great honor in defeat. But he ought to be
        the main actor in the decisive scenes in his existence,{" "}
        <span className="accent">whether they be epic or tragic.</span>”
      </>
    ),
    author: "HERNAN DIAZ, TRUST",
  },
  {
    text: '"Perhaps in the world\'s destruction it would be possible at last to see how it was made. Oceans, mountains. The ponderous counterspectacle of things ceasing to be. The sweeping waste, hydroptic and coldly secular. The silence."',
    node: (
      <>
        “Perhaps in the world’s destruction it would be possible at last to see
        how it was made. Oceans, mountains. The ponderous counterspectacle of
        things ceasing to be.{" "}
        <span className="accent">
          The sweeping waste, hydroptic and coldly secular.
        </span>{" "}
        The silence.”
      </>
    ),
    author: "CORMAC MCCARTHY, THE ROAD",
  },
  {
    text: '"The brain is locked in total darkness, of course, children. It floats in a clear liquid inside the skull, never in the light. And yet the world it constructs in the mind is full of light. It brims with color and movement. So how, children, does the brain, which lives without a spark of light, build for us a world full of light?"',
    node: (
      <>
        “The brain is locked in total darkness, of course, children. It floats
        in a clear liquid inside the skull, never in the light. And yet the
        world it constructs in the mind is full of light. It brims with color
        and movement. So how, children, does the brain, which lives without a
        spark of light,{" "}
        <span className="accent">build for us a world full of light?</span>”
      </>
    ),
    author: "ANTHONY DOERR, ALL THE LIGHT WE CANNOT SEE",
  },
  {
    text: '"Learning does not make one learned: there are those who have knowledge and those who have understanding. The first requires memory and the second philosophy."',
    node: (
      <>
        “Learning does not make one learned: there are those who have knowledge
        and those who have understanding. The first requires{" "}
        <span className="accent">memory</span> and the second{" "}
        <span className="accent">philosophy.</span>”
      </>
    ),
    author: "ALEXANDRE DUMAS, THE COUNT OF MONTE CRISTO",
  },
  {
    text: '"You forget what you want to remember, and you remember what you want to forget."',
    node: (
      <>
        “You forget what you want to remember, and you remember what you want to
        forget.”
      </>
    ),
    author: "CORMAC MCCARTHY, THE ROAD",
  },
  {
    text: '"We are travelers on a cosmic journey, stardust, swirling and dancing in the eddies and whirlpools of infinity. Life is eternal. We have stopped for a moment to encounter each other, to meet, to love, to share. This is a precious moment. It is a little parenthesis in eternity."',
    node: (
      <>
        “We are travelers on a cosmic journey, stardust, swirling and dancing in
        the eddies and whirlpools of infinity. Life is eternal. We have stopped
        for a moment to encounter each other, to meet, to love, to share. This
        is a precious moment.{" "}
        <span className="accent">It is a little parenthesis in eternity.</span>”
      </>
    ),
    author: "PAULO COELHO, THE ALCHEMIST",
  },
  {
    text: '"Autumn leaves don\'t fall; they fly. They take their time and wander on this, their only chance to soar."',
    node: (
      <>
        “<span className="accent">Autumn leaves don’t fall; they fly</span>.{" "}
        They take their time and wander on this, their only chance to soar.”
      </>
    ),
    author: "DELIA OWENS, WHERE THE CRAWDADS SING",
  },
];

export default function AboutSplash() {
  const [state, setState] = useState({ index: 0, prev: -1 });
  useEffect(() => {
    const timer = setInterval(() => {
      setState((s) => ({
        prev: s.index,
        index: (s.index + 1) % QUOTES.length,
      }));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <SectionDiv
        left="// 04 — MARGINALIA"
        right="FROM THE READING LIST"
      />
      <div className="about-quote-container">
        <div className="about-quote-stage">
          {/* All quotes share the same grid cell; the container sizes to the tallest. */}
          <div
            className="about-quote-overlay"
            style={{ display: "grid", alignItems: "center" }}
          >
            {QUOTES.map((quote, i) => (
              <motion.blockquote
                key={i}
                className="about-quote"
                style={{
                  gridArea: "1 / 1",
                  userSelect: i === state.index ? "auto" : "none",
                  pointerEvents: i === state.index ? "auto" : "none",
                }}
                initial={false}
                animate={{
                  opacity: i === state.index ? 1 : 0,
                  y: i === state.index ? 0 : i === state.prev ? -20 : 20,
                }}
                transition={
                  i === state.index
                    ? { duration: 0.4, ease: "easeInOut", delay: 0.4 }
                    : { duration: 0.4, ease: "easeInOut" }
                }
              >
                {quote.node ?? quote.text}
                <div
                  className="quote-attr"
                  style={{ marginTop: "20px" }}
                >
                  — {quote.author}
                </div>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
