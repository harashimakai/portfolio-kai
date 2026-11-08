import { createContext, useContext, useState, type MutableRefObject, type ReactNode } from "react";
import { rich } from "../../lib/richText";
import type { Asset, Block } from "../../types/caseStudy";

const BLOCK_TYPES: { type: Block["type"]; label: string; small?: boolean }[] = [
  { type: "statement", label: "Statement" },
  { type: "statement", label: "Small statement", small: true },
  { type: "kicker", label: "Eyebrow" },
  { type: "subheading", label: "Subheading" },
  { type: "body", label: "Paragraph" },
  { type: "bullets", label: "Bullets" },
  { type: "cards", label: "3 cards" },
  { type: "takeaways", label: "Takeaways" },
  { type: "figures", label: "Images" },
  { type: "video", label: "Video" },
  { type: "image", label: "Wide image" },
  { type: "images", label: "Image row" },
  { type: "annotated", label: "Image with notes" },
  { type: "prompts", label: "Typed prompts" },
  { type: "stats", label: "Stats" },
  { type: "steps", label: "Process steps" },
  { type: "columns", label: "Labeled columns" },
  { type: "callout", label: "Callout" },
  { type: "quotes", label: "User quotes" },
  { type: "decision", label: "Design decision" },
  { type: "options", label: "Options compared" },
  { type: "divider", label: "Divider" },
];

export type BlockKind = (typeof BLOCK_TYPES)[number];

export interface EditorOps {
  addSection(i: number): void;
  deleteSection(i: number): void;
  moveSection(i: number, dir: -1 | 1): void;
  addBlock(s: number, b: number, kind: BlockKind): void;
  deleteBlock(s: number, b: number): void;
  moveBlock(s: number, b: number, dir: -1 | 1): void;
  addItem(s: number, b: number, card?: number): void;
  deleteItem(s: number, b: number, i: number, card?: number): void;
  setAsset(s: number, b: number, i: number, asset: string): void;
  togglePoints(s: number, b: number): void;
  toggleSequence(s: number, b: number): void;
  toggleChosen(s: number, b: number, i: number): void;
  toggleAside(s: number, b: number): void;
  setMedia(s: number, b: number, field: "logo" | "image", asset?: string, item?: number): void;
}

interface EditorContext {
  editing: boolean;
  drafts: MutableRefObject<Record<string, string>>;
  assets: Record<string, Asset>;
  ops: EditorOps;
}

export const EditCtx = createContext<EditorContext | null>(null);

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
  aside,
}: {
  label: string;
  canUp: boolean;
  canDown: boolean;
  onUp: () => void;
  onDown: () => void;
  onDelete: () => void;
  onAdd: (kind: BlockKind) => void;
  aside?: { active: boolean; onToggle: () => void };
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
      {aside && (
        <button
          type="button"
          className="study-gutter-button"
          onClick={aside.onToggle}
          title={aside.active ? "Move out of the side column" : "Show in the side column"}
          aria-pressed={aside.active}
        >
          ⇥
        </button>
      )}
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

export function AssetSelect({
  value,
  onChange,
  optional = false,
}: {
  value: string;
  onChange: (asset: string) => void;
  optional?: boolean;
}) {
  const { assets } = useContext(EditCtx)!;
  return (
    <select
      className="study-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {optional && <option value="">none</option>}
      {Object.keys(assets)
        .filter((a) => !assets[a].poster)
        .map((a) => (
          <option
            key={a}
            value={a}
          >
            {a}
          </option>
        ))}
    </select>
  );
}
