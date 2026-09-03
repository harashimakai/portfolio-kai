import { useEffect, useRef, useState } from "react";
import { Project } from "./ProjectData";

interface Props {
  item: Project;
  index: number;
  total: number;
}

export default function ItemCard({ item, index, total }: Props) {
  const num = String(index + 1).padStart(2, "0");
  const totalStr = String(total).padStart(2, "0");
  const imgRef = useRef<HTMLImageElement>(null);
  const [aspectRatio, setAspectRatio] = useState<number | undefined>();

  const measure = () => {
    const img = imgRef.current;
    if (!img || !item.heightPercent || !img.naturalWidth || !img.naturalHeight)
      return;
    setAspectRatio(
      img.naturalWidth / (img.naturalHeight * (item.heightPercent / 100)),
    );
  };

  useEffect(() => {
    setAspectRatio(undefined);
    if (imgRef.current?.complete) measure();
  }, [item.thumbnailUrl, item.heightPercent]);

  return (
    <>
      <div
        className="item-image"
        style={item.heightPercent ? { aspectRatio: aspectRatio ?? "unset" } : undefined}
      >
        <img
          ref={imgRef}
          loading="lazy"
          src={item.thumbnailUrl}
          alt={item.title}
          onLoad={measure}
          style={
            item.imagePos
              ? { objectPosition: item.imagePos }
              : item.heightPercent
                ? { objectPosition: "top" }
                : undefined
          }
        />
      </div>

      <div className="item-meta">
        <h3>
          {num} / {totalStr}
        </h3>
        <h3>
          {item.medium} · {item.year}
        </h3>
      </div>
      <p className="item-title entry-title">{item.title}</p>
      <p className="item-excerpt body-xs">{item.shortDescription}</p>
    </>
  );
}
