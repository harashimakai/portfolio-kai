import { useEffect, useRef } from "react";

const ENABLED = true;
const STYLE: "star" | "pointer" = "pointer";
const POINTER = STYLE === "pointer";

const ARROW_PATH = "M0.0 0.0 L0.0 12.96 L3.28 9.92 L5.52 15.12 L7.68 14.16 L5.52 9.2 L9.76 9.2Z";

const EMAIL = 'a[href^="mailto:"]';
const IMAGE =
  "img, video, .art-tile-image, .card-image, .study-figure, .lightbox-figure";

const CLICKABLE =
  'a, button, [role="button"], select, label, summary, input[type="checkbox"], input[type="radio"]';

type Shape = { w: number; h: number; kind: "star" | "bar" | "small" | "gone" };

const SQUARE: Shape = { w: 14, h: 14, kind: "star" };
const SMALL: Shape = { w: 8, h: 8, kind: "small" };
const CARET: Shape = { w: 3, h: 20, kind: "bar" };
const GONE: Shape = { w: 14, h: 14, kind: "gone" };

function containsStar(el: Element, x: number, y: number): boolean {
  const r = R;
  return [
    [x - r, y],
    [x + r, y],
    [x, y - r],
    [x, y + r],
  ].every(([px, py]) => el.contains(document.elementFromPoint(px, py)));
}

function overText(x: number, y: number, target: Element | null): boolean {
  type Caret = { offsetNode: Node; offset: number };
  const doc = document as Document & {
    caretPositionFromPoint?: (x: number, y: number) => Caret | null;
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
  };
  let node: Node | null = null;
  let offset = 0;
  if (doc.caretPositionFromPoint) {
    const p = doc.caretPositionFromPoint(x, y);
    if (p) {
      node = p.offsetNode;
      offset = p.offset;
    }
  } else if (doc.caretRangeFromPoint) {
    const r = doc.caretRangeFromPoint(x, y);
    if (r) {
      node = r.startContainer;
      offset = r.startOffset;
    }
  }
  if (!node || node.nodeType !== Node.TEXT_NODE) return false;
  const owner = node.parentElement;
  if (!owner || !target || !target.contains(owner)) return false;
  if (owner.closest(`${CLICKABLE}, [data-cursor]`)) return false;
  const text = node.textContent ?? "";
  if (!text.trim()) return false;
  const range = document.createRange();
  for (const i of [offset - 1, offset]) {
    if (i < 0 || i >= text.length) continue;
    range.setStart(node, i);
    range.setEnd(node, i + 1);
    for (const rect of range.getClientRects()) {
      if (
        x >= rect.left - 1 &&
        x <= rect.right + 1 &&
        y >= rect.top &&
        y <= rect.bottom
      )
        return true;
    }
  }
  return false;
}

const R = 9;
const K = 3.5;
const SPREAD = 20;
const BAR_W = 3,
  BAR_H = 11;
const CUT = 0.55;
const DEG = Math.PI / 180;
const CORNER_A = Math.atan2(BAR_W, BAR_H) / DEG;
const CORNER_R = Math.hypot(BAR_W, BAR_H);
const TURN = 45;
const TIPS: [number, number][] = [
  [0, CORNER_A - TURN],
  [90, 180 - CORNER_A - 90 - TURN],
  [180, 180 + CORNER_A - 180 - TURN],
  [270, 360 - CORNER_A - 270 - TURN],
];

type Pt = [number, number];
const at = (a: number, r: number): Pt => [r * Math.sin(a * DEG), -r * Math.cos(a * DEG)];
const turn = ([x, y]: Pt, a: number): Pt => {
  const c = Math.cos(a * DEG),
    s = Math.sin(a * DEG);
  return [x * c - y * s, x * s + y * c];
};
const pt = ([x, y]: Pt) => `${x.toFixed(3)} ${y.toFixed(3)}`;

const lerp = ([ax, ay]: Pt, [bx, by]: Pt, t: number): Pt => [
  ax + (bx - ax) * t,
  ay + (by - ay) * t,
];

const STEM = 1.1;
const FLARE = 2.2;
const FLAT = 0.5;
const NECK = BAR_H - FLARE;

function starSide(i: number): Pt[] {
  const [lx, ly] = at(90 * i, R),
    [ex, ey] = at(90 * (i + 1), R);
  const [ox, oy] = turn([CUT, 0], 90 * i),
    [nx, ny] = turn([CUT, 0], 90 * (i + 1));
  const p0: Pt = [lx + ox, ly + oy],
    p3: Pt = [ex - nx, ey - ny];
  const c1 = at(45 + 90 * i - SPREAD, K),
    c2 = at(45 + 90 * i + SPREAD, K);
  const a = lerp(p0, c1, 0.5),
    b = lerp(c1, c2, 0.5),
    c = lerp(c2, p3, 0.5);
  const d = lerp(a, b, 0.5),
    e = lerp(b, c, 0.5);
  const m = lerp(d, e, 0.5);
  return [a, d, m, m, e, c];
}

