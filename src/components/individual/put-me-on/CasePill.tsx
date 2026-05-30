interface Props {
  children: React.ReactNode;
  color?: string;
  size?: string;
}

export default function PMOPill({
  children,
  color = `var(--cs-text)`,
  size = "md",
}: Props) {
  return (
    <div className="case-pill-container">
      <span
        className="case-pill"
        style={{
          padding: size === "lg" ? "18px 36px" : "14px 28px",
          borderColor: `${color}`,
          fontSize: size === "lg" ? 14 : 12,
        }}
      >
        {children}
      </span>
    </div>
  );
}
