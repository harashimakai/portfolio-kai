import { useEffect, useRef, useState } from "react";

// Constants

const DEFAULT_TIMEOUT_MS = 1200;

// Hook

export default function usePreload(
  urls: readonly string[],
  timeout = DEFAULT_TIMEOUT_MS,
) {
  const [ready, setReady] = useState(false);
  const keep = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    let alive = true;
    const decodes = urls.map((src) => {
      const img = new Image();
      img.src = src;
      keep.current.push(img);
      return img.decode().catch(() => undefined);
    });
    const fonts = "fonts" in document ? document.fonts.ready : Promise.resolve();
    const loaded = Promise.all([fonts, ...decodes]);
    const limit = new Promise((resolve) => setTimeout(resolve, timeout));
    Promise.race([loaded, limit]).then(() => {
      if (alive) setReady(true);
    });
    return () => {
      alive = false;
    };
  }, [urls, timeout]);

  useEffect(() => {
    if (ready) keep.current = [];
  }, [ready]);

  return ready;
}
