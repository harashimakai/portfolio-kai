import { useEffect, useRef } from "react";

/* Custom pointer for mouse and trackpad users, after Rachel Chen's:
   - Default: a 14px four-pointed star (✦), centred on the pointer.
   - Over text: the star flattens into a 3 x 20 caret.
   - Over anything clickable: an 8px star turned 45°.
   - Over a solid button (data-cursor="hide"): it shrinks away, melting
     into the button.
   - Over an element with data-cursor="<label>": the 8px square plus that
     label 10px to its right, e.g. "View project" on case study cards.
   - Over an email link: the 14px star with a filled label, "Copy email"
     then "Copied" once clicked.
   Shape changes ease over 0.15s; it fades in and out over 0.2s and sits
   exactly on the pointer with no trailing.
   Touch devices and reduced-motion users keep the native cursor.        */

const EMAIL = 'a[href^="mailto:"]';

const CLICKABLE =
  'a, button, [role="button"], select, label, summary, input[type="checkbox"], input[type="radio"]';

type Shape = { w: number; h: number; kind: "star" | "bar" | "small" | "gone" };

const SQUARE: Shape = { w: 14, h: 14, kind: "star" };
const SMALL: Shape = { w: 8, h: 8, kind: "small" };
const CARET: Shape = { w: 3, h: 20, kind: "bar" };
const GONE: Shape = { w: 14, h: 14, kind: "gone" };

/* Is the point over an actual glyph rather than empty box space? */
function overText(x: number, y: number): boolean {
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

export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || calm.matches) return;

    const root = ref.current!;
    const el = dotRef.current!;
    const label = labelRef.current!;
    document.documentElement.classList.add("has-cursor");
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
      el.style.width = `${s.w}px`;
      el.style.height = `${s.h}px`;
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
          /* Appear: reveal left to right. */
          label.textContent = nextLabel;
          label.hidden = false;
          label.classList.add("cursor-label-in");
        } else if (!label.hidden) {
          /* Leave: retract right to left, then hide. */
          label.classList.add("cursor-label-out");
        }
      }
      root.classList.toggle("cursor-filled", Boolean(email));
      /* The footer is its own dark surface: the cursor turns gold there. */
      root.classList.toggle("cursor-on-footer", Boolean(target?.closest("footer")));
      if (email) {
        apply(SQUARE);
        return;
      }
      if (target?.closest('[data-cursor="hide"]')) {
        apply(GONE);
        return;
      }
      if (labelled || target?.closest(CLICKABLE)) {
        apply(SMALL);
        return;
      }
      apply(overText(x, y) ? CARET : SQUARE);
    };

    /* The root is placed so the square, its first child, is centred on
       the pointer; a label simply extends to the right of it.            */
    const loop = () => {
      const w = shape?.w ?? 14;
      const h = shape?.h ?? 14;
      root.style.transform = `translate3d(${x - w / 2}px, ${y - h / 2}px, 0)`;
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
      />
      <span
        ref={labelRef}
        className="cursor-label"
        hidden
      />
    </div>
  );
}
