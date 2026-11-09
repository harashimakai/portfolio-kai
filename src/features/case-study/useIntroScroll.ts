import { useEffect, type RefObject } from "react";
import { PHONE_QUERY, REDUCED_MOTION_QUERY } from "../../lib/media";

// Constants

const INTRO_DELAY = 400;
const INTRO_DURATION = 1400;
const INTRO_VISIBLE = 0.075;

// Helpers

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;

function pageTop(el: HTMLElement) {
  let y = 0;
  for (
    let n: HTMLElement | null = el;
    n;
    n = n.offsetParent as HTMLElement | null
  )
    y += n.offsetTop;
  return y;
}

// Hook

export default function useIntroScroll(
  ref: RefObject<HTMLElement | null>,
  ready: boolean,
) {
  useEffect(() => {
    const el = ref.current;
    if (!ready || !el || window.location.hash) return;
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;
    if (window.matchMedia(PHONE_QUERY).matches) return;

    let frame = 0;
    let timer = 0;
    const cancel = () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      stopListening();
    };
    const events = ["wheel", "touchstart", "keydown", "mousedown"] as const;
    const stopListening = () =>
      events.forEach((e) => window.removeEventListener(e, cancel));
    events.forEach((e) =>
      window.addEventListener(e, cancel, { passive: true }),
    );

    timer = window.setTimeout(() => {
      const nav =
        document.querySelector<HTMLElement>(".navbar")?.offsetHeight ?? 0;
      const target = pageTop(el) + el.offsetHeight * (1 - INTRO_VISIBLE) - nav;
      const from = window.scrollY;
      if (target <= from) return stopListening();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / INTRO_DURATION);
        window.scrollTo(0, from + (target - from) * easeInOutCubic(t));
        if (t < 1) frame = requestAnimationFrame(tick);
        else stopListening();
      };
      frame = requestAnimationFrame(tick);
    }, INTRO_DELAY);

    return cancel;
  }, [ref, ready]);
}
