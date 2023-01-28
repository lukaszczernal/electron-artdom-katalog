import { ipcRenderer as nodeEventBus } from "electron";
import { BROWSER_EVENTS } from "@/events";
import { createSlice } from "@reduxjs/toolkit";
import { AsyncStatus } from "@/models/store";
import { ACTIONS } from "./actions";

interface ClientFileRemoveState {
  status: { [id: string]: AsyncStatus };
}

const initialState: ClientFileRemoveState = { status: {} };

export const clientFileRemoveStore = createSlice({
  name: BROWSER_EVENTS.CLIENT_FILE_REMOVE,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(ACTIONS.CLIENT_FILE_REMOVE, (state, { type, payload }) => {
        nodeEventBus.send(type, payload);
        state.status[payload] = AsyncStatus.LOADING;
      })
      .addCase(ACTIONS.CLIENT_FILE_REMOVE_SUCCESS, (state, { payload }) => {
        state.status[payload] = AsyncStatus.FINISHED;
      })
      .addCase(ACTIONS.CLIENT_FILE_REMOVE_FAIL, (state, { payload }) => {
        state.status[payload] = AsyncStatus.FAILED;
      }),
});
