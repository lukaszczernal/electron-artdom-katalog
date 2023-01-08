import { ItemInterface } from "react-sortablejs";

export enum PageStatus {
  enable = "enable",
  disable = "disable",
}

export interface Page extends ItemInterface {
  id: string,
  svg: {
    file: string;
  };
  status: PageStatus;
  refresh?: boolean;
  keywords?: string[];
  version?: number;
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

export type EnvInfo = {
  sourcePath: string,
  resourcePath: string,
}
