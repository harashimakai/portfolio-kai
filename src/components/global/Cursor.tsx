import { useEffect, useRef } from "react";

/* Custom pointer for mouse and trackpad users, after Rachel Chen's:
   - Default: a 18px ✦ drawn as an SVG path, centred on the pointer.
   - Over text: the star turns while each tip travels to its nearest
     corner of the caret and its sides reshape, becoming a 4 x 22 bar
     with a narrow waist. Leaving text turns it back the way it came, into the star.
   - Over anything clickable: the star shrinks to 70%, about 12.6px.
   - Over a solid button (data-cursor="hide"): once the whole star is
     inside it, it shrinks away, melting into the button.
   - Over an element with data-cursor="<label>": the 12.6px star plus that
     label 10px to its right, e.g. "View project" on case study cards.
   - Over an email link: the 18px star with a filled label, "Copy email"
     then "Copied" once clicked. Any element can ask for a filled label
     with data-cursor-filled (the theme toggle: "Dark mode" / "Light mode").
   - Pressing the mouse button shrinks the whole cursor, label and all,
     to 80%, whatever it is over, until it is released. Over clickables
     the star drops from 70% to 40%, the same step as from normal
     to clickable.
   - Over an actual image in dark mode, the cursor takes the page's dark
     green so it reads against the picture.
   The star always scales about its own centre, which sits exactly on the
   pointer; it fades in and out over 0.2s with no trailing.
   Touch devices and reduced-motion users keep the native cursor.        */

const EMAIL = 'a[href^="mailto:"]';
/* Elements whose box is the picture itself. */
const IMAGE =
  "img, video, .art-tile-image, .card-image, .study-figure, .lightbox-figure";

const CLICKABLE =
  'a, button, [role="button"], select, label, summary, input[type="checkbox"], input[type="radio"]';

type Shape = { w: number; h: number; kind: "star" | "bar" | "small" | "gone" };

const SQUARE: Shape = { w: 14, h: 14, kind: "star" };
const SMALL: Shape = { w: 8, h: 8, kind: "small" };
const CARET: Shape = { w: 3, h: 20, kind: "bar" };
const GONE: Shape = { w: 14, h: 14, kind: "gone" };

/* Is the whole star inside the element? Checks its four tips, so a
   pill's rounded ends count as outside.                                  */
function containsStar(el: Element, x: number, y: number): boolean {
  const r = R;
  return [
    [x - r, y],
    [x + r, y],
    [x, y - r],
    [x, y + r],
  ].every(([px, py]) => el.contains(document.elementFromPoint(px, py)));
}

/* Is the point over an actual glyph rather than empty box space? The
   glyph must belong to the element under the pointer (glyphs can overhang
   their box) and must not sit inside anything clickable or labelled.    */
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
  /* Check the characters either side of the caret actually contain the
     point; caret APIs snap to the nearest text even from far away.     */
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

/* ── The ✦ and its morph into the caret ────────────────────────────────
   Points are in px about the pointer, angles clockwise from straight up.
   The star has four flat-cut tips joined by cubic curves. Each curve's
   two controls sit near the centre, angled a little off the arms they
   leave and enter, so the arms taper evenly to their tips. The bar has
   the same structure: the cuts close to nothing at its four corners,
   its ends are straight, and its long sides curve in to a waist a
   third of its width, flaring out in rounded curves near the ends.
   Everything moves together on one eased progress value, so every frame
   stays symmetric: the star turns 45° while each tip
   swings and travels out to its corner of the bar, its cut closing to a
   point. On the ends each curve's two controls close together at the
   midpoint, straightening them; on the long sides they spread to just
   inside the waist near either end, pinching the side into a long
   narrow neck.                                                           */
const R = 9; /* star radius: 18px tip to tip */
const K = 3.5; /* curve controls' distance from the centre */
const SPREAD = 20; /* each control's angle either side of the diagonal */
const BAR_W = 3,
  BAR_H = 11; /* half-sizes of the 6 x 22 caret, flares included */
const CUT = 0.55; /* half-width of each tip's slight flat cut */
const DEG = Math.PI / 180;
const CORNER_A = Math.atan2(BAR_W, BAR_H) / DEG;
const CORNER_R = Math.hypot(BAR_W, BAR_H);
/* Each tip travels to its nearest corner: top -> top right, right ->
   bottom right, bottom -> bottom left, left -> top left. That is a 45°
   turn plus a small swing per tip; [start angle, swing] below.         */
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

/* Each side runs cubic, straight line, cubic: six points after the tip
   it leaves, [control, control, end, line end, control, control], with
   the next tip closing it.

   The star's sides are its single taper curve, split exactly in half
   (de Casteljau), with a zero-length line between the halves.

   The caret's long sides are a straight stem STEM across, flaring out
   near each end over FLARE px in a rounded bracket to a short flat
   FLAT px tall at each corner, like the star's cut tips. Its ends are
   straight, split the same way. Its points are laid out on
   its right, bottom, left and top sides and turned back by the 45° the
   star turns on the way, so the two can be blended directly.         */
const STEM = 1.1; /* half-width of the caret's straight stem */
const FLARE = 2.2; /* height of each flare at the caret's ends */
const FLAT = 0.5; /* height of the flat at each of the caret's corners */
const NECK = BAR_H - FLARE;

