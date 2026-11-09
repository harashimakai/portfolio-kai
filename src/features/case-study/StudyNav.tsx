import { useEffect, useLayoutEffect, useRef, useState } from "react";

// Types

interface Props {
  sections: { id: string; label: string }[];
}

// Study nav

export default function StudyNav({ sections }: Props) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const [bar, setBar] = useState({ left: 0, width: 0 });
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  useLayoutEffect(() => {
    const list = listRef.current;
    const link = list?.querySelector<HTMLElement>(".is-active .text-label");
    if (!list || !link) return;
    const measure = () => setBar({ left: link.offsetLeft, width: link.offsetWidth });
    measure();
    window.addEventListener("resize", measure);
    const gutter = parseFloat(getComputedStyle(list).paddingLeft);
    list.scrollTo({ left: link.offsetLeft - gutter, behavior: "smooth" });
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  return (
    <nav
      className="study-nav"
      aria-label="On this page"
    >
      <ol
        ref={listRef}
        className="study-nav-list"
      >
        {sections.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={id === active ? "study-nav-link is-active" : "study-nav-link"}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span className="text-label">{label}</span>
            </a>
          </li>
        ))}
        <li
          className="study-nav-indicator"
          style={{ transform: `translateX(${bar.left}px)`, width: bar.width }}
          aria-hidden="true"
        />
      </ol>
    </nav>
  );
}
