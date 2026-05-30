import CaseList from "./CaseList";

interface Props {
  list: object[];
  listTitle: string;
  elemTitle: string;
  dark?: boolean;
}

export default function CaseTriad({
  list,
  listTitle,
  elemTitle,
  dark = false,
}: Props) {
  return (
    <div className="case-triad-cards">
      {list.map((card, index) => (
        <div
          className={dark ? "case-triad-card-dark" : "case-triad-card-light"}
          key={index}
        >
          <div className="case-triad-title">
            {card[listTitle as keyof typeof card] as string}
          </div>
          <CaseList
            bullets={
              card[elemTitle as keyof typeof card] as unknown as string[]
            }
          />
        </div>
      ))}
    </div>
  );
}
