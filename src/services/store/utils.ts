import { ipcRenderer as nodeEventBus } from "electron";
import { PayloadAction } from "@reduxjs/toolkit";
import { AsyncState } from "@/models/redux";

export const getDefaultReducers = <RESPONSE, REQUEST = void>() => ({
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
});

export const getDefaultState = <DATA extends any>(
  data?: DATA
): AsyncState<DATA> => ({
  data,
  isLoading: false,
});
