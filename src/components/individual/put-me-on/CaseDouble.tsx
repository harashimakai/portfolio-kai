import CaseList from "./CaseList";
import CasePill from "./CasePill";

interface Props {
  image1: string;
  image1Label: string;
  pillText1: string;
  columnHeading1: string;
  columnSubheading1: string;
  columnBullets1: string[];
  image2: string;
  image2Label: string;
  pillText2: string;
  columnHeading2: string;
  columnSubheading2: string;
  columnBullets2: string[];
}

export default function CaseDouble({
  image1,
  image1Label,
  pillText1,
  columnHeading1,
  columnSubheading1,
  columnBullets1,
  image2,
  image2Label,
  pillText2,
  columnHeading2,
  columnSubheading2,
  columnBullets2,
}: Props) {
  return (
    <div
      className="case-double-content"
      style={{ gap: 56 }}
    >
      <div>
        <div className="case-wire-container">
          <img
            src={image1}
            alt="Lo-Fi Prototype"
            className="case-wire-image"
          />
          <div className="case-wire-label">{image1Label}</div>
        </div>
        <CasePill>{pillText1}</CasePill>
        <h1 className="case-section-small-subheading case-light">
          {columnHeading1}
        </h1>
        <div className="case-section-meta case-accent">{columnSubheading1}</div>
        <CaseList bullets={columnBullets1} />
      </div>

      <div>
        <div className="case-wire-container">
          <img
            src={image2}
            alt="Lo-Fi Prototype"
            className="case-wire-image"
          />
          <div className="case-wire-label">{image2Label}</div>
        </div>
        <CasePill>{pillText2}</CasePill>
        <h1 className="case-section-small-subheading case-light">
          {columnHeading2}
        </h1>
        <div className="case-section-meta case-accent">{columnSubheading2}</div>
        <CaseList bullets={columnBullets2} />
      </div>
    </div>
  );
}
