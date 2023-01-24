import { BROWSER_EVENTS } from "@/events";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getDefaultReducers, getDefaultState } from "./utils";
import { AsyncState } from "@/models/redux";

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
  reducers: {
    ...getDefaultReducers<void, string>(),
    STATUS: (state, { payload: status }: PayloadAction<string>) => {
      return { ...state, status };
    },
    PROGRESS: (state, { payload: progress }: PayloadAction<number>) => {
      return { ...state, progress };
    },
  },
});
