import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  gapBetween,
  Slot,
  type Role,
  StudyHero,
  StudySection,
  Statement,
  Kicker,
  Body,
  Bullets,
  FigureRow,
  Video,
  Cards,
  Takeaways,
  StudyEnd,
} from "./Study";

/* A case study is a hero plus a list of sections, each a list of blocks.
   The page renders straight from that structure, so in development an
   edit bar can rewrite it: text in place, blocks and items moved with
   arrows in the gutter, added or removed, and the result saved back to
   the JSON file by the dev server. In any string, `*text*` is accent,
   `**text**` is bold and `_text_` is italic.                              */

/* ─── Content model ─────────────────────────────────────────────────────── */

export interface Hero {
  subtitle: string;
  meta: { label: string; lines: string[] }[];
}
export interface Item {
  id: string;
  text: string;
}
export interface Card {
  id: string;
  title: string;
  lines: Item[];
}
export interface Takeaway {
  id: string;
  title: string;
  body: string;
}
export interface FigureItem {
  id: string;
  asset: string;
  alt: string;
  label: string;
  note: string;
}
export type Block =
  | { id: string; type: "statement"; text: string; small?: boolean }
  | { id: string; type: "body"; text: string }
  | { id: string; type: "kicker"; text: string }
  | { id: string; type: "bullets"; items: Item[] }
  | { id: string; type: "cards"; items: Card[] }
  | { id: string; type: "takeaways"; items: Takeaway[] }
  | { id: string; type: "figures"; frame: boolean; items: FigureItem[] }
  | { id: string; type: "video"; asset: string; caption: string }
  | { id: string; type: "divider" };
export interface Section {
  id: string;
  label?: string;
  blocks: Block[];
}
export interface StudyContent {
  hero: Hero;
  sections: Section[];
  nextId: number;
}

export interface Asset {
  src: string;
  /* For videos: a poster frame. */
  poster?: string;
}

/* What each block type is, for spacing. */
const ROLE: Record<Block["type"], Role> = {
  statement: "header",
  kicker: "eyebrow",
  body: "content",
  bullets: "content",
  cards: "content",
  takeaways: "content",
  figures: "content",
  video: "content",
  divider: "content",
};

const BLOCK_TYPES: { type: Block["type"]; label: string; small?: boolean }[] = [
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

/* ─── Editing state ─────────────────────────────────────────────────────── */

interface Ctx {
  editing: boolean;
  /* Text edits live here until a structural change or save commits them,
     so typing never re-renders the field under the caret.                */
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
  };
}
const EditCtx = createContext<Ctx | null>(null);

/* Inline markup in any string: **bold**, _italic_, *accent*. Line
   breaks in the text are kept.                                           */
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

