import { ipcRenderer as nodeEventBus } from "electron";
import { BROWSER_EVENTS } from "@/events";
import { createSlice } from "@reduxjs/toolkit";
import { AsyncStatus } from "@/models/store";
import { ACTIONS } from "./actions";

interface PdfGenerateState {
  status?: AsyncStatus;
}

const initialState: PdfGenerateState = {};

export const pdfGenerateStore = createSlice({
  name: BROWSER_EVENTS.PDF_GENERATE,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(ACTIONS.PDF_GENERATE, (state, { type }) => {
        nodeEventBus.send(type);
        state.status = AsyncStatus.LOADING;
      })
      .addCase(ACTIONS.PDF_GENERATE_SUCCESS, (state) => {
        state.status = AsyncStatus.FINISHED;
      })
      .addCase(ACTIONS.PDF_GENERATE_FAIL, (state) => {
        state.status = AsyncStatus.FAILED;
      }),
});
