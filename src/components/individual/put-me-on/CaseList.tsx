import CasePill from "./CasePill";

interface Props {
  bullets: string[];
  dark?: boolean;
}

export default function CaseList({ bullets, dark = false }: Props) {
  return (
    <ul className="case-list">
      {bullets.map((b, idx) => (
        <li>
          <span className="case-accent">-</span>
          <span className={dark ? "case-dark" : "case-light"}>{b}</span>
        </li>
      ))}
    </ul>
  );
}
