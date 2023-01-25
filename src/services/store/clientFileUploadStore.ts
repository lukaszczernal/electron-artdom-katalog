import { ipcRenderer as nodeEventBus } from "electron";
import { BROWSER_EVENTS } from "@/events";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AsyncStatus } from "@/models/store";

interface ClientFileUploadState {
  status: { [id: string]: AsyncStatus };
}

type fileId = string;

const initialState: ClientFileUploadState = { status: {} };

export const clientFileUploadStore = createSlice({
  name: BROWSER_EVENTS.CLIENT_FILE_UPLOAD,
  initialState,
  reducers: {
    TRIGGER: ({status, ...state}, { type, payload }: PayloadAction<fileId>) => {
      nodeEventBus.send(type, payload);
      return {
        ...state,
        status: { ...status, [payload]: AsyncStatus.LOADING },
      };
    },
    SUCCESS: ({status, ...state}, { payload }: PayloadAction<fileId>) => ({
      ...state,
      status: {...status, [payload]: AsyncStatus.FINISHED,
    }
    }),
    FAIL: ({status, ...state}, { payload }: PayloadAction<fileId>) => ({
      ...state,
      status: {...status, [payload]: AsyncStatus.FAILED},
    }),
  },
});
