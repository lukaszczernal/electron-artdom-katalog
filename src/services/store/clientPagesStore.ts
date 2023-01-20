import { ipcRenderer as nodeEventBus } from "electron";
import { BROWSER_EVENTS } from "@/events";
import { Page } from "@/models";
import { createSlice, PayloadAction, } from "@reduxjs/toolkit";
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
    SUCCESS: (_state, action: PayloadAction<RESPONSE>) => ({
      data: action.payload,
      isLoading: false,
    }),
    FAIL: (state, { payload: error }: PayloadAction<string>) => ({
      ...state,
      isLoading: false,
      error,
    }),
  },
});

export const clientPagesStore = createSlice(
  createAsyncSliceConfig<Page[]>(BROWSER_EVENTS.CLIENT_PAGES)
);
