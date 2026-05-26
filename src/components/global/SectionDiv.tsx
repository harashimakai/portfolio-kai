interface Props {
  left: string;
  right: string;
  strong?: boolean;
  id?: string;
}

export default function SectionDiv({ left, right, strong, id }: Props) {
  return (
    <div id={id} className="divider">
      <div
        className={
          strong ? "divider-container divider-strong" : "divider-container"
        }
      >
        <h2
          className={
            strong ? "divider-text-strong divider-left" : "divider-left"
          }
        >
          {left}
        </h2>
        <div className="divider-line"></div>
        <h2
          className={
            strong ? "divider-text-strong divider-right" : "divider-right"
          }
        >
          {right}
        </h2>
      </div>
    </div>
  );
}
