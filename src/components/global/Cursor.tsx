import { useEffect, useRef } from "react";

/* Custom pointer for mouse and trackpad users, on Rachel Chen's spec:
   - Default: a 14px square, sharp corners, centred on the pointer.
   - Over text: a fixed 3 x 20 caret, switched instantly.
   - Over anything clickable: an 8px square.
   Size changes ease over 0.12s (except into the caret); it fades in and
   out over 0.2s and sits exactly on the pointer with no trailing.
   Touch devices and reduced-motion users keep the native cursor.        */

const CLICKABLE =
  'a, button, [role="button"], select, label, summary, input[type="checkbox"], input[type="radio"]';

type Shape = { w: number; h: number; snap?: boolean };

const SQUARE: Shape = { w: 14, h: 14 };
const SMALL: Shape = { w: 8, h: 8 };
const CARET: Shape = { w: 3, h: 20, snap: true };

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

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || calm.matches) return;

    const el = ref.current!;
    document.documentElement.classList.add("has-cursor");

    let x = -100,
      y = -100;
    let shape: Shape | null = null;
    let visible = false;
    let raf = 0;

    const apply = (s: Shape) => {
      if (s === shape) return;
      shape = s;
      el.style.transition = s.snap
        ? "opacity 0.2s ease-out"
        : "width 0.12s ease-out, height 0.12s ease-out, opacity 0.2s ease-out";
      el.style.width = `${s.w}px`;
      el.style.height = `${s.h}px`;
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        el.style.opacity = "1";
      }
      const target = e.target as Element | null;
      if (target?.closest(CLICKABLE)) {
        apply(SMALL);
        return;
      }
      apply(overText(x, y) ? CARET : SQUARE);
    };

    const loop = () => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    const hide = () => {
      visible = false;
      el.style.opacity = "0";
    };

    apply(SQUARE);
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
