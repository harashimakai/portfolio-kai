import { ReactNode } from "react";

interface Props {
  bullets: ReactNode[];
  dark?: boolean;
}

export default function CaseStack({ bullets, dark = false }: Props) {
  return (
    <ul className="case-stack">
      {bullets.map((b, idx) => (
        <li key={idx}>
          <span className="case-stack-index">0{idx + 1}.</span>
          <p
            className={`case-section-small-text ${dark ? "case-light" : "case-dark"}`}
          >
            {b}
          </p>
        </li>
      ))}
    </ul>
  );
}
