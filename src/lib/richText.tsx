import type { ReactNode } from "react";

const MARK = /(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_)/g;

export function rich(text: string): ReactNode {
  const lines = text.split("\n");
  if (lines.length > 1)
    return lines.map((line, i) => (
      <span key={i}>
        {i > 0 && <br />}
        {richLine(line)}
      </span>
    ));
  return richLine(text);
}

function richLine(text: string): ReactNode {
  const parts = text.split(MARK);
  if (parts.length === 1) return text;
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4)
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2)
      return (
        <span
          key={i}
          className="study-accent"
        >
          {part.slice(1, -1)}
        </span>
      );
    if (part.startsWith("_") && part.endsWith("_") && part.length > 2)
      return <em key={i}>{part.slice(1, -1)}</em>;
    return part;
  });
}
