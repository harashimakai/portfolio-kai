/* Inline arrow drawn as SVG in the current text colour. Unicode arrows
   render differently across fonts and platforms (and turn into emoji on
   some phones); this one is the same everywhere.

   The icon sits over an invisible em dash. Inside a link the browser
   underlines that glyph exactly as it does the text, so the underline
   runs on under the arrow with no second line to align by hand.         */
interface Props {
  dir?: "ne" | "up" | "right" | "left" | "down";
  /* The arrow comes before its label rather than after. */
  lead?: boolean;
  className?: string;
}

const ROTATE: Record<NonNullable<Props["dir"]>, number> = {
  right: 0,
  ne: -45,
  up: -90,
  left: 180,
  down: 90,
};

export default function Arrow({ dir = "ne", lead = false, className }: Props) {
  return (
    <span
      className={["arrow", lead && "arrow-lead", className]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      {/* An em dash (exactly 1em wide) with its fill made transparent in
          CSS: browsers will not underline spaces at the end of a link,
          but they underline this glyph, so the link's underline runs on
          beneath the icon. letter-spacing adds the gap.                  */}
      {"\u2014"}
      <svg
        className="arrow-icon"
        viewBox="0 0 16 16"
        focusable="false"
      >
        {/* The stroke is a fixed 1.75px on screen whatever the icon's size. */}
        <g
          transform={`rotate(${ROTATE[dir]} 8 8)`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="butt"
          strokeLinejoin="miter"
        >
          <path
            d="M2 8h12"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M8.5 2.5L14 8l-5.5 5.5"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>
    </span>
  );
}
