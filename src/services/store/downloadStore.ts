import { ipcRenderer as nodeEventBus } from "electron";
import { BROWSER_EVENTS } from "@/events";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AsyncState } from "@/models/redux";

const getInitialState = <DATA>(): AsyncState<DATA> => ({
  isLoading: false,
});

const createAsyncSliceConfig = <RESPONSE, REQUEST = void>(
  name: BROWSER_EVENTS
) => ({
  name,
  initialState: getInitialState<RESPONSE>(),
  reducers: {
    FETCH: (state, action: PayloadAction<REQUEST>) => {
      nodeEventBus.send(action.type, action.payload);
      return { ...state, isLoading: true };
    },
    SUCCESS: (_state, action: PayloadAction<RESPONSE>) => {
      return {
        data: action.payload,
        isLoading: false,
      };
    },
    FAIL: (state, { payload: error }: PayloadAction<string>) => {
      return {
        ...state,
        isLoading: false,
        error,
      };
    },
    // TODO add download status typings
    STATUS: (state, { payload: data }: PayloadAction<string>) => {
      return { ...state, data };
    },
    PROGRESS: (state, { payload: data }: PayloadAction<number>) => {
      return { ...state, data };
    },
  },
});

export const downloadStore = createSlice(
  createAsyncSliceConfig(BROWSER_EVENTS.APP_DOWNLOAD)
);
