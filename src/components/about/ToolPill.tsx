interface Props {
  children: React.ReactNode;
}

export default function ToolPill({ children }: Props) {
  return <span className="toolpill">{children}</span>;
}
