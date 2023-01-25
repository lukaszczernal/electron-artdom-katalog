export type DownloadStatus =
  | "interrupted"
  | "completed"
  | "cancelled"
  | "progressing"
  | "paused";

  export enum AsyncStatus {
    LOADING = 'loading',
    FINISHED = 'finished',
    FAILED = 'failed',
  }