/* One editable string, addressed by a stable key. */
function Field({ k, value }: { k: string; value: string }) {
  const ctx = useContext(EditCtx)!;
  if (!ctx.editing) return <>{rich(value)}</>;
  return (
    <span
      className="study-editable"
      contentEditable
      suppressContentEditableWarning
      spellCheck
      onInput={(e) => {
        /* innerText keeps line breaks; textContent would drop them. */
        ctx.drafts.current[k] = e.currentTarget.innerText.replace(/\n+$/, "");
      }}
      onKeyDown={(e) => {
        /* Enter inserts a line break inside the field instead of a new
           element, so the text stays one string.                        */
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

/* Small caps buttons for the edit chrome. */
function Tool({
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

/* Gutter controls: arrows, delete, and an add-below menu. */
function Gutter({
  label,
  canUp = true,
  canDown = true,
  onUp,
  onDown,
  onDelete,
  onAdd,
}: {
  label: string;
  canUp?: boolean;
  canDown?: boolean;
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

/* ─── Blocks ────────────────────────────────────────────────────────────── */

function BlockView({
  s,
  b,
  block,
  count,
  gap,
}: {
  s: number;
  b: number;
  block: Block;
  count: number;
  gap: ReturnType<typeof gapBetween>;
}) {
  const ctx = useContext(EditCtx)!;
  const { editing, ops, assets } = ctx;
  const id = block.id;

  let view: ReactNode;
  switch (block.type) {
    case "statement":
      view = (
        <Statement small={block.small}>
          <Field
            k={id}
            value={block.text}
          />
        </Statement>
      );
      break;
    case "body":
      view = (
        <Body>
          <Field
            k={id}
            value={block.text}
          />
        </Body>
      );
      break;
    case "kicker":
      view = (
        <Kicker>
          <Field
            k={id}
            value={block.text}
          />
        </Kicker>
      );
      break;
    case "bullets":
      view = (
        <>
          <Bullets
            items={block.items.map((it, i) => (
              <>
                <Field
                  k={it.id}
                  value={it.text}
                />
                {editing && (
                  <Tool
                    onClick={() => ops.deleteItem(s, b, i)}
                    title="Remove bullet"
                  >
                    ✕
                  </Tool>
                )}
              </>
            ))}
          />
          {editing && <Tool onClick={() => ops.addItem(s, b)}>+ BULLET</Tool>}
        </>
      );
      break;
    case "cards":
      view = (
        <>
          <Cards
            items={block.items.map((card, c) => ({
              title: (
                <>
                  <Field
                    k={`${card.id}.title`}
                    value={card.title}
                  />
                  {editing && (
                    <Tool
                      onClick={() => ops.deleteItem(s, b, c)}
                      title="Remove card"
                    >
                      ✕ CARD
                    </Tool>
                  )}
                </>
              ),
              lines: [
                ...card.lines.map((line, i) => (
                  <>
                    <Field
                      k={line.id}
                      value={line.text}
                    />
                    {editing && (
                      <Tool
                        onClick={() => ops.deleteItem(s, b, i, c)}
                        title="Remove line"
                      >
                        ✕
                      </Tool>
                    )}
                  </>
                )),
                ...(editing
                  ? [<Tool onClick={() => ops.addItem(s, b, c)}>+ LINE</Tool>]
                  : []),
              ],
            }))}
          />
          {editing && <Tool onClick={() => ops.addItem(s, b)}>+ CARD</Tool>}
        </>
      );
      break;
    case "takeaways":
      view = (
        <>
          <Takeaways
            items={block.items.map((t, i) => ({
              title: (
                <>
                  <Field
                    k={`${t.id}.title`}
                    value={t.title}
                  />
                  {editing && (
                    <Tool
                      onClick={() => ops.deleteItem(s, b, i)}
                      title="Remove takeaway"
                    >
                      ✕
                    </Tool>
                  )}
                </>
              ),
              body: (
                <Field
                  k={`${t.id}.body`}
                  value={t.body}
                />
              ),
            }))}
          />
          {editing && <Tool onClick={() => ops.addItem(s, b)}>+ TAKEAWAY</Tool>}
        </>
      );
      break;
    case "figures":
      view = (
        <>
          <FigureRow
            frame={block.frame}
            columns={block.items.length === 2 ? 2 : 3}
            items={block.items.map((f, i) => ({
              src: assets[f.asset]?.src ?? "",
              alt: f.alt,
              label: (
                <>
                  <Field
                    k={`${f.id}.label`}
                    value={f.label}
                  />
                  {editing && (
                    <>
                      {" "}
                      <select
                        className="study-select"
                        value={f.asset}
                        onChange={(e) => ops.setAsset(s, b, i, e.target.value)}
                      >
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
                      <Tool
                        onClick={() => ops.deleteItem(s, b, i)}
                        title="Remove image"
                      >
                        ✕
                      </Tool>
                    </>
                  )}
                </>
              ),
              note: (
                <Field
                  k={`${f.id}.note`}
                  value={f.note}
                />
              ),
            }))}
          />
          {editing && block.items.length < 3 && (
            <Tool onClick={() => ops.addItem(s, b)}>+ IMAGE</Tool>
          )}
        </>
      );
      break;
    case "divider":
      view = <hr className="study-divider" />;
      break;
    case "video": {
      const a = assets[block.asset];
      view = a ? (
        <Video
          src={a.src}
          poster={a.poster ?? ""}
          caption={
            <Field
              k={`${id}.caption`}
              value={block.caption}
            />
          }
        />
      ) : null;
      break;
    }
  }

  return (
    <Slot
      gap={gap}
      chrome={
        editing && (
          <Gutter
            label={block.type.toUpperCase()}
            canUp={b > 0}
            canDown={b < count - 1}
            onUp={() => ops.moveBlock(s, b, -1)}
            onDown={() => ops.moveBlock(s, b, 1)}
            onDelete={() => ops.deleteBlock(s, b)}
            onAdd={(kind) => ops.addBlock(s, b + 1, kind)}
          />
        )
      }
    >
      {view}
    </Slot>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

interface PageProps {
  file: string;
  content: StudyContent;
  assets: Record<string, Asset>;
  logo: string;
  logoDark: string;
  logoAlt: string;
}

export default function StudyPage({
  file,
  content: initial,
  assets,
  logo,
  logoDark,
  logoAlt,
}: PageProps) {
  const [content, setContentState] = useState<StudyContent>(initial);
  /* Latest content for the editing ops, which must not run inside a state
     updater: React may call updaters twice in development, and commit()
     consumes the pending text edits.                                      */
  const contentRef = useRef(initial);
  const setContent = useCallback((c: StudyContent) => {
    contentRef.current = c;
    setContentState(c);
  }, []);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const drafts = useRef<Record<string, string>>({});

  /* Fold pending text edits into a copy of the content. */
  const commit = useCallback((c: StudyContent): StudyContent => {
    const d = drafts.current;
    const t = (k: string, v: string) => (k in d ? d[k] : v);
    const next: StudyContent = {
      ...c,
      hero: {
        subtitle: t("hero.subtitle", c.hero.subtitle),
        meta: c.hero.meta.map((m, i) => ({
          label: m.label,
          lines: m.lines.map((l, j) => t(`hero.meta.${i}.${j}`, l)),
        })),
      },
      sections: c.sections.map((sec) => ({
        ...sec,
        label: sec.label === undefined ? undefined : t(`${sec.id}.label`, sec.label),
        blocks: sec.blocks.map((bl): Block => {
          switch (bl.type) {
            case "statement":
            case "body":
            case "kicker":
              return { ...bl, text: t(bl.id, bl.text) };
            case "bullets":
              return { ...bl, items: bl.items.map((it) => ({ ...it, text: t(it.id, it.text) })) };
            case "cards":
              return {
                ...bl,
                items: bl.items.map((card) => ({
                  ...card,
                  title: t(`${card.id}.title`, card.title),
                  lines: card.lines.map((l) => ({ ...l, text: t(l.id, l.text) })),
                })),
              };
            case "takeaways":
              return {
                ...bl,
                items: bl.items.map((x) => ({
                  ...x,
                  title: t(`${x.id}.title`, x.title),
                  body: t(`${x.id}.body`, x.body),
                })),
              };
            case "figures":
              return {
                ...bl,
                items: bl.items.map((f) => ({
                  ...f,
                  label: t(`${f.id}.label`, f.label),
                  note: t(`${f.id}.note`, f.note),
                })),
              };
            case "video":
              return { ...bl, caption: t(`${bl.id}.caption`, bl.caption) };
            case "divider":
              return bl;
          }
        }),
      })),
    };
    drafts.current = {};
    return next;
  }, []);

  /* Every structural change commits text first, then edits the tree. */
  const update = useCallback(
    (fn: (c: StudyContent) => StudyContent) =>
      setContent(fn(commit(contentRef.current))),
    [commit, setContent],
  );

  const ops = useMemo<Ctx["ops"]>(() => {
    const fresh = (c: StudyContent, count: number) => {
      const ids = Array.from({ length: count }, (_, i) => `n${c.nextId + i}`);
      return { ids, c: { ...c, nextId: c.nextId + count } };
    };
    const swap = <T,>(arr: T[], i: number, j: number) => {
      if (j < 0 || j >= arr.length) return arr;
      const out = arr.slice();
      [out[i], out[j]] = [out[j], out[i]];
      return out;
    };
    const inSection = (
      c: StudyContent,
      s: number,
      fn: (sec: Section) => Section,
    ): StudyContent => ({
      ...c,
      sections: c.sections.map((sec, i) => (i === s ? fn(sec) : sec)),
    });
    const inBlock = (
      c: StudyContent,
      s: number,
      b: number,
      fn: (bl: Block) => Block,
    ) =>
      inSection(c, s, (sec) => ({
        ...sec,
        blocks: sec.blocks.map((bl, i) => (i === b ? fn(bl) : bl)),
      }));

    return {
      deleteSection: (i) =>
        update((c) => ({ ...c, sections: c.sections.filter((_, j) => j !== i) })),
      addSection: (i) =>
        update((c0) => {
          const { ids, c } = fresh(c0, 2);
          const sec: Section = {
            id: ids[0],
            label: "NEW SECTION",
            blocks: [{ id: ids[1], type: "statement", text: "New statement." }],
          };
          const sections = c.sections.slice();
          sections.splice(i, 0, sec);
          return { ...c, sections };
        }),
      moveBlock: (s, b, dir) =>
        update((c) =>
          inSection(c, s, (sec) => ({ ...sec, blocks: swap(sec.blocks, b, b + dir) })),
        ),
      moveSection: (i, dir) =>
        update((c) => ({ ...c, sections: swap(c.sections, i, i + dir) })),
      deleteBlock: (s, b) =>
        update((c) =>
          inSection(c, s, (sec) => ({
            ...sec,
            blocks: sec.blocks.filter((_, i) => i !== b),
          })),
        ),
      addBlock: (s, b, kind) =>
        update((c0) => {
          const { ids, c } = fresh(c0, 8);
          let bl: Block;
          switch (kind.type) {
            case "statement":
              bl = { id: ids[0], type: "statement", text: "New statement.", ...(kind.small ? { small: true } : {}) };
              break;
            case "body":
              bl = { id: ids[0], type: "body", text: "New paragraph." };
              break;
            case "kicker":
              bl = { id: ids[0], type: "kicker", text: "EYEBROW" };
              break;
            case "bullets":
              bl = { id: ids[0], type: "bullets", items: [{ id: ids[1], text: "First point" }] };
              break;
            case "cards":
              bl = {
                id: ids[0],
                type: "cards",
                items: [1, 2, 3].map((n, i) => ({
                  id: ids[1 + i * 2],
                  title: `Card ${n}`,
                  lines: [{ id: ids[2 + i * 2], text: "A point" }],
                })),
              };
              break;
            case "takeaways":
              bl = { id: ids[0], type: "takeaways", items: [{ id: ids[1], title: "Takeaway", body: "What it meant." }] };
              break;
            case "figures": {
              const first = Object.keys(assets).find((a) => !assets[a].poster) ?? "";
              bl = {
                id: ids[0],
                type: "figures",
                frame: true,
                items: [{ id: ids[1], asset: first, alt: "", label: "LABEL", note: "" }],
              };
              break;
            }
            case "video": {
              const vid = Object.keys(assets).find((a) => assets[a].poster) ?? "";
              bl = { id: ids[0], type: "video", asset: vid, caption: "VIDEO" };
              break;
            }
            case "divider":
              bl = { id: ids[0], type: "divider" };
              break;
          }
          return inSection(c, s, (sec) => {
            const blocks = sec.blocks.slice();
            blocks.splice(b, 0, bl);
            return { ...sec, blocks };
          });
        }),
      addItem: (s, b, cIdx) =>
        update((c0) => {
          const { ids, c } = fresh(c0, 2);
          return inBlock(c, s, b, (bl) => {
            switch (bl.type) {
              case "bullets":
                return { ...bl, items: [...bl.items, { id: ids[0], text: "New point" }] };
              case "cards":
                if (cIdx === undefined)
                  return { ...bl, items: [...bl.items, { id: ids[0], title: "Card", lines: [{ id: ids[1], text: "A point" }] }] };
                return {
                  ...bl,
                  items: bl.items.map((card, i) =>
                    i === cIdx ? { ...card, lines: [...card.lines, { id: ids[0], text: "New point" }] } : card,
                  ),
                };
              case "takeaways":
                return { ...bl, items: [...bl.items, { id: ids[0], title: "Takeaway", body: "What it meant." }] };
              case "figures": {
                const first = Object.keys(assets).find((a) => !assets[a].poster) ?? "";
                return { ...bl, items: [...bl.items, { id: ids[0], asset: first, alt: "", label: "LABEL", note: "" }] };
              }
              default:
                return bl;
            }
          });
        }),
      deleteItem: (s, b, i, cIdx) =>
        update((c) =>
          inBlock(c, s, b, (bl) => {
            switch (bl.type) {
              case "cards":
                if (cIdx === undefined) return { ...bl, items: bl.items.filter((_, j) => j !== i) };
                return {
                  ...bl,
                  items: bl.items.map((card, j) =>
                    j === cIdx ? { ...card, lines: card.lines.filter((_, k) => k !== i) } : card,
                  ),
                };
              case "bullets":
              case "takeaways":
              case "figures":
                return { ...bl, items: (bl.items as { id: string }[]).filter((_, j) => j !== i) } as Block;
              default:
                return bl;
            }
          }),
        ),
      setAsset: (s, b, i, asset) =>
        update((c) =>
          inBlock(c, s, b, (bl) =>
            bl.type === "figures"
              ? { ...bl, items: bl.items.map((f, j) => (j === i ? { ...f, asset } : f)) }
              : bl,
          ),
        ),
    };
  }, [assets, update]);

  const save = useCallback(async () => {
    setStatus("saving");
    const next = commit(contentRef.current);
    setContent(next);
    try {
      const res = await fetch(`/__content/${file}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("saved");
      setEditing(false);
    } catch {
      setStatus("error");
    }
  }, [commit, file, setContent]);

  const cancel = useCallback(() => {
    drafts.current = {};
    setContent(initial);
    setEditing(false);
    setStatus("idle");
  }, [initial, setContent]);

  const ctx = useMemo<Ctx>(
    () => ({ editing, drafts, assets, ops }),
    [editing, assets, ops],
  );

  return (
    <EditCtx.Provider value={ctx}>
      <article className={editing ? "study study-editing" : "study"}>
        <StudyHero
          logo={logo}
          logoDark={logoDark}
          logoAlt={logoAlt}
          subtitle={
            <Field
              k="hero.subtitle"
              value={content.hero.subtitle}
            />
          }
          meta={content.hero.meta.map((m, i) => ({
            label: m.label,
            value: m.lines.map((line, j) => (
              <Field
                key={j}
                k={`hero.meta.${i}.${j}`}
                value={line}
              />
            )),
          }))}
        />

        {content.sections.map((sec, s) => (
          <StudySection
            key={sec.id}
            id={sec.id}
            label={
              sec.label === undefined ? undefined : (
                <Field
                  k={`${sec.id}.label`}
                  value={sec.label}
                />
              )
            }
          >
            {editing && (
              <div className="study-section-tools">
                <Gutter
                  label="SECTION"
                  canUp={s > 0}
                  canDown={s < content.sections.length - 1}
                  onUp={() => ops.moveSection(s, -1)}
                  onDown={() => ops.moveSection(s, 1)}
                  onDelete={() => ops.deleteSection(s)}
                  onAdd={(kind) => ops.addBlock(s, 0, kind)}
                />
                <div className="study-tools">
                  <h3>SECTION</h3>
                  <Tool onClick={() => ops.addSection(s + 1)}>+ SECTION BELOW</Tool>
                  {sec.blocks.length === 0 && <h3>EMPTY · USE + TO ADD A COMPONENT</h3>}
                </div>
              </div>
            )}
            {sec.blocks.map((bl, b) => {
              const prev: Role | null =
                b > 0 ? ROLE[sec.blocks[b - 1].type] : sec.label !== undefined ? "label" : null;
              return (
                <BlockView
                  key={bl.id}
                  s={s}
                  b={b}
                  block={bl}
                  count={sec.blocks.length}
                  gap={gapBetween(prev, ROLE[bl.type])}
                />
              );
            })}
          </StudySection>
        ))}

        <StudyEnd />
      </article>


      {import.meta.env.DEV && (
        <div
          className="edit-bar"
          role="toolbar"
          aria-label="Edit page"
        >
          {editing ? (
            <>
              <button
                type="button"
                onClick={save}
                disabled={status === "saving"}
              >
                <h2>{status === "saving" ? "SAVING…" : "SAVE"}</h2>
              </button>
              <button
                type="button"
                onClick={cancel}
              >
                <h2>CANCEL</h2>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setEditing(true);
              }}
            >
              <h2>
                {status === "saved"
                  ? "SAVED ✓ · EDIT PAGE"
                  : status === "error"
                    ? "SAVE FAILED · EDIT PAGE"
                    : "EDIT PAGE"}
              </h2>
            </button>
          )}
        </div>
      )}
    </EditCtx.Provider>
  );
}
