import { BROWSER_EVENTS } from "@/events";
import { Page } from "@/models";
import { createSlice } from "@reduxjs/toolkit";
import { getDefaultReducers, getDefaultState } from "./utils";

export const clientPagesStore = createSlice({
  name: BROWSER_EVENTS.CLIENT_PAGES,
  initialState: getDefaultState([] as Page[]),
  reducers: {
    ...getDefaultReducers<Page[]>(),
  },
});
