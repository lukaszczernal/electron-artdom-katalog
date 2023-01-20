import { PayloadAction } from '@reduxjs/toolkit';
import { BROWSER_EVENTS } from '../events';

export type EventPayload = PayloadAction<any, BROWSER_EVENTS>;

export type AsyncState<DATA> = {
  data?: DATA;
  isLoading: boolean;
  error?: string;
}
