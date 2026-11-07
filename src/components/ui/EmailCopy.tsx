import { useEffect, useState } from "react";

export default function EmailCopy() {
  const [toast, setToast] = useState("");

  useEffect(() => {
    let t = 0;
    const onClick = async (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest<HTMLAnchorElement>(
        'a[href^="mailto:"]',
      );
      if (!link) return;
      e.preventDefault();
      const address = decodeURIComponent(
        link.getAttribute("href")!.slice("mailto:".length).split("?")[0],
      );
      try {
        await navigator.clipboard.writeText(address);
      } catch {
        window.location.href = link.href;
        return;
      }
      window.dispatchEvent(new CustomEvent("email-copied", { detail: link }));
      if (!document.documentElement.classList.contains("has-cursor")) {
        setToast(`Copied ${address}`);
        window.clearTimeout(t);
        t = window.setTimeout(() => setToast(""), 1800);
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
