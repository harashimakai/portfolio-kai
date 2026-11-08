import { useContext, useMemo, type ReactNode } from "react";
import { AssetSelect, EditCtx, Field, Gutter, Tool } from "./StudyEditor";
import {
  gapBetween,
  Slot,
  type Gap,
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
  Stats,
  Steps,
  Columns,
  Callout,
  Quotes,
  Decision,
  Options,
  WideImage,
  ImageRow,
  Subheading,
  Prompts,
  AnnotatedImage,
} from "./StudyBlocks";
import StudyNav from "./StudyNav";
import MoreStudies from "./MoreStudies";
import useStudyEditor, { type SaveStatus } from "./useStudyEditor";
import type { Block, Item, StudyDef } from "../../types/caseStudy";

const SPACIOUS = new Set<Block["type"]>(["options", "decision"]);

function gapFor(prev: Block | undefined, cur: Block, hasLabel: boolean) {
  const gap = gapBetween(prev ? roleOf(prev.type) : hasLabel ? "label" : null, roleOf(cur.type));
  return gap === "block" && (SPACIOUS.has(cur.type) || (prev && SPACIOUS.has(prev.type)))
    ? "group"
    : gap;
}

function roleOf(type: Block["type"]): Role {
  if (type === "statement" || type === "subheading") return "header";
  if (type === "kicker") return "eyebrow";
  return "content";
}

function Text<T extends { id: string }>({ of, field }: { of: T; field: keyof T & string }) {
  return (
    <Field
      k={`${of.id}.${field}`}
      value={String(of[field])}
    />
  );
}

const texts = (items: Item[] = []) =>
  items.map((it) => (
    <Text
      key={it.id}
      of={it}
      field="text"
    />
  ));