function starSide(i: number): Pt[] {
  /* The curve runs from just after this tip's cut to just before the
     next one's. */
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

/* The right side, from below the top corner's flat to above the bottom
   one's; the others are this turned. A flare's controls sit partway
   from each end towards the bracket's inside corner, giving a rounded
   quarter curve.                                                      */
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
/* The bottom end, right corner to left, straight. */
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
/* At each of the caret's corners the flat runs along the long side:
   [before, after] offsets from the corner, upright, for the top right,
   bottom right, bottom left and top left corners in turn.           */
const FLATS: [Pt, Pt][] = (
  [
    [[0, 0], [0, FLAT]],
    [[0, -FLAT], [0, 0]],
    [[0, 0], [0, -FLAT]],
    [[0, FLAT], [0, 0]],
  ] as [Pt, Pt][]
).map(([a, b]) => [turn(a, -TURN), turn(b, -TURN)]);

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/* The outline for a given turn (degrees, clockwise) and openness (0 =
   star, 1 = bar). The star sits at 0° and the bar at 45°.             */
function shapePath(rotation: number, open: number): string {
  /* Each tip is a flat edge square to its direction: [before, after]. */
  /* Each side's points, and the caret's corner flats, slide in straight
     lines from their star spots to their bar spots, mostly near the end
     (cubed), once the tips have swung round to meet them, so the sides
     never bulge outward.                                              */
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

export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || calm.matches) return;

    const root = ref.current!;
    const body = bodyRef.current!;
    const el = dotRef.current!;
    const label = labelRef.current!;
    const path = pathRef.current!;
    document.documentElement.classList.add("has-cursor");

    /* Turn and openness, animated by the frame loop. Entering text turns
       the star 45° into the bar; leaving turns it back 45° into the
       star, from wherever it had got to.                                */
    let rotation = 0,
      open = 0,
      rotFrom = 0,
      rotTo = 0,
      openFrom = 0,
      openTo = 0,
      animStart = 0,
      animating = false;
    path.setAttribute("d", shapePath(0, 0));
    let labelText = "";
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
      if (nextLabel !== labelText) {
        labelText = nextLabel;
        label.classList.remove("cursor-label-in", "cursor-label-out");
        void label.offsetWidth; /* restart the animation */
        if (nextLabel) {
          /* Appear: reveal left to right. The filled style is set before
             the label shows and kept through its retract, so the plain
             style never flashes.                                        */
          label.classList.toggle(
            "cursor-label-filled",
            Boolean(email) || labelled?.dataset.cursorFilled !== undefined,
          );
          label.textContent = nextLabel;
          label.hidden = false;
          label.classList.add("cursor-label-in");
        } else if (!label.hidden) {
          /* Leave: retract right to left, then hide. */
          label.classList.add("cursor-label-out");
        }
      }
      /* The footer is its own dark surface: the cursor turns gold there. */
      root.classList.toggle("cursor-on-footer", Boolean(target?.closest("footer")));
      /* Pictures marked data-cursor-plain (the About portrait) keep the
         normal cursor colour. */
      root.classList.toggle(
        "cursor-on-image",
        Boolean(target?.closest(IMAGE)) && !target?.closest("[data-cursor-plain]"),
      );
      if (email || labelled?.dataset.cursorFilled !== undefined) {
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

    /* The root's 14px box is centred on the pointer; the star scales and
       morphs about that centre, and a label extends to the right.       */
    const loop = (now: number) => {
      root.style.transform = `translate3d(${x - 7}px, ${y - 7}px, 0)`;
      if (animating) {
        const k = Math.min(1, (now - animStart) / MORPH_MS);
        const e = ease(k);
        rotation = rotFrom + (rotTo - rotFrom) * e;
        open = openFrom + (openTo - openFrom) * e;
        if (k === 1) animating = false;
        path.setAttribute("d", shapePath(rotation, open));
      }
      raf = requestAnimationFrame(loop);
    };

    const hide = () => {
      visible = false;
      root.style.opacity = "0";
    };

    /* Scrolling moves the page under a still pointer: re-check what is
       beneath it so labels and shapes stay correct without moving the
       mouse. Throttled to one check per frame.                          */
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

    /* After a click the element under the pointer may have changed its
       label (the theme toggle does): re-read it on the next frame.      */
    const onClick = () => requestAnimationFrame(() => update(lastTarget));
    window.addEventListener("click", onClick);

    /* An email link was copied: swap its label to "Copied". */
    const onCopied = (e: Event) => {
      copiedOn = (e as CustomEvent<Element>).detail;
      update(lastTarget);
    };
    window.addEventListener("email-copied", onCopied);

    /* Pressing shrinks the star and its label together about the
       pointer; releasing, or the press ending some other way, undoes it. */
    const onDown = () => body.classList.add("cursor-pressed");
    const onUp = () => body.classList.remove("cursor-pressed");
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("blur", onUp);

    const onLabelEnd = () => {
      if (label.classList.contains("cursor-label-out")) {
        label.classList.remove("cursor-label-out");
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

  return (
    <div
      ref={ref}
      className="cursor"
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
          <svg
            className="cursor-star"
            viewBox="-12 -12 24 24"
            width="24"
            height="24"
          >
            <path ref={pathRef} />
          </svg>
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
