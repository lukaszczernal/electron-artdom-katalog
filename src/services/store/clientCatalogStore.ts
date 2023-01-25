import { BROWSER_EVENTS } from "@/events";
import { Page } from "@/models";
import { createSlice } from "@reduxjs/toolkit";
import { getDefaultReducers, getDefaultState } from "./utils";

export const clientCatalogStore = createSlice({
  name: BROWSER_EVENTS.CLIENT_CATALOG,
  initialState: getDefaultState([] as Page[]),
  reducers: {
    ...getDefaultReducers<Page[]>(),
  },
});
