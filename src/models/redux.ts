import { BROWSER_EVENTS } from "../events";

export type AsyncState<DATA> = {
  data?: DATA;
  isLoading: boolean;
  error?: string;
};

export type EventType<T extends BROWSER_EVENTS, P extends any> = {
  type: T;
  payload: P;
};

export type EventReply<T extends BROWSER_EVENTS, P extends any> = readonly [
  typeof BROWSER_EVENTS.EVENTS_CHANNEL,
  EventType<T, P>
];
