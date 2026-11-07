interface Props {
  dir: "ne" | "up" | "right";
  lead?: boolean;
}

const ROTATE: Record<Props["dir"], number> = {
  right: 0,
  ne: -45,
  up: -90,
};

export default function Arrow({ dir, lead = false }: Props) {
  return (
    <span
      className={lead ? "arrow arrow-lead" : "arrow"}
      aria-hidden="true"
    >
      {"\u2014"}
      <svg
        className="arrow-icon"
        viewBox="0 0 16 16"
        focusable="false"
      >
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