const R_SIDE: Pt[] = (() => {
  const corner: Pt = [BAR_W, -BAR_H + FLAT],
    neck: Pt = [STEM, -NECK],
    inside: Pt = [STEM, -BAR_H + FLAT];
  const flip = ([x, y]: Pt): Pt => [x, -y];
  const tip = lerp(corner, inside, 0.55);
  return [
    tip,
    lerp(neck, inside, 0.55),
    neck,
    flip(neck),
    flip(lerp(neck, inside, 0.55)),
    flip(tip),
  ];
})();
const B_SIDE: Pt[] = [
  [BAR_W * (2 / 3), BAR_H],
  [BAR_W / 3, BAR_H],
  [0, BAR_H],
  [0, BAR_H],
  [-BAR_W / 3, BAR_H],
  [-BAR_W * (2 / 3), BAR_H],
];
const barSide = (i: number): Pt[] =>
  (i % 2 ? B_SIDE : R_SIDE).map((p) => turn(p, (i >> 1) * 180 - TURN));

const SIDES: [Pt[], Pt[]][] = [0, 1, 2, 3].map((i) => [starSide(i), barSide(i)]);
const FLATS: [Pt, Pt][] = (
  [
    [[0, 0], [0, FLAT]],
    [[0, -FLAT], [0, 0]],
    [[0, 0], [0, -FLAT]],
    [[0, FLAT], [0, 0]],
  ] as [Pt, Pt][]
).map(([a, b]) => [turn(a, -TURN), turn(b, -TURN)]);

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

function shapePath(rotation: number, open: number): string {
  const k = open ** 3;
  const cut = CUT * (1 - open);
  const tips = TIPS.map(([a, swing], i) => {
    const t = a + rotation + swing * open;
    const [x, y] = at(t, R + (CORNER_R - R) * open);
    const [dx, dy] = [cut * Math.cos(t * DEG), cut * Math.sin(t * DEG)];
    const [[bx, by], [ax, ay]] = FLATS[i].map((f) => turn([f[0] * k, f[1] * k], rotation));
    return [pt([x - dx + bx, y - dy + by]), pt([x + dx + ax, y + dy + ay])];
  });
  const sides = SIDES.map(([star, bar]) =>
    star.map((p, j) => pt(turn(lerp(p, bar[j], k), rotation))),
  );
  let d = `M${tips[0][0]} L${tips[0][1]}`;
  for (let i = 0; i < 4; i++) {
    const [c1, c2, m1, m2, c3, c4] = sides[i];
    const next = tips[(i + 1) % 4];
    d += ` C${c1} ${c2} ${m1} L${m2} C${c3} ${c4} ${next[0]}`;
    if (i < 3) d += ` L${next[1]}`;
  }
  return d + "Z";
}

const MORPH_MS = 180;

function textSpan(text: string): HTMLSpanElement {
  const span = document.createElement("span");
  span.className = "cursor-label-text";
  span.textContent = text;
  return span;
}

