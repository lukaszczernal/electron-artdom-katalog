import { BROWSER_EVENTS } from "../../src/events";
import { EventPayload } from "../../src/models/redux";

type EventReply = [typeof BROWSER_EVENTS.EVENTS_CHANNEL, EventPayload];

export const reduxEvent = (type: BROWSER_EVENTS, payload?: any): EventReply => [
  BROWSER_EVENTS.EVENTS_CHANNEL,
  {
    type,
    payload,
  } as EventPayload,
];
