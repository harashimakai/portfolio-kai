import { useEffect, useRef } from "react";

/* Custom pointer for mouse and trackpad users, after Rachel Chen's:
   - Default: a 14px ✦ drawn as an SVG path, centred on the pointer.
   - Over text: the star turns while each tip travels to its nearest
     corner of the caret and its curved sides straighten, becoming a 3 x
     20 bar. Leaving text keeps turning the same way back to a star.
   - Over anything clickable: the star shrinks to 8px.
   - Over a solid button (data-cursor="hide"): once the whole star is
     inside it, it shrinks away, melting into the button.
   - Over an element with data-cursor="<label>": the 8px square plus that
     label 10px to its right, e.g. "View project" on case study cards.
   - Over an email link: the 14px star with a filled label, "Copy email"
     then "Copied" once clicked. Any element can ask for a filled label
     with data-cursor-filled (the theme toggle: "Dark mode" / "Light mode").
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

/* Is the whole 14px star inside the element? Checks its four tips, so a
   pill's rounded ends count as outside.                                  */
function containsStar(el: Element, x: number, y: number): boolean {
  const r = 7;
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
   The star has four tips joined by quadratic curves whose controls sit
   near the centre, giving the concave sides. The bar has the same
   structure: four corners joined by straight sides.
   Everything moves together on one eased progress value, in polar terms
   so every frame stays symmetric: the star turns 45° while each tip
   swings and travels out to its corner of the bar and each curve control
   moves out to its side's midpoint, straightening the curves.           */
const R = 7; /* star radius: 14px tip to tip */
const C = 1.25 * Math.SQRT2; /* curve controls' distance from the centre */
const BAR_W = 1.5,
  BAR_H = 10; /* half-sizes of the 3 x 20 caret */
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
/* [start angle, final distance] for each curve control: after the turn
   they land on the right, bottom, left and top sides' midpoints.       */
const CTRLS: [number, number][] = [
  [45, BAR_W],
  [135, BAR_H],
  [225, BAR_W],
  [315, BAR_H],
];

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const polar = (a: number, r: number) =>
  `${(r * Math.sin(a * DEG)).toFixed(3)} ${(-r * Math.cos(a * DEG)).toFixed(3)}`;

/* The outline for a given turn (degrees, clockwise) and openness (0 =
   star, 1 = bar). The bar is reached at turns of 45° + 180°k; a star at
   any whole quarter turn looks upright, since it repeats every 90°.    */
function shapePath(rotation: number, open: number): string {
  const tips = TIPS.map(([a, swing]) =>
    polar(a + rotation + swing * open, R + (CORNER_R - R) * open),
  );
  const ctls = CTRLS.map(([a, r]) => polar(a + rotation, C + (r - C) * open));
  let d = `M${tips[0]}`;
  for (let i = 0; i < 4; i++) d += ` Q${ctls[i]} ${tips[(i + 1) % 4]}`;
  return d + "Z";
}

const MORPH_MS = 290;

export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || calm.matches) return;

    const root = ref.current!;
    const el = dotRef.current!;
    const label = labelRef.current!;
    const path = pathRef.current!;
    document.documentElement.classList.add("has-cursor");

    /* Turn and openness, animated by the frame loop. Entering text turns
       the star 45° into the bar; leaving keeps turning the same way, a
       further 45°, back into an upright star.                           */
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
        rotTo =
          target === 1
            ? /* next bar position: 45° + 180°k */
              45 + 180 * Math.ceil((rotation - 45) / 180)
            : /* keep turning forward to the next quarter turn */
              90 * (Math.floor(rotation / 90) + 1);
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
        if (k === 1) {
          animating = false;
          /* Back at a star: fold the turn into one quarter, which looks
             identical, so the numbers never grow. */
          if (openTo === 0) rotation %= 90;
        }
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
    </div>
  );
}
