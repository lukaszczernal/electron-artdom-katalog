import { ItemInterface } from "react-sortablejs";

export interface Page extends ItemInterface {
  svg: {
    file: string;
  };
  status: "enable" | "disable";
  refresh?: boolean;
  keywords?: string[];
}

export interface FileInfo {
  path: string;
  name: string;
}

export type EventError = string | null;

export interface HazelResponse {
  name: string;
  notes: string;
  pub_date: string;
  url: string;
}
