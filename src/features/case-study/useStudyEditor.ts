import { useCallback, useMemo, useRef, useState } from "react";
import type { BlockKind, EditorOps } from "./StudyEditor";
import type { Asset, Block, Section, StudyContent } from "../../types/caseStudy";

type Drafts = Record<string, string>;
type NewId = () => string;
type ListBlock = Extract<Block, { items: unknown[] }>;
type ListType = ListBlock["type"];

export type SaveStatus = "idle" | "saving" | "saved" | "error";

function applyDrafts<T>(value: T, drafts: Drafts): T {
  if (Array.isArray(value)) return value.map((v) => applyDrafts(v, drafts)) as T;
  if (!value || typeof value !== "object") return value;
  const obj = value as Record<string, unknown>;
  return Object.fromEntries(
    Object.entries(obj).map(([key, v]) => {
      const draft = `${obj.id}.${key}`;
      return [key, typeof v === "string" && draft in drafts ? drafts[draft] : applyDrafts(v, drafts)];
    }),
  ) as T;
}

const NEW_ITEM: Record<ListType, (id: NewId, image: string) => ListBlock["items"][number]> = {
  bullets: (id) => ({ id: id(), text: "New point" }),
  cards: (id) => ({ id: id(), title: "Card", lines: [{ id: id(), text: "A point" }] }),
  takeaways: (id) => ({ id: id(), title: "Takeaway", body: "What it meant." }),
  figures: (id, image) => ({ id: id(), asset: image, alt: "", label: "LABEL" }),
  stats: (id) => ({ id: id(), value: "0", label: "What it counts" }),
  columns: (id) => ({ id: id(), title: "LABEL", body: "What goes in this column." }),
  steps: (id) => ({ id: id(), title: "Step", body: "What happened in this step." }),
  quotes: (id) => ({ id: id(), text: "What a user said, in their words." }),
  prompts: (id) => ({ id: id(), text: "An example prompt" }),
  annotated: (id) => ({ id: id(), title: "Note", lines: [{ id: id(), text: "What this part of the image shows." }] }),
  images: (id, image) => ({ id: id(), asset: image, alt: "", caption: "CAPTION" }),
  options: (id, image) => ({
    id: id(),
    asset: image,
    title: "Option",
    pros: [{ id: id(), text: "A strength" }],
    cons: [{ id: id(), text: "A drawback" }],
  }),
};

const NEW_ITEM_COUNT: Partial<Record<ListType, number>> = { cards: 3, stats: 3, steps: 3, options: 2, images: 2, prompts: 2, annotated: 3, columns: 2 };

function isListType(type: Block["type"]): type is ListType {
  return type in NEW_ITEM;
}

function isList(bl: Block): bl is ListBlock {
  return isListType(bl.type);
}

function newBlock(kind: BlockKind, id: NewId, image: string, video: string): Block {
  return { ...createBlock(kind.type, id, image, video), ...kind.preset } as Block;
}

function createBlock(type: Block["type"], id: NewId, image: string, video: string): Block {
  if (isListType(type)) {
    const items = Array.from({ length: NEW_ITEM_COUNT[type] ?? 1 }, () => NEW_ITEM[type](id, image));
    if (type === "options") Object.assign(items[items.length - 1], { chosen: true });
    const extra =
      type === "prompts"
        ? { label: "TRY ASKING" }
        : type === "annotated"
          ? { asset: image, alt: "" }
          : {};
    return { id: id(), type, items, ...extra } as Block;
  }
  switch (type) {
    case "statement":
      return { id: id(), type, text: "New statement." };
    case "body":
      return { id: id(), type, text: "New paragraph." };
    case "kicker":
      return { id: id(), type, text: "EYEBROW" };
    case "subheading":
      return { id: id(), type, text: "Subheading" };
    case "callout":
      return { id: id(), type, label: "HOW MIGHT WE", text: "How might we…?" };

    case "decision":
      return {
        id: id(),
        type,
        title: "The decision in one line",
        problem: "What wasn't working.",
        solution: "What changed, and why.",
        asset: image,
      };
    case "image":
      return { id: id(), type, asset: image, alt: "", caption: "CAPTION" };
    case "video":
      return { id: id(), type, asset: video, caption: "VIDEO" };
    case "divider":
      return { id: id(), type };
  }
}