export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ENABLED) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || calm.matches) return;

    const root = ref.current!;
    const body = bodyRef.current!;
    const el = dotRef.current!;
    const label = labelRef.current!;
    const path = pathRef.current;
    label.removeAttribute("style");
    label.className = "cursor-label";
    label.replaceChildren();
    label.hidden = true;
    document.documentElement.classList.add("has-cursor");

    let rotation = 0,
      open = 0,
      rotFrom = 0,
      rotTo = 0,
      openFrom = 0,
      openTo = 0,
      animStart = 0,
      animating = false;
    path?.setAttribute("d", shapePath(0, 0));
    let labelText = "";
    const swapLabel = (text: string) => {
      label.classList.remove("is-entering");
      label.replaceChildren(textSpan(text));
    };
    let lastTarget: Element | null = null;
    let copiedOn: Element | null = null;

    let x = -100,
      y = -100;
    let shape: Shape | null = null;
    let visible = false;
    let raf = 0;

    const apply = (s: Shape) => {
      if (s === shape) return;
      shape = s;
      el.dataset.shape = s.kind;
      const target = s.kind === "bar" ? 1 : 0;
      if (target !== openTo) {
        rotFrom = rotation;
        openFrom = open;
        openTo = target;
        rotTo = target === 1 ? 45 : 0;
        animStart = performance.now();
        animating = true;
      }
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        root.style.opacity = "1";
      }
      update(e.target as Element | null);
    };

    const update = (target: Element | null) => {
      lastTarget = target;
      const email = target?.closest(EMAIL) ?? null;
      if (copiedOn && email !== copiedOn) copiedOn = null;
      const labelled = target?.closest<HTMLElement>(
        '[data-cursor]:not([data-cursor="hide"])',
      );
      const nextLabel = email
        ? copiedOn
          ? "Copied"
          : "Copy email"
        : (labelled?.dataset.cursor ?? "");
      const filled =
        Boolean(email) || labelled?.dataset.cursorFilled !== undefined;
      if (
        nextLabel &&
        labelText &&
        nextLabel !== labelText &&
        !label.hidden &&
        !label.classList.contains("is-leaving") &&
        label.classList.contains("cursor-label-filled") === filled
      ) {
        labelText = nextLabel;
        swapLabel(nextLabel);
      } else if (nextLabel !== labelText) {
        labelText = nextLabel;
        label.classList.remove("is-entering", "is-leaving");
        void label.offsetWidth;
        if (nextLabel) {
          label.classList.toggle("cursor-label-filled", filled);
          label.replaceChildren(textSpan(nextLabel));
          label.hidden = false;
          label.classList.add("is-entering");
        } else if (!label.hidden) {
          label.classList.add("is-leaving");
        }
      }
      root.classList.toggle(
        "cursor-on-footer",
        !POINTER && Boolean(target?.closest("footer")),
      );
      root.classList.toggle(
        "cursor-on-image",
        !POINTER &&
          Boolean(target?.closest(IMAGE)) &&
          !target?.closest("[data-cursor-plain]"),
      );
      if (POINTER || email || labelled?.dataset.cursorFilled !== undefined) {
        apply(SQUARE);
        return;
      }
      const solid = target?.closest('[data-cursor="hide"]');
      if (solid && containsStar(solid, x, y)) {
        apply(GONE);
        return;
      }
      if (labelled || target?.closest(CLICKABLE)) {
        apply(SMALL);
        return;
      }
      apply(overText(x, y, target) ? CARET : SQUARE);
    };

    const loop = (now: number) => {
      root.style.transform = `translate3d(${x - 7}px, ${y - 7}px, 0)`;
      if (animating) {
        const k = Math.min(1, (now - animStart) / MORPH_MS);
        const e = ease(k);
        rotation = rotFrom + (rotTo - rotFrom) * e;
        open = openFrom + (openTo - openFrom) * e;
        if (k === 1) animating = false;
        path?.setAttribute("d", shapePath(rotation, open));
      }
      raf = requestAnimationFrame(loop);
    };

    const hide = () => {
      visible = false;
      root.style.opacity = "0";
    };

    let scrollQueued = false;
    const onScroll = () => {
      if (!visible || scrollQueued) return;
      scrollQueued = true;
      requestAnimationFrame(() => {
        scrollQueued = false;
        update(document.elementFromPoint(x, y));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });

    const onClick = () => requestAnimationFrame(() => update(lastTarget));
    window.addEventListener("click", onClick);

    const onCopied = (e: Event) => {
      copiedOn = (e as CustomEvent<Element>).detail;
      update(lastTarget);
    };
    window.addEventListener("email-copied", onCopied);

    const onDown = () => body.classList.add("is-pressed");
    const onUp = () => body.classList.remove("is-pressed");
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("blur", onUp);

    const onLabelEnd = () => {
      if (label.classList.contains("is-leaving")) {
        label.classList.remove("is-leaving");
        label.hidden = true;
      }
    };
    label.addEventListener("animationend", onLabelEnd);

    apply(SQUARE);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    raf = requestAnimationFrame(loop);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      label.removeEventListener("animationend", onLabelEnd);
      window.removeEventListener("email-copied", onCopied);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("blur", onUp);
      window.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("click", onClick);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!ENABLED) return null;

  return (
    <div
      ref={ref}
      className={POINTER ? "cursor cursor-mode-pointer" : "cursor"}
      aria-hidden="true"
    >
      <span
        ref={bodyRef}
        className="cursor-body"
      >
        <span
          ref={dotRef}
          className="cursor-dot"
        >
          {POINTER ? (
            <svg
              className="cursor-arrow"
              viewBox="0 0 11 16"
              width="11"
              height="16"
            >
              <path d={ARROW_PATH} />
            </svg>
          ) : (
            <svg
              className="cursor-star"
              viewBox="-12 -12 24 24"
              width="24"
              height="24"
            >
              <path ref={pathRef} />
            </svg>
          )}
        </span>
        <span
          ref={labelRef}
          className="cursor-label"
          hidden
        />
      </span>
    </div>
  );
}
