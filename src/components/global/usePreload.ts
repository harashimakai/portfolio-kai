import { useEffect, useRef, useState } from "react";

/* Holds a page back until its web fonts and first-screen images have
   decoded, so entrance animations don't compete with font swaps and image
   decoding on the main thread. Gives up after `timeout` ms so a slow
   network never leaves the page blank.                                     */
export default function usePreload(urls: string[], timeout = 1200) {
  const [ready, setReady] = useState(false);
  /* Keep the decoded images alive until the page has rendered with them,
     so the browser reuses the bitmaps instead of decoding again.           */
  const keep = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    let alive = true;
    const decodes = urls.map((src) => {
      const img = new Image();
      img.src = src;
      keep.current.push(img);
      return img.decode().catch(() => undefined);
    });
    const fonts =
      typeof document !== "undefined" && "fonts" in document
        ? document.fonts.ready
        : Promise.resolve();
    const loaded = Promise.all([fonts, ...decodes]);
    const limit = new Promise((resolve) => setTimeout(resolve, timeout));
    Promise.race([loaded, limit]).then(() => {
      if (alive) setReady(true);
    });
    return () => {
      alive = false;
    };
    // The URL list is static per page.
  }, []);

  useEffect(() => {
    if (ready) keep.current = [];
  }, [ready]);

  return ready;
}