function BlockView({
  s,
  b,
  block,
  count,
  gap,
  isAside,
}: {
  s: number;
  b: number;
  block: Block;
  count: number;
  gap: Gap;
  isAside: boolean;
}) {
  const { editing, ops, assets } = useContext(EditCtx)!;
  const src = (asset: string) => assets[asset]?.src ?? "";

  const removable = (node: ReactNode, i: number, title: string, card?: number) => (
    <>
      {node}
      {editing && (
        <Tool
          onClick={() => ops.deleteItem(s, b, i, card)}
          title={title}
        >
          ✕
        </Tool>
      )}
    </>
  );
  const adder = (label: string, card?: number) =>
    editing && <Tool onClick={() => ops.addItem(s, b, card)}>+ {label}</Tool>;
  const assetPicker = (asset: string, i = -1) =>
    editing && (
      <>
        {" "}
        <AssetSelect
          value={asset}
          onChange={(a) => ops.setAsset(s, b, i, a)}
        />
      </>
    );

  const mediaPicker = (field: "logo" | "image", value?: string, item?: number) =>
    editing && (
      <>
        {" "}
        <h3>{field.toUpperCase()}</h3>
        <AssetSelect
          optional
          value={value ?? ""}
          onChange={(a) => ops.setMedia(s, b, field, a || undefined, item)}
        />
      </>
    );

  let view: ReactNode;
  switch (block.type) {
    case "statement":
      view = (
        <Statement small={block.small}>
          <Text
            of={block}
            field="text"
          />
        </Statement>
      );
      break;
    case "body":
      view = (
        <Body>
          <Text
            of={block}
            field="text"
          />
        </Body>
      );
      break;
    case "subheading":
      view = (
        <Subheading logo={block.logo ? src(block.logo) : undefined}>
          <Text
            of={block}
            field="text"
          />
          {mediaPicker("logo", block.logo)}
        </Subheading>
      );
      break;
    case "kicker":
      view = (
        <Kicker>
          <Text
            of={block}
            field="text"
          />
        </Kicker>
      );
      break;
    case "bullets":
      view = (
        <>
          <Bullets items={texts(block.items).map((t, i) => removable(t, i, "Remove bullet"))} />
          {adder("BULLET")}
        </>
      );
      break;
    case "cards":
      view = (
        <>
          <Cards
            items={block.items.map((card, c) => ({
              logo: card.logo ? src(card.logo) : undefined,
              image: card.image ? src(card.image) : undefined,
              title: removable(
                <>
                  <Text
                    of={card}
                    field="title"
                  />
                  {mediaPicker("image", card.image, c)}
                  {mediaPicker("logo", card.logo, c)}
                </>,
                c,
                "Remove card",
              ),
              lines: [
                ...texts(card.lines).map((t, i) => removable(t, i, "Remove line", c)),
                ...(editing ? [adder("LINE", c)] : []),
              ],
            }))}
          />
          {adder("CARD")}
        </>
      );
      break;
    case "takeaways":
      view = (
        <>
          <Takeaways
            items={block.items.map((t, i) => ({
              title: removable(
                <Text
                  of={t}
                  field="title"
                />,
                i,
                "Remove takeaway",
              ),
              body: (
                <Text
                  of={t}
                  field="body"
                />
              ),
            }))}
          />
          {adder("TAKEAWAY")}
        </>
      );
      break;
    case "figures":
      view = (
        <>
          <FigureRow
            sequence={Boolean(block.sequence)}
            items={block.items.map((f, i) => ({
              src: src(f.asset),
              alt: f.alt,
              label: removable(
                <>
                  <Text
                    of={f}
                    field="label"
                  />
                  {assetPicker(f.asset, i)}
                </>,
                i,
                "Remove image",
              ),
              pros: texts(f.pros),
              cons: texts(f.cons),
            }))}
          />
          {editing && (
            <div className="study-tools">
              <Tool
                onClick={() => ops.togglePoints(s, b)}
                title="Show pros and cons under each image"
              >
                {block.items.some((f) => f.pros || f.cons) ? "✓ PROS/CONS" : "+ PROS/CONS"}
              </Tool>
              {block.items.length < 3 && adder("IMAGE")}
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
    case "stats":
      view = (
        <>
          <Stats
            items={block.items.map((st, i) => ({
              value: removable(
                <Text
                  of={st}
                  field="value"
                />,
                i,
                "Remove stat",
              ),
              label: (
                <Text
                  of={st}
                  field="label"
                />
              ),
            }))}
          />
          {adder("STAT")}
        </>
      );
      break;
    case "steps":
      view = (
        <>
          <Steps
            items={block.items.map((st, i) => ({
              title: removable(
                <Text
                  of={st}
                  field="title"
                />,
                i,
                "Remove step",
              ),
              body: (
                <Text
                  of={st}
                  field="body"
                />
              ),
            }))}
          />
          {adder("STEP")}
        </>
      );
      break;
    case "columns":
      view = (
        <>
          <Columns
            items={block.items.map((it, i) => ({
              title: removable(
                <Text
                  of={it}
                  field="title"
                />,
                i,
                "Remove column",
              ),
              body: it.body !== undefined && (
                <Text
                  of={it}
                  field="body"
                />
              ),
              lines: it.lines && texts(it.lines),
            }))}
          />
          {block.items.length < 3 && adder("COLUMN")}
        </>
      );
      break;
    case "callout":
      view = (
        <Callout
          label={
            <Text
              of={block}
              field="label"
            />
          }
          text={
            <Text
              of={block}
              field="text"
            />
          }
        />
      );
      break;
    case "quotes":
      view = (
        <>
          <Quotes items={texts(block.items).map((t, i) => removable(t, i, "Remove quote"))} />
          {adder("QUOTE")}
        </>
      );
      break;
    case "decision":
      view = (
        <Decision
          title={
            <Text
              of={block}
              field="title"
            />
          }
          problem={
            <Text
              of={block}
              field="problem"
            />
          }
          solution={
            <Text
              of={block}
              field="solution"
            />
          }
          src={src(block.asset)}
          tools={assetPicker(block.asset)}
        />
      );
      break;
    case "options":
      view = (
        <>
          <Options
            items={block.items.map((o, i) => ({
              src: src(o.asset),
              chosen: Boolean(o.chosen),
              title: removable(
                <>
                  <Text
                    of={o}
                    field="title"
                  />
                  {assetPicker(o.asset, i)}
                  {editing && (
                    <Tool
                      onClick={() => ops.toggleChosen(s, b, i)}
                      title="Mark as the chosen option"
                    >
                      {o.chosen ? "✓ FINAL" : "+ FINAL"}
                    </Tool>
                  )}
                </>,
                i,
                "Remove option",
              ),
              pros: texts(o.pros),
              cons: texts(o.cons),
            }))}
          />
          {adder("OPTION")}
        </>
      );
      break;
    case "image":
      view = (
        <WideImage
          src={src(block.asset)}
          alt={block.alt}
          caption={
            <>
              <Text
                of={block}
                field="caption"
              />
              {assetPicker(block.asset)}
            </>
          }
        />
      );
      break;
    case "images":
      view = (
        <>
          <ImageRow
            items={block.items.map((im, i) => ({
              src: src(im.asset),
              alt: im.alt,
              caption: removable(
                <>
                  <Text
                    of={im}
                    field="caption"
                  />
                  {assetPicker(im.asset, i)}
                </>,
                i,
                "Remove image",
              ),
            }))}
          />
          {block.items.length < 3 && adder("IMAGE")}
        </>
      );
      break;
    case "prompts":
      view = (
        <>
          <Prompts
            label={
              <Text
                of={block}
                field="label"
              />
            }
            prompts={block.items.map((it) => it.text)}
          />
          {editing && (
            <Bullets items={texts(block.items).map((t, i) => removable(t, i, "Remove prompt"))} />
          )}
          {adder("PROMPT")}
        </>
      );
      break;
    case "annotated":
      view = (
        <>
          <AnnotatedImage
            src={src(block.asset)}
            alt={block.alt}
            cards={block.items.map((card, c) => ({
              title: removable(
                <Text
                  of={card}
                  field="title"
                />,
                c,
                "Remove card",
              ),
              lines: texts(card.lines),
            }))}
          />
          {adder("CARD")}
        </>
      );
      break;
    case "video": {
      const asset = assets[block.asset];
      view = asset && (
        <Video
          src={asset.src}
          poster={asset.poster ?? ""}
          caption={
            <Text
              of={block}
              field="caption"
            />
          }
        />
      );
      break;
    }
  }

  return (
    <Slot
      gap={gap}
      tools={
        editing && (
          <Gutter
            label={block.type.toUpperCase()}
            canUp={b > 0}
            canDown={b < count - 1}
            onUp={() => ops.moveBlock(s, b, -1)}
            onDown={() => ops.moveBlock(s, b, 1)}
            onDelete={() => ops.deleteBlock(s, b)}
            onAdd={(kind) => ops.addBlock(s, b + 1, kind)}
            aside={{ active: isAside, onToggle: () => ops.toggleAside(s, b) }}
          />
        )
      }
    >
      {view}
    </Slot>
  );
}

function statusLabel(status: SaveStatus) {
  if (status === "saved") return "SAVED ✓ · EDIT PAGE";
  if (status === "error") return "SAVE FAILED · EDIT PAGE";
  return "EDIT PAGE";
}

export default function StudyPage({ study }: { study: StudyDef }) {
  const { slug, assets } = study;
  const editor = useStudyEditor(slug, study.content, assets);
  const { content, editing, status, drafts, ops } = editor;
  const heroVideo = content.hero.video ? assets[content.hero.video] : undefined;

  const ctx = useMemo(() => ({ editing, drafts, assets, ops }), [editing, drafts, assets, ops]);
  const navSections = useMemo(
    () =>
      content.sections.flatMap((sec) => (sec.label ? [{ id: sec.id, label: sec.label }] : [])),
    [content.sections],
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
          video={heroVideo ? { src: heroVideo.src, poster: heroVideo.poster ?? "" } : null}
          meta={content.hero.meta.map((m, i) => ({
            label: m.label,
            lines: m.lines.map((line, j) => (
              <Field
                key={j}
                k={`hero.meta.${i}.${j}`}
                value={line}
              />
            )),
          }))}
        />

        <StudyNav sections={navSections} />

        {content.sections.map((sec, s) => {
          const asideAt = sec.aside ? sec.blocks.findIndex((bl) => bl.id === sec.aside) : -1;
          const view = (bl: Block, b: number) => (
            <BlockView
              key={bl.id}
              s={s}
              b={b}
              block={bl}
              count={sec.blocks.length}
              gap={b === asideAt ? "none" : gapFor(sec.blocks[b - 1], bl, Boolean(sec.label))}
              isAside={b === asideAt}
            />
          );
          const asideBlock = asideAt >= 0 ? sec.blocks[asideAt] : undefined;
          return (
            <StudySection
              key={sec.id}
              id={sec.id}
              label={
                sec.label !== undefined && (
                  <Text
                    of={sec}
                    field="label"
                  />
                )
              }
              aside={asideBlock && view(asideBlock, asideAt)}
              narrow={asideBlock?.type === "prompts" || asideBlock?.type === "callout"}
              below={asideBlock && sec.blocks.slice(asideAt + 1).map((bl, i) => view(bl, asideAt + 1 + i))}
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
              {(asideBlock ? sec.blocks.slice(0, asideAt) : sec.blocks).map((bl, b) => view(bl, b))}
            </StudySection>
          );
        })}
      </article>

      <MoreStudies
        current={slug}
        preview={slug === "template"}
      />

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
                onClick={editor.save}
                disabled={status === "saving"}
              >
                <h2>{status === "saving" ? "SAVING…" : "SAVE"}</h2>
              </button>
              <button
                type="button"
                onClick={editor.cancel}
              >
                <h2>CANCEL</h2>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={editor.start}
            >
              <h2>{statusLabel(status)}</h2>
            </button>
          )}
        </div>
      )}
    </EditCtx.Provider>
  );
}
