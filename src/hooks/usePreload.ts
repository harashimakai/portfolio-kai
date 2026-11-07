import { useEffect, useRef, useState } from "react";

export default function usePreload(urls: string[], timeout = 1200) {
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
  }, []);

  useEffect(() => {
    if (ready) keep.current = [];
  }, [ready]);

  return ready;
}
