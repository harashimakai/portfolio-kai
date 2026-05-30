import { useEffect } from "react";

import { putmeon } from "../StudyData";
import backgroundCover from "../../../assets/case-studies/putmeon/gradient.png";

interface Props {
  num: string;
  name: string;
  dark?: boolean;
  children: React.ReactNode;
  sub?: string;
}

export default function CaseBand({
  num,
  name,
  dark = true,
  children,
  sub,
}: Props) {
  return (
    <section
      className="band-content"
      style={{
        background: dark ? `var(--cs-bg)` : `var(--cs-surface)`,
        color: dark ? `var(--cs-text)` : `var(--cs-text-alt)`,
      }}
    >
      <div
        className="band-container"
        style={{
          borderBottom: dark
            ? `1px solid var(--cs-rule)`
            : `1px solid var(--cs-rule-alt)`,
        }}
      >
        <span className="band-num">{num}</span>
        <span
          className="band-name"
          style={{ color: dark ? `var(--cs-text)` : `var(--cs-text-alt)` }}
        >
          {name}
        </span>
        <div
          className="band-divider"
          style={{
            background: dark ? `var(--cs-rule)` : `var(--cs-rule-alt)`,
          }}
        ></div>
        <span
          style={{
            color: dark ? `var(--cs-text-muted)` : `var(--cs-text-alt-muted)`,
          }}
        >
          {sub || ""}
        </span>
      </div>
      {children}
    </section>
  );
}
