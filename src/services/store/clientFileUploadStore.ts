import { ipcRenderer as nodeEventBus } from "electron";
import { BROWSER_EVENTS } from "@/events";
import { createSlice } from "@reduxjs/toolkit";
import { AsyncStatus } from "@/models/store";
import { ACTIONS } from "./actions";

interface ClientFileUploadState {
  status: { [id: string]: AsyncStatus };
}

const initialState: ClientFileUploadState = { status: {} };

export const clientFileUploadStore = createSlice({
  name: BROWSER_EVENTS.CLIENT_FILE_UPLOAD,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(
        ACTIONS.CLIENT_FILE_UPLOAD,
        (state, { type, payload }) => {
          nodeEventBus.send(type, payload);
          state.status[payload] = AsyncStatus.LOADING;
        }
      )
      .addCase(
        ACTIONS.CLIENT_FILE_UPLOAD_ALL,
        (state, { type, payload: pageIds }) => {
          nodeEventBus.send(type, pageIds);
          pageIds.forEach((pageId) => {
            state.status[pageId] = AsyncStatus.LOADING;
          });
        }
      )
      .addCase(ACTIONS.CLIENT_FILE_UPLOAD_SUCCESS, (state, { payload }) => {
        state.status[payload] = AsyncStatus.FINISHED;
      })
      .addCase(ACTIONS.CLIENT_FILE_UPLOAD_FAIL, (state, { payload }) => {
        state.status[payload] = AsyncStatus.FAILED;
      }),
});
