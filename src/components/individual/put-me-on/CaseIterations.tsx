import { ReactNode, useEffect } from "react";

import { putmeon } from "../StudyData";
import backgroundCover from "../../../assets/case-studies/putmeon/gradient.png";

interface Props {
  leftText: string[];
  rightText: ReactNode[];
  files: string[];
  noPadding?: boolean;
}

export default function CaseIterations({
  files,
  leftText,
  rightText,
  noPadding = false,
}: Props) {
  const iterationData = [leftText, rightText, files];
  return (
    <section
      className="case-iterations-content"
      style={{
        paddingTop: noPadding ? "0" : undefined,
        marginBottom: noPadding ? "0" : undefined,
      }}
    >
      {iterationData.map((data, idx) => (
        <figure className="case-iteration-figure">
          <div className="case-iteration-figure-content">
            <img
              src={files[idx]}
              alt={`Iteration ${idx + 1}`}
            />
          </div>
          <figcaption className="case-iteration-caption">
            <span className="meta-text">{leftText[idx]}</span>
            <span className="meta-text">{rightText[idx]}</span>
          </figcaption>
        </figure>
      ))}
    </section>
  );
}