function withIds(c: StudyContent, fn: (id: NewId) => StudyContent): StudyContent {
  let next = c.nextId;
  const out = fn(() => `n${next++}`);
  return { ...out, nextId: next };
}

function swap<T>(arr: T[], i: number, j: number) {
  if (j < 0 || j >= arr.length) return arr;
  const out = arr.slice();
  [out[i], out[j]] = [out[j], out[i]];
  return out;
}

function insert<T>(arr: T[], i: number, item: T) {
  const out = arr.slice();
  out.splice(i, 0, item);
  return out;
}

function inSection(c: StudyContent, s: number, fn: (sec: Section) => Section): StudyContent {
  return { ...c, sections: c.sections.map((sec, i) => (i === s ? fn(sec) : sec)) };
}

function inBlock(c: StudyContent, s: number, b: number, fn: (bl: Block) => Block) {
  return inSection(c, s, (sec) => ({
    ...sec,
    blocks: sec.blocks.map((bl, i) => (i === b ? fn(bl) : bl)),
  }));
}

export default function useStudyEditor(
  slug: string,
  initial: StudyContent,
  assets: Record<string, Asset>,
) {
  const [content, setContentState] = useState(initial);
  const contentRef = useRef(initial);
  const drafts = useRef<Drafts>({});
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<SaveStatus>("idle");

  const setContent = useCallback((c: StudyContent) => {
    contentRef.current = c;
    setContentState(c);
  }, []);

  const commit = useCallback((c: StudyContent): StudyContent => {
    const d = drafts.current;
    drafts.current = {};
    return {
      ...c,
      hero: {
        ...c.hero,
        subtitle: d["hero.subtitle"] ?? c.hero.subtitle,
        meta: c.hero.meta.map((m, i) => ({
          ...m,
          lines: m.lines.map((l, j) => d[`hero.meta.${i}.${j}`] ?? l),
        })),
      },
      sections: applyDrafts(c.sections, d),
    };
  }, []);

  const update = useCallback(
    (fn: (c: StudyContent) => StudyContent) => setContent(fn(commit(contentRef.current))),
    [commit, setContent],
  );

  const ops = useMemo<EditorOps>(() => {
    const keys = Object.keys(assets);
    const image = keys.find((a) => !assets[a].poster) ?? "";
    const video = keys.find((a) => assets[a].poster) ?? "";

    return {
      addSection: (i) =>
        update((c) =>
          withIds(c, (id) => ({
            ...c,
            sections: insert(c.sections, i, {
              id: id(),
              label: "NEW SECTION",
              blocks: [newBlock({ type: "statement", label: "" }, id, image, video)],
            }),
          })),
        ),
      deleteSection: (i) =>
        update((c) => ({ ...c, sections: c.sections.filter((_, j) => j !== i) })),
      moveSection: (i, dir) => update((c) => ({ ...c, sections: swap(c.sections, i, i + dir) })),
      addBlock: (s, b, kind) =>
        update((c) =>
          withIds(c, (id) =>
            inSection(c, s, (sec) => ({
              ...sec,
              blocks: insert(sec.blocks, b, newBlock(kind, id, image, video)),
            })),
          ),
        ),
      deleteBlock: (s, b) =>
        update((c) =>
          inSection(c, s, (sec) => ({ ...sec, blocks: sec.blocks.filter((_, i) => i !== b) })),
        ),
      moveBlock: (s, b, dir) =>
        update((c) => inSection(c, s, (sec) => ({ ...sec, blocks: swap(sec.blocks, b, b + dir) }))),
      addItem: (s, b, card) =>
        update((c) =>
          withIds(c, (id) =>
            inBlock(c, s, b, (bl) => {
              if (bl.type === "cards" && card !== undefined)
                return {
                  ...bl,
                  items: bl.items.map((it, i) =>
                    i === card ? { ...it, lines: [...it.lines, { id: id(), text: "New point" }] } : it,
                  ),
                };
              if (!isList(bl)) return bl;
              return { ...bl, items: [...bl.items, NEW_ITEM[bl.type](id, image)] } as Block;
            }),
          ),
        ),
      deleteItem: (s, b, i, card) =>
        update((c) =>
          inBlock(c, s, b, (bl) => {
            if (bl.type === "cards" && card !== undefined)
              return {
                ...bl,
                items: bl.items.map((it, j) =>
                  j === card ? { ...it, lines: it.lines.filter((_, k) => k !== i) } : it,
                ),
              };
            if (!isList(bl)) return bl;
            return { ...bl, items: (bl.items as unknown[]).filter((_, j) => j !== i) } as Block;
          }),
        ),
      setAsset: (s, b, i, asset) =>
        update((c) =>
          inBlock(c, s, b, (bl) => {
            if (bl.type === "figures" || bl.type === "options" || bl.type === "images")
              return { ...bl, items: bl.items.map((f, j) => (j === i ? { ...f, asset } : f)) } as Block;
            if (bl.type === "decision" || bl.type === "image" || bl.type === "annotated") return { ...bl, asset };
            return bl;
          }),
        ),
      togglePoints: (s, b) =>
        update((c) =>
          withIds(c, (id) =>
            inBlock(c, s, b, (bl) => {
              if (bl.type !== "figures") return bl;
              const on = bl.items.some((f) => f.pros || f.cons);
              return {
                ...bl,
                items: bl.items.map(({ pros, cons, ...f }) =>
                  on
                    ? f
                    : {
                        ...f,
                        pros: [{ id: id(), text: "What worked" }],
                        cons: [{ id: id(), text: "What didn't" }],
                      },
                ),
              };
            }),
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
      toggleAside: (s, b) =>
        update((c) =>
          inSection(c, s, ({ aside, ...sec }) => {
            const id = sec.blocks[b].id;
            return aside === id ? sec : { ...sec, aside: id };
          }),
        ),
      setMedia: (s, b, field, asset, item) =>
        update((c) =>
          inBlock(c, s, b, (bl) => {
            const apply = <T extends object>(target: T): T => {
              const { [field]: _, ...rest } = target as Record<string, unknown>;
              return (asset ? { ...rest, [field]: asset } : rest) as T;
            };
            if (bl.type === "cards" && item !== undefined)
              return { ...bl, items: bl.items.map((it, j) => (j === item ? apply(it) : it)) };
            if (bl.type === "subheading" && field === "logo") return apply(bl);
            return bl;
          }),
        ),
      toggleChosen: (s, b, i) =>
        update((c) =>
          inBlock(c, s, b, (bl) => {
            if (bl.type !== "options") return bl;
            return {
              ...bl,
              items: bl.items.map(({ chosen, ...o }, j) =>
                j === i && !chosen ? { ...o, chosen: true } : o,
              ),
            };
          }),
        ),
    };
  }, [assets, update]);

  const start = useCallback(() => {
    setStatus("idle");
    setEditing(true);
  }, []);

  const save = useCallback(async () => {
    setStatus("saving");
    const next = commit(contentRef.current);
    setContent(next);
    try {
      const res = await fetch(`/__content/${slug}`, {
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
  }, [commit, slug, setContent]);

  const cancel = useCallback(() => {
    drafts.current = {};
    setContent(initial);
    setEditing(false);
    setStatus("idle");
  }, [initial, setContent]);

  return { content, editing, status, drafts, ops, start, save, cancel };
}
