import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";

// Constants

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Types

interface DialogOptions {
  open: boolean;
  onClose: () => void;
  initialFocus?: RefObject<HTMLElement | null>;
  returnFocus?: RefObject<HTMLElement | null>;
  focusDelay?: number;
}

// Hook

export default function useDialog(
  rootRef: RefObject<HTMLElement | null>,
  { open, onClose, initialFocus, returnFocus, focusDelay = 0 }: DialogOptions,
) {
  const onCloseRef = useRef(onClose);
  useLayoutEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const focusables = () =>
      Array.from(rootRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    const focusTimer = setTimeout(
      () => (initialFocus?.current ?? focusables()[0])?.focus(),
      focusDelay,
    );

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onCloseRef.current();
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const i = items.indexOf(document.activeElement as HTMLElement);
      const step = e.shiftKey ? -1 : 1;
      e.preventDefault();
      items[(i + step + items.length) % items.length].focus();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      root.style.overflow = prevOverflow;
      clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
      if (returnFocus?.current) returnFocus.current.focus();
      else if (rootRef.current?.contains(document.activeElement)) {
        (document.activeElement as HTMLElement).blur();
      }
    };
  }, [open, rootRef, initialFocus, returnFocus, focusDelay]);
}
