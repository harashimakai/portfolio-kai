import CasePill from "./CasePill";

interface Props {
  pill?: string;
  title: React.ReactNode;
  dark?: boolean;
  sub?: boolean;
  small?: boolean;
  column?: boolean;
  columnBody?: React.ReactNode;
}

export default function CaseBand({
  pill,
  title,
  dark = false,
  sub = false,
  small = false,
  column = false,
  columnBody,
}: Props) {
  return (
    <div className={column ? "case-double-content" : undefined}>
      <div>
        {pill && (
          <CasePill color={dark ? undefined : "var(--cs-bg)"}> {pill}</CasePill>
        )}
        <h1
          className={
            dark
              ? sub
                ? "case-section-subheading case-light"
                : small
                  ? "case-section-small-heading case-light"
                  : "case-section-heading case-light"
              : sub
                ? "case-section-subheading case-dark"
                : small
                  ? "case-section-small-heading case-dark"
                  : "case-section-heading case-dark"
          }
        >
          {title}
        </h1>
      </div>
      {columnBody && (
        <div className="case-section-container">
          <p
            className={
              dark
                ? "case-section-body case-light"
                : "case-section-body case-dark"
            }
          >
            {columnBody}
          </p>
        </div>
      )}
    </div>
  );
}
