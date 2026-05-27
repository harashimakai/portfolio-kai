import { Project } from "./ProjectData";

interface Props {
  item: Project;
  index: number;
  total: number;
  mosaic?: boolean;
}

export default function ItemCard({
  item,
  index,
  total,
  mosaic = false,
}: Props) {
  const num = String(index + 1).padStart(2, "0");
  const totalStr = String(total).padStart(2, "0");
  return (
    <>
      <div
        className="item-image"
        style={mosaic && item.height ? { aspectRatio: "unset" } : undefined}
      >
        <img
          loading="lazy"
          src={item.thumbnailUrl}
          alt={item.title}
          style={
            item.imagePos
              ? { objectPosition: item.imagePos }
              : mosaic && item.height
                ? { objectFit: "contain", height: item.height }
                : undefined
          }
        />
      </div>

      <div className="item-meta">
        <h2>
          {num} / {totalStr}
        </h2>
        <h2>
          {item.medium} · {item.year}
        </h2>
      </div>
      <p
        className="item-title"
        style={
          mosaic
            ? { fontSize: item.mainFont, letterSpacing: item.letterSpacing }
            : undefined
        }
      >
        {item.title}
      </p>
      <p
        className="item-excerpt"
        style={mosaic ? { fontSize: item.secondFont } : undefined}
      >
        {item.shortDescription}
      </p>
    </>
  );
}
