import { BROWSER_EVENTS } from "@/events";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getDefaultReducers, getDefaultState } from "./utils";

export const downloadStore = createSlice({
  name: BROWSER_EVENTS.APP_DOWNLOAD,
  initialState: getDefaultState(),
  reducers: {
    ...getDefaultReducers(),
    STATUS: (state, { payload: data }: PayloadAction<string>) => {
      return { ...state, data };
    },
    PROGRESS: (state, { payload: data }: PayloadAction<number>) => {
      return { ...state, data };
    },
  },
});
