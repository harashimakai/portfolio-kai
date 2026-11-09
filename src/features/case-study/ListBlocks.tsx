import type { ReactNode } from "react";
import { motion } from "motion/react";

import { revealGroup, revealItem } from "../../lib/animations";
import { Bullets, Titled } from "./TextBlocks";

// Cards

export function Cards({
  items,
  stacked = false,
  title,
  titleLogo,
  className,
}: {
  items: {
    title: ReactNode;
    lines: ReactNode[];
    logo?: string;
    image?: string;
  }[];
  stacked?: boolean;
  title?: ReactNode;
  titleLogo?: string;
  className?: string;
}) {
  return (
    <Titled
      title={title}
      logo={titleLogo}
    >
      <motion.div
        className={["study-cards", stacked && "is-stacked", className].filter(Boolean).join(" ")}
        {...revealGroup()}
      >
        {items.map((card, i) => (
          <motion.div
            key={i}
            className="study-card"
            {...revealItem(i)}
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
                style={{
                  maskImage: `url("${card.logo}")`,
                  WebkitMaskImage: `url("${card.logo}")`,
                }}
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
    </Titled>
  );
}

// Takeaways

interface EntryView {
  title: ReactNode;
  body: ReactNode;
}

export function Takeaways({
  items,
  grid = false,
}: {
  items: EntryView[];
  grid?: boolean;
}) {
  return (
    <motion.ol
      className={grid ? "study-takeaways is-grid" : "study-takeaways"}
      {...revealGroup()}
    >
      {items.map((t, i) => (
        <motion.li
          key={i}
          {...revealItem(i)}
        >
          {!grid && <span className="study-takeaway-number">{String(i + 1).padStart(2, "0")}</span>}
          <div>
            <p className="study-takeaway-title">{t.title}</p>
            <p className="study-takeaway-body">{t.body}</p>
          </div>
        </motion.li>
      ))}
    </motion.ol>
  );
}

// Stats

export function Stats({
  items,
}: {
  items: { value: ReactNode; label: ReactNode }[];
}) {
  return (
    <motion.dl
      className="study-stats"
      {...revealGroup(0.3)}
    >
      {items.map((stat, i) => (
        <motion.div
          key={i}
          className="study-stat"
          {...revealItem(i)}
        >
          <dt className="study-stat-value">{stat.value}</dt>
          <dd className="study-stat-label">{stat.label}</dd>
        </motion.div>
      ))}
    </motion.dl>
  );
}

// Columns

export function Columns({
  items,
}: {
  items: { title: ReactNode; body?: ReactNode; lines?: ReactNode[] }[];
}) {
  return (
    <motion.div
      className="study-columns"
      {...revealGroup(0.3)}
    >
      {items.map((item, i) => (
        <motion.div
          key={i}
          {...revealItem(i)}
        >
          <p className="study-column-title">{item.title}</p>
          {item.body && <p className="study-body">{item.body}</p>}
          {item.lines && <Bullets items={item.lines} />}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Steps

export function Steps({
  items,
  title,
  titleLogo,
}: {
  items: EntryView[];
  title?: ReactNode;
  titleLogo?: string;
}) {
  return (
    <Titled
      title={title}
      logo={titleLogo}
    >
      <motion.ol
        className="study-steps"
        {...revealGroup(0.3)}
      >
        {items.map((step, i) => (
          <motion.li
            key={i}
            {...revealItem(i)}
          >
            <p className="study-step-title">
              {i + 1}: {step.title}
            </p>
            <p className="study-step-body">{step.body}</p>
          </motion.li>
        ))}
      </motion.ol>
    </Titled>
  );
}
