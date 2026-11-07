import {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  EditCtx,
  Field,
  Gutter,
  Tool,
  type Ctx,
} from "./StudyEditor";
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
} from "./StudyBlocks";
import type {
  Block,
  Section,
  StudyContent,
  StudyDef,
} from "../../types/caseStudy";

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
            sequence={Boolean(block.sequence)}
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
          {editing && (
            <div className="study-tools">
              {block.items.length < 3 && (
                <Tool onClick={() => ops.addItem(s, b)}>+ IMAGE</Tool>
              )}
              <Tool
                onClick={() => ops.toggleSequence(s, b)}
                title="Show arrows between the images"
              >
                {block.sequence ? "✓ ARROWS" : "+ ARROWS"}
              </Tool>
            </div>
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

interface PageProps {
  study: StudyDef;
}

export default function StudyPage({ study }: PageProps) {
  const { slug: file, content: initial, assets } = study;
  const [content, setContentState] = useState<StudyContent>(initial);
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
      toggleSequence: (s, b) =>
        update((c) =>
          inBlock(c, s, b, (bl) => {
            if (bl.type !== "figures") return bl;
            const { sequence, ...rest } = bl;
            return sequence ? rest : { ...rest, sequence: true };
          }),
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
      <article className={editing ? "study is-editing" : "study"}>
        <StudyHero
          logoSvg={study.logoSvg}
          logoAlt={study.title}
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

      </article>

      {import.meta.env.DEV && (
        <div
          className="dev-bar"
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
