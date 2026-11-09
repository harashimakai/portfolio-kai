import { useEffect, useRef } from "react";

import { EMAIL_COPIED_EVENT, MAILTO_SELECTOR } from "../../lib/email";
import { FINE_POINTER_QUERY, REDUCED_MOTION_QUERY } from "../../lib/media";

// Constants

const OFFSCREEN = -100;
const CLICKABLE =
  'a, button, [role="button"], select, label, summary, input[type="checkbox"], input[type="radio"]';
const ARROW_PATH = "M0 0 L0 12.96 L3.28 9.92 L5.52 15.12 L7.68 14.16 L5.52 9.2 L9.76 9.2Z";
const IBEAM_PATH =
  "M1 1.25 C2.75 1.25 4.5 1.75 4.5 3.25 C4.5 1.75 6.25 1.25 8 1.25 M4.5 3.25 V14.75 M1 16.75 C2.75 16.75 4.5 16.25 4.5 14.75 C4.5 16.25 6.25 16.75 8 16.75";

// Helpers

function restartAnimation(el: HTMLElement) {
  void el.offsetWidth;
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

// Cursor

export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia(FINE_POINTER_QUERY);
    const calm = window.matchMedia(REDUCED_MOTION_QUERY);
    if (!fine.matches || calm.matches) return;

    const root = ref.current;
    const body = bodyRef.current;
    const label = labelRef.current;
    if (!root || !body || !label) return;
    document.documentElement.classList.add("has-cursor");

    // State

    let x = OFFSCREEN;
    let y = OFFSCREEN;
    let visible = false;
    let labelText = "";
    let lastTarget: Element | null = null;
    let accentSource: Element | null = null;
    let accentOverImage = false;
    let copiedOn: Element | null = null;

    // Accent

    const matchAccent = (source: Element | null, overImage: boolean) => {
      if (source === accentSource && overImage === accentOverImage) return;
      accentSource = source;
      accentOverImage = overImage;
      const styles = source && getComputedStyle(source);
      const read = (name: string) => styles?.getPropertyValue(name).trim() ?? "";
      const accent =
        (overImage && read("--cursor-image-accent")) ||
        read("--cursor-hover") ||
        read("--accent");
      const contrast = read("--cursor-hover-contrast");
      if (accent) root.style.setProperty("--accent", accent);
      else root.style.removeProperty("--accent");
      if (contrast) root.style.setProperty("--cursor-contrast", contrast);
      else root.style.removeProperty("--cursor-contrast");
      const fill = read("--cursor-fill");
      const outline = read("--cursor-outline");
      if (fill) root.style.setProperty("--cursor-c", fill);
      else root.style.removeProperty("--cursor-c");
      if (outline) root.style.setProperty("--cursor-edge", outline);
      else root.style.removeProperty("--cursor-edge");
    };

    // Update

    const update = (target: Element | null) => {
      lastTarget = target;
      const email = target?.closest(MAILTO_SELECTOR) ?? null;
      if (copiedOn && email !== copiedOn) copiedOn = null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      matchAccent(labelled ?? target, Boolean(target?.closest("img, video")));
      const next = email
        ? copiedOn
          ? "Copied"
          : "Copy email"
        : (labelled?.dataset.cursor ?? "");
      root.classList.toggle("is-clickable", Boolean(labelled || target?.closest(CLICKABLE)));
      root.classList.toggle(
        "is-text",
        !labelled && !target?.closest(CLICKABLE) && overText(x, y, target),
      );
      if (next === labelText) return;
      labelText = next;

      const filled =
        Boolean(email) || labelled?.dataset.cursorFilled !== undefined;
      const showing =
        !label.hidden && !label.classList.contains("is-leaving");
      if (
        next &&
        showing &&
        label.classList.contains("cursor-label-filled") === filled
      ) {
        label.textContent = next;
        return;
      }

      label.classList.remove("is-entering", "is-leaving");
      restartAnimation(label);
      if (next) {
        label.classList.toggle("cursor-label-filled", filled);
        label.textContent = next;
        label.hidden = false;
        label.classList.add("is-entering");
      } else if (!label.hidden) {
        label.classList.add("is-leaving");
      }
    };

    // Handlers

    let moveTarget: Element | null = null;
    let moveQueued = 0;
    const flushMove = () => {
      moveQueued = 0;
      update(moveTarget);
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      root.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (!visible) {
        visible = true;
        root.style.opacity = "1";
      }
      moveTarget = e.target as Element | null;
      if (!moveQueued) moveQueued = requestAnimationFrame(flushMove);
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

    const onClick = () =>
      requestAnimationFrame(() => {
        accentSource = null;
        update(document.elementFromPoint(x, y) ?? lastTarget);
      });

    const onCopied = (e: Event) => {
      copiedOn = (e as CustomEvent<Element>).detail;
      update(lastTarget);
    };

    const onDown = () => body.classList.add("is-pressed");
    const onUp = () => body.classList.remove("is-pressed");

    const onLabelEnd = () => {
      if (label.classList.contains("is-leaving")) {
        label.classList.remove("is-leaving");
        label.hidden = true;
      }
    };

    // Listeners

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("click", onClick);
    window.addEventListener(EMAIL_COPIED_EVENT, onCopied);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("blur", onUp);
    window.addEventListener("blur", hide);
    document.addEventListener("pointerleave", hide);
    label.addEventListener("animationend", onLabelEnd);

    // Cleanup

    return () => {
      cancelAnimationFrame(moveQueued);
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("click", onClick);
      window.removeEventListener(EMAIL_COPIED_EVENT, onCopied);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("blur", onUp);
      window.removeEventListener("blur", hide);
      document.removeEventListener("pointerleave", hide);
      label.removeEventListener("animationend", onLabelEnd);
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
        <svg
          className="cursor-ibeam"
          viewBox="0 0 9 18"
          width="9"
          height="18"
        >
          <path
            className="cursor-ibeam-edge"
            d={IBEAM_PATH}
          />
          <path
            className="cursor-ibeam-line"
            d={IBEAM_PATH}
          />
        </svg>
        <svg
          className="cursor-arrow"
          viewBox="0 0 11 16"
          width="11"
          height="16"
        >
          <path d={ARROW_PATH} />
        </svg>
        <span
          ref={labelRef}
          className="cursor-label"
          hidden
        />
      </span>
    </div>
  );
}
