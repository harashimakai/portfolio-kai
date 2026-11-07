export interface StudyCard {
  title: string;
  date: string;
  context: string;
  thumbnailUrl: string;
  subheading: string;
  slug: string;
}

export interface Hero {
  subtitle: string;
  meta: { label: string; lines: string[] }[];
}
export interface Item {
  id: string;
  text: string;
}
export interface Card {
  id: string;
  title: string;
  lines: Item[];
}
export interface Takeaway {
  id: string;
  title: string;
  body: string;
}
export interface FigureItem {
  id: string;
  asset: string;
  alt: string;
  label: string;
  note: string;
}
export type Block =
  | { id: string; type: "statement"; text: string; small?: boolean }
  | { id: string; type: "body"; text: string }
  | { id: string; type: "kicker"; text: string }
  | { id: string; type: "bullets"; items: Item[] }
  | { id: string; type: "cards"; items: Card[] }
  | { id: string; type: "takeaways"; items: Takeaway[] }
  | {
      id: string;
      type: "figures";
      sequence?: boolean;
      items: FigureItem[];
    }
  | { id: string; type: "video"; asset: string; caption: string }
  | { id: string; type: "divider" };
export interface Section {
  id: string;
  label?: string;
  blocks: Block[];
}
export interface StudyContent {
  hero: Hero;
  sections: Section[];
  nextId: number;
}

export interface Asset {
  src: string;
  poster?: string;
}

export interface StudyDef {
  slug: string;
  title: string;
  path?: string;
  content: StudyContent;
  assets: Record<string, Asset>;
  logoSvg: string;
  card: Omit<StudyCard, "title" | "slug">;
  featured?: boolean;
}
