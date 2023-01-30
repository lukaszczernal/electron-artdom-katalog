export type DownloadStatus =
  | "interrupted"
  | "completed"
  | "cancelled"
  | "progressing"
  | "paused";

  export enum AsyncStatus {
    IDLE = 'idle',
    LOADING = 'loading',
    FINISHED = 'finished',
    FAILED = 'failed',
  }
