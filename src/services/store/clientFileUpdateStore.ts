import { ipcRenderer as nodeEventBus } from "electron";
import { BROWSER_EVENTS } from "@/events";
import { createSlice } from "@reduxjs/toolkit";
import { AsyncStatus } from "@/models/store";
import { ACTIONS } from "./actions";

interface ClientFileUploadState {
  status: { [id: string]: AsyncStatus };
}

const initialState: ClientFileUploadState = { status: {} };

export const clientFileUpdateStore = createSlice({
  name: BROWSER_EVENTS.CLIENT_FILE_UPDATE,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(ACTIONS.CLIENT_FILE_UPDATE, (state, { type, payload }) => {
        nodeEventBus.send(type, payload);
        state.status[payload.fileId] = AsyncStatus.LOADING;
      })
      .addCase(ACTIONS.CLIENT_FILE_UPDATE_LOADING, (state, { payload }) => {
        state.status[payload] = AsyncStatus.LOADING;
      })
      .addCase(ACTIONS.CLIENT_FILE_UPDATE_CLEAR, (state) => {
        state.status = {}
      })
      .addCase(ACTIONS.CLIENT_FILE_UPDATE_SUCCESS, (state, { payload }) => {
        state.status[payload] = AsyncStatus.FINISHED;
      })
      .addCase(ACTIONS.CLIENT_FILE_UPDATE_FAIL, (state, { payload }) => {
        state.status[payload] = AsyncStatus.FAILED;
      }),
});
