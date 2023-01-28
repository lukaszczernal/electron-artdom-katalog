import { ipcRenderer as nodeEventBus } from "electron";
import { BROWSER_EVENTS } from "@/events";
import { createSlice } from "@reduxjs/toolkit";
import { getDefaultState } from "./utils";
import { AsyncState } from "@/models/redux";
import { ACTIONS } from "./actions";

// TODO make state support multiple download actions simultaneously
interface OwnState extends AsyncState<void> {
  status?: string; // TODO definie status
  progress?: number;
}

const initialState: OwnState = {
  ...getDefaultState(),
};

export const downloadStore = createSlice({
  name: BROWSER_EVENTS.APP_DOWNLOAD,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(ACTIONS.APP_DOWNLOAD, (state, { type, payload }) => {
        nodeEventBus.send(type, payload);
        state.isLoading = true;
      })
      .addCase(ACTIONS.APP_DOWNLOAD_STATUS, (state, { payload }) => {
        state.status = payload;
      })
      .addCase(ACTIONS.APP_DOWNLOAD_PROGRESS, (state, { payload }) => {
        state.progress = payload;
      })
      .addCase(ACTIONS.APP_DOWNLOAD_SUCCESS, (state) => {
        state.isLoading = false;
      })
      .addCase(ACTIONS.APP_DOWNLOAD_FAIL, (state) => {
        state.isLoading = false;
      }),
});
