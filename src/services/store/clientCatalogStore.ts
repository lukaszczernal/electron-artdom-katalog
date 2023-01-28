import { ipcRenderer as nodeEventBus } from "electron";
import { BROWSER_EVENTS } from "@/events";
import { Page } from "@/models";
import { createSlice } from "@reduxjs/toolkit";
import { ACTIONS } from "./actions";
import { getDefaultState } from "./utils";

export const clientCatalogStore = createSlice({
  name: BROWSER_EVENTS.CLIENT_CATALOG,
  initialState: getDefaultState([] as Page[]),
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(ACTIONS.CLIENT_CATALOG, (state, { type, payload }) => {
        nodeEventBus.send(type, payload);
        state.isLoading = true;
      })
      .addCase(ACTIONS.CLIENT_CATALOG_SUCCESS, (state, { payload }) => {
        (state.data = payload), (state.isLoading = false);
      })
      .addCase(ACTIONS.CLIENT_CATALOG_FAIL, (state, { payload }) => {
        (state.error = payload), (state.isLoading = false);
      }),
});
