import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";

import InViewVideo from "../../components/ui/InViewVideo";
import { fadeUpDelayed, staggerContainer } from "../../lib/animations";
import useIntroScroll from "./useIntroScroll";

// Constants

const MIN_HERO_OFFSET = 16;

// Hero offset

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
      const nav =
        document.querySelector<HTMLElement>(".navbar")?.offsetHeight ?? 0;
      setOffset(nav + Math.max(MIN_HERO_OFFSET, (vh - nav - el.offsetHeight) / 2));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return { ref, offset };
}

// Types

export interface HeroProps {
  title: string;
  logoSvg?: string;
  subtitle: ReactNode;
  video?: { src: string; poster: string };
  meta: { label: string; lines: ReactNode[] }[];
}

// Hero

export function StudyHero({
  title,
  logoSvg,
  subtitle,
  video,
  meta,
}: HeroProps) {
  const hero = useHeroOffset();
  useIntroScroll(hero.ref, Boolean(video));
  return (
    <motion.header
      className={video ? "study-hero has-video" : "study-hero"}
      style={
        video && hero.offset !== null ? { paddingTop: hero.offset } : undefined
      }
      variants={staggerContainer}
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
            variants={fadeUpDelayed}
            custom={0.15}
          >
            <InViewVideo
              src={video.src || undefined}
              poster={video.poster}
              aria-label={title}
              autoPlay
              muted
              loop
              playsInline
            />
          </motion.figure>
          <motion.h1
            className="study-hero-title"
            variants={fadeUpDelayed}
            custom={0.3}
          >
            {subtitle}
          </motion.h1>
        </>
      ) : (
        <>
          <motion.h1
            className="study-hero-logo"
            aria-label={title}
            variants={fadeUpDelayed}
            custom={0.15}
            dangerouslySetInnerHTML={{ __html: logoSvg ?? "" }}
          />
          <motion.p
            className="study-hero-subtitle"
            variants={fadeUpDelayed}
            custom={0.3}
          >
            {subtitle}
          </motion.p>
        </>
      )}
      {/* Meta */}
      <dl className="study-hero-meta">
        {meta.map((col, i) => (
          <motion.div
            key={col.label}
            variants={fadeUpDelayed}
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
