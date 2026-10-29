import { useEffect, useRef } from "react";

/* Custom pointer for mouse and trackpad users.
   - Default: a small square that trails the pointer.
   - Over text: a thin caret as tall as the text under it.
   - Over anything clickable: a smaller square.
   Touch devices and reduced-motion users keep the native cursor.        */

const CLICKABLE =
  'a, button, [role="button"], select, label, summary, input[type="checkbox"], input[type="radio"]';

type Shape = { w: number; h: number; r: number };

const SQUARE: Shape = { w: 10, h: 10, r: 1 };
const SMALL: Shape = { w: 6, h: 6, r: 1 };

/* Is the point over an actual glyph rather than empty box space? Returns
   the height of that line of text, or 0.                                */
function textHeightAt(x: number, y: number): number {
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
  if (!node || node.nodeType !== Node.TEXT_NODE) return 0;
  const text = node.textContent ?? "";
  if (!text.trim()) return 0;
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
      ) {
        const el = node.parentElement;
        const size = el ? parseFloat(getComputedStyle(el).fontSize) : 16;
        return Math.max(12, Math.round(size * 1.05));
      }
    }
  }
  return 0;
}

export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || calm.matches) return;

    const el = ref.current!;
    document.documentElement.classList.add("has-cursor");

    let x = -100,
      y = -100,
      cx = -100,
      cy = -100;
    let shape = SQUARE;
    let visible = false;
    let raf = 0;

    const apply = (s: Shape) => {
      if (s === shape) return;
      shape = s;
      el.style.width = `${s.w}px`;
      el.style.height = `${s.h}px`;
      el.style.borderRadius = `${s.r}px`;
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        cx = x;
        cy = y;
        el.style.opacity = "1";
      }
      const target = e.target as Element | null;
      if (target?.closest(CLICKABLE)) {
        apply(SMALL);
        return;
      }
      const h = textHeightAt(x, y);
      if (h) {
        if (shape.h !== h || shape.w !== 2) apply({ w: 2, h, r: 1 });
      } else apply(SQUARE);
    };

    const loop = () => {
      /* Ease toward the pointer for a little trailing weight. */
      cx += (x - cx) * 0.35;
      cy += (y - cy) * 0.35;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    const hide = () => {
      visible = false;
      el.style.opacity = "0";
    };

    apply({ ...SQUARE });
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    raf = requestAnimationFrame(loop);
    return () => {
      document.documentElement.classList.remove("has-cursor");
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
    />
  );
}
