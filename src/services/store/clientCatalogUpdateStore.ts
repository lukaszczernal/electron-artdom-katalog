import { ipcRenderer as nodeEventBus } from "electron";
import { BROWSER_EVENTS } from "@/events";
import { Page } from "@/models";
import { createSlice } from "@reduxjs/toolkit";
import { ACTIONS } from "./actions";
import { getDefaultState } from "./utils";

export const clientCatalogUpdateStore = createSlice({
  name: BROWSER_EVENTS.CLIENT_CATALOG_UPDATE,
  initialState: getDefaultState([] as Page[]),
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(ACTIONS.CLIENT_CATALOG_UPDATE, (state, { type, payload }) => {
        nodeEventBus.send(type, payload);
        state.isLoading = true;
        delete state.error;
      })
      .addCase(ACTIONS.CLIENT_CATALOG_UPDATE_SUCCESS, (state) => {
        state.isLoading = false;
      })
      .addCase(ACTIONS.CLIENT_CATALOG_UPDATE_FAIL, (state, { payload }) => {
        (state.error = payload), (state.isLoading = false);
      }),
});
