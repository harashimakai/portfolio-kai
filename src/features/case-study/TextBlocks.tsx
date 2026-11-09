import type { ReactNode } from "react";
import { motion } from "motion/react";

import { reveal, revealGroup, revealItem } from "../../lib/animations";

// Accent

export function Accent({ children }: { children: ReactNode }) {
  return <span className="study-accent">{children}</span>;
}

// Statement

export function Statement({ children }: { children: ReactNode }) {
  return (
    <motion.h3
      className="study-statement text-heading"
      {...reveal(0.1)}
    >
      {children}
    </motion.h3>
  );
}

// Kicker

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <motion.p
      className="study-kicker text-label"
      {...reveal(0)}
    >
      {children}
    </motion.p>
  );
}

// Block title

function Subheading({
  children,
  logo,
}: {
  children: ReactNode;
  logo?: string;
}) {
  return (
    <motion.h4
      className={logo ? "study-subheading text-label-sm has-logo" : "study-subheading text-label-sm"}
      {...reveal(0.1)}
    >
      {logo && (
        <span
          className="study-subheading-badge"
          aria-hidden="true"
        >
          <span
            className="study-subheading-logo"
            style={{
              maskImage: `url("${logo}")`,
              WebkitMaskImage: `url("${logo}")`,
            }}
          />
        </span>
      )}
      <span>{children}</span>
    </motion.h4>
  );
}

export function Titled({
  title,
  logo,
  children,
}: {
  title?: ReactNode;
  logo?: string;
  children: ReactNode;
}) {
  if (!title) return <>{children}</>;
  return (
    <div className="study-titled">
      <Subheading logo={logo}>{title}</Subheading>
      {children}
    </div>
  );
}

// Body

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

// Bullets

export function Bullets({
  items,
  grid = false,
  title,
  titleLogo,
}: {
  items: ReactNode[];
  grid?: boolean;
  title?: ReactNode;
  titleLogo?: string;
}) {
  return (
    <Titled
      title={title}
      logo={titleLogo}
    >
      <motion.ul
        className={grid ? "study-bullets is-grid" : "study-bullets"}
        {...revealGroup(0.3)}
      >
        {items.map((item, i) => (
          <motion.li
            key={i}
            {...revealItem(i)}
          >
            <span
              className="study-bullet"
              aria-hidden="true"
            />
            <p>{item}</p>
          </motion.li>
        ))}
      </motion.ul>
    </Titled>
  );
}

// Callout

export function Callout({
  label,
  text,
}: {
  label: ReactNode;
  text: ReactNode;
}) {
  return (
    <motion.aside
      className="study-callout"
      {...reveal(0.1)}
    >
      <p className="study-callout-label">{label}</p>
      <p className="study-callout-text">{text}</p>
    </motion.aside>
  );
}

// Quotes

export function Quotes({ items }: { items: ReactNode[] }) {
  return (
    <motion.div
      className="study-quotes"
      {...revealGroup()}
    >
      {items.map((quote, i) => (
        <motion.blockquote
          key={i}
          className="study-quote"
          {...revealItem(i)}
        >
          {quote}
        </motion.blockquote>
      ))}
    </motion.div>
  );
}
