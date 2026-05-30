import { ReactNode } from "react";
import React from "react";

interface Props {
  indices: string[];
  bullets: ReactNode[];
  descriptions: string[];
  dark?: boolean;
}

export default function CaseAccordion({
  indices,
  bullets,
  descriptions,
  dark = false,
}: Props) {
  const [active, setActive] = React.useState(0);
  return (
    <div className="case-accordion">
      {bullets.map((b, idx) => {
        const on = idx === active;
        return (
          <div
            key={idx}
            onMouseEnter={() => setActive(idx)}
            className="case-accordion-item"
            style={{
              borderTop:
                idx === 0
                  ? "none"
                  : dark
                    ? `1px solid var(--cs-rule)`
                    : `1px solid var(--cs-text-alt-muted)`,
            }}
          >
            <div
              className="case-accordion-focus"
              style={{ transform: on ? "scaleY(1)" : "scaleY(0)" }}
            />
            <span
              className={`${on ? "case-accent" : undefined} case-accordion-title`}
              style={{
                color: dark
                  ? "var(--cs-text-muted)"
                  : "var(--cs-text-alt-muted)",
              }}
            >
              {indices[idx]}
            </span>
            <span
              className={`${on ? "case-accent" : undefined} case-accordion-title`}
              style={{
                color: dark
                  ? "var(--cs-text-muted)"
                  : "var(--cs-text-alt-muted)",
              }}
            >
              →
            </span>
            <div>
              <div
                className={`case-accordion-title ${on ? "case-accordion-bullet-active" : undefined}`}
                style={{
                  fontWeight: 700,
                  color: dark
                    ? on
                      ? "var(--cs-text)"
                      : "var(--cs-text-muted)"
                    : on
                      ? "var(--cs-text-alt)"
                      : "var(--cs-text-alt-muted)",
                }}
              >
                {b}
              </div>
              <div
                className="case-accordion-desc"
                style={{
                  maxHeight: on ? 120 : 0,
                  opacity: on ? 1 : 0,
                  marginTop: on ? 18 : 0,
                }}
              >
                <p
                  className="case-section-small-text"
                  style={{
                    color: dark ? `var(--cs-text)` : `var(--cs-text-alt)`,
                    maxWidth: 720,
                  }}
                >
                  {descriptions[idx]}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
