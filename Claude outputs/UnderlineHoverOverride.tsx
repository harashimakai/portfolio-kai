import type { ComponentType } from "react"

/**
 * Underline Hover — override version
 *
 * Apply to any existing Framer text or link layer so it keeps its own
 * typography and just picks up the underline wipe.
 *
 * Usage: select a layer → right panel → Code Override → this file →
 * "withUnderlineHover".
 *
 * Tokens: override --uh-line / --uh-line-hover / --uh-text-hover anywhere
 * up the tree (or in Site Settings → Custom Code) to theme it — e.g. a
 * [data-framer-theme="dark"] block for the dark palette.
 */

const CSS = `
:root {
  --uh-line: #0C2E08;
  --uh-line-hover: #226A14;
  --uh-text-hover: #226A14;
  --uh-thickness: 1.5px;
  --uh-offset: 3px;
  --uh-wipe: 0.25s;
  --uh-fade: 0.5s;
}

.underline-hover {
  position: relative;
  text-decoration: none;
  width: fit-content;
}

.underline-hover::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: calc(-1 * var(--uh-offset));
  width: 100%;
  height: var(--uh-thickness);
  background-color: var(--uh-line);
  transform: scaleX(0);
  transform-origin: right;
  transition:
    transform var(--uh-wipe) ease-out,
    background-color var(--uh-fade) ease-in-out;
  pointer-events: none;
}

.underline-hover:hover::after,
.underline-hover:focus-visible::after,
.underline-hover.is-active::after {
  transform: scaleX(1);
  transform-origin: left;
  background-color: var(--uh-line-hover);
}

.underline-hover:hover,
.underline-hover:hover * {
  color: var(--uh-text-hover);
  transition: color var(--uh-fade) ease-in-out;
}
`

if (typeof document !== "undefined" && !document.getElementById("underline-hover-css")) {
    const tag = document.createElement("style")
    tag.id = "underline-hover-css"
    tag.textContent = CSS
    document.head.appendChild(tag)
}

export function withUnderlineHover(Component): ComponentType {
    return (props: any) => (
        <Component
            {...props}
            className={[props.className, "underline-hover"]
                .filter(Boolean)
                .join(" ")}
        />
    )
}

/** Same thing, but permanently underlined — for the current nav item. */
export function withUnderlineHoverActive(Component): ComponentType {
    return (props: any) => (
        <Component
            {...props}
            className={[props.className, "underline-hover", "is-active"]
                .filter(Boolean)
                .join(" ")}
        />
    )
}
