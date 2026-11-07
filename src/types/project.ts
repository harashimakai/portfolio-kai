export interface Project {
  id: string;
  title: string;
  shortTitle?: string;
  medium: string;
  year: string;
  shortDescription: string;
  fullDescription?: string;
  thumbnailUrl: string;
  expandedUrl?: string;
  imagePos?: string;
  extra?: boolean;
}
