enum PageStatus {
  READY = "ready",
  REFRESH = "refresh",
}

enum PageVisibility {
  READY = "ready",
  REFRESH = "refresh",
}

export interface Page {
  svg: {
    dir: string;
    file: string;
    path: string;
  };
  status?: PageStatus;
  visibility?: PageVisibility;
  keywords?: string[];
}
