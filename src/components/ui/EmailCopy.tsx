import { useEffect, useState } from "react";

import { EMAIL_COPIED_EVENT, MAILTO_SELECTOR } from "../../lib/email";

// Constants

const TOAST_MS = 1800;

// Email copy

export default function EmailCopy() {
  const [toast, setToast] = useState("");

  useEffect(() => {
    let t = 0;
    const onClick = async (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest<HTMLAnchorElement>(
        MAILTO_SELECTOR,
      );
      const href = link?.getAttribute("href");
      if (!link || !href) return;
      e.preventDefault();
      const address = decodeURIComponent(
        href.slice("mailto:".length).split("?")[0],
      );
      try {
        await navigator.clipboard.writeText(address);
      } catch {
        window.location.href = link.href;
        return;
      }
      window.dispatchEvent(new CustomEvent(EMAIL_COPIED_EVENT, { detail: link }));
      if (!document.documentElement.classList.contains("has-cursor")) {
        setToast(`Copied ${address}`);
        window.clearTimeout(t);
        t = window.setTimeout(() => setToast(""), TOAST_MS);
      }
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      window.clearTimeout(t);
    };
  }, []);

  return (
    <div
      className={toast ? "email-toast is-visible" : "email-toast"}
      role="status"
      aria-live="polite"
    >
      {toast}
    </div>
  );
}
