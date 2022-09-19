export interface Page {
  svg: {
    dir: string;
    file: string;
    path: string;
  };
  status: "enable" | "disable";
  refresh?: boolean;
  keywords?: string[];
}

export interface FileInfo {
  path: string;
  name: string;
}
