interface Props {
  children: React.ReactNode;
}

export default function ToolPill({ children }: Props) {
  return (
    <span className="toolpill">
      <h3>{children}</h3>
    </span>
  );
}
