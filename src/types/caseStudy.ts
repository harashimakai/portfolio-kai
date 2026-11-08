export interface StudyCard {
  title: string;
  date: string;
  context: string;
  thumbnailUrl: string;
  video?: string;
  subheading: string;
  slug: string;
}

export interface Hero {
  subtitle: string;
  video?: string;
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
  logo?: string;
  image?: string;
}
export interface Column {
  id: string;
  title: string;
  body?: string;
  lines?: Item[];
}
export interface ImageItem {
  id: string;
  asset: string;
  alt: string;
  caption: string;
}
export interface Entry {
  id: string;
  title: string;
  body: string;
}
export interface FigureItem {
  id: string;
  asset: string;
  alt: string;
  label: string;
  pros?: Item[];
  cons?: Item[];
}
export interface Stat {
  id: string;
  value: string;
  label: string;
}
export interface OptionItem {
  id: string;
  asset: string;
  title: string;
  pros: Item[];
  cons: Item[];
  chosen?: boolean;
}
export type Block =
  | { id: string; type: "statement"; text: string; small?: boolean }
  | { id: string; type: "body"; text: string }
  | { id: string; type: "kicker"; text: string }
  | { id: string; type: "subheading"; text: string; logo?: string }
  | { id: string; type: "columns"; items: Column[] }
  | { id: string; type: "bullets"; items: Item[] }
  | { id: string; type: "cards"; items: Card[] }
  | { id: string; type: "takeaways"; items: Entry[] }
  | { id: string; type: "figures"; sequence?: boolean; items: FigureItem[] }
  | { id: string; type: "video"; asset: string; caption: string }
  | { id: string; type: "divider" }
  | { id: string; type: "stats"; items: Stat[] }
  | { id: string; type: "steps"; items: Entry[] }
  | { id: string; type: "callout"; label: string; text: string }
  | { id: string; type: "quotes"; items: Item[] }
  | {
      id: string;
      type: "decision";
      title: string;
      problem: string;
      solution: string;
      asset: string;
    }
  | { id: string; type: "options"; items: OptionItem[] }
  | { id: string; type: "image"; asset: string; alt: string; caption: string }
  | { id: string; type: "images"; items: ImageItem[] }
  | { id: string; type: "prompts"; label: string; items: Item[] }
  | {
      id: string;
      type: "annotated";
      asset: string;
      alt: string;
      items: Card[];
    };
export interface Section {
  id: string;
  label?: string;
  aside?: string;
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
}
