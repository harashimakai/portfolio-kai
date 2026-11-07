import { createContext, useContext, useState, type ReactNode } from "react";
import { rich } from "../../lib/richText";
import type { Asset, Block } from "../../types/caseStudy";

export const BLOCK_TYPES: { type: Block["type"]; label: string; small?: boolean }[] = [
  { type: "statement", label: "Statement" },
  { type: "statement", label: "Small statement", small: true },
  { type: "kicker", label: "Eyebrow" },
  { type: "body", label: "Paragraph" },
  { type: "bullets", label: "Bullets" },
  { type: "cards", label: "3 cards" },
  { type: "takeaways", label: "Takeaways" },
  { type: "figures", label: "Images" },
  { type: "video", label: "Video" },
  { type: "divider", label: "Divider" },
];

export interface Ctx {
  editing: boolean;
  drafts: React.MutableRefObject<Record<string, string>>;
  assets: Record<string, Asset>;
  ops: {
    deleteSection(i: number): void;
    addSection(i: number): void;
    moveBlock(s: number, b: number, dir: -1 | 1): void;
    moveSection(i: number, dir: -1 | 1): void;
    deleteBlock(s: number, b: number): void;
    addBlock(s: number, b: number, kind: (typeof BLOCK_TYPES)[number]): void;
    addItem(s: number, b: number, c?: number): void;
    deleteItem(s: number, b: number, i: number, c?: number): void;
    setAsset(s: number, b: number, i: number, asset: string): void;
    toggleSequence(s: number, b: number): void;
  };
}
export const EditCtx = createContext<Ctx | null>(null);

export function Field({ k, value }: { k: string; value: string }) {
  const ctx = useContext(EditCtx)!;
  if (!ctx.editing) return <>{rich(value)}</>;
  return (
    <span
      className="study-editable"
      contentEditable
      suppressContentEditableWarning
      spellCheck
      onInput={(e) => {
        ctx.drafts.current[k] = e.currentTarget.innerText.replace(/\n+$/, "");
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          document.execCommand("insertText", false, "\n");
        }
      }}
    >
      {ctx.drafts.current[k] ?? value}
    </span>
  );
}

export function Tool({
  onClick,
  children,
  title,
}: {
  onClick: () => void;
  children: ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      className="study-tool"
      onClick={onClick}
      title={title}
    >
      <h2>{children}</h2>
    </button>
  );
}

export function Gutter({
  label,
  canUp,
  canDown,
  onUp,
  onDown,
  onDelete,
  onAdd,
}: {
  label: string;
  canUp: boolean;
  canDown: boolean;
  onUp: () => void;
  onDown: () => void;
  onDelete: () => void;
  onAdd: (kind: (typeof BLOCK_TYPES)[number]) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="study-gutter">
      <h3 className="study-gutter-label">{label}</h3>
      <button
        type="button"
        className="study-gutter-button"
        onClick={onUp}
        disabled={!canUp}
        title={canUp ? "Move up" : "Already first"}
      >
        ↑
      </button>
      <button
        type="button"
        className="study-gutter-button"
        onClick={onDown}
        disabled={!canDown}
        title={canDown ? "Move down" : "Already last"}
      >
        ↓
      </button>
      <button
        type="button"
        className="study-gutter-button"
        onClick={() => setOpen((o) => !o)}
        title="Add a component below"
        aria-expanded={open}
      >
        +
      </button>
      <button
        type="button"
        className="study-gutter-button study-gutter-delete"
        onClick={onDelete}
        title="Delete"
      >
        ✕
      </button>
      {open && (
        <div className="study-gutter-menu">
          <h3>ADD BELOW</h3>
          {BLOCK_TYPES.map((kind) => (
            <button
              key={kind.label}
              type="button"
              className="study-tool"
              onClick={() => {
                onAdd(kind);
                setOpen(false);
              }}
            >
              <h2>{kind.label.toUpperCase()}</h2>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
