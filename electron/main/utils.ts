import { BROWSER_EVENTS } from "../../src/events";
import { EventType, EventReply } from "../../src/models/redux";

export const reduxEvent = <T extends BROWSER_EVENTS, P extends any>(
  action: EventType<T, P>
): EventReply<T, P> => {
  return [BROWSER_EVENTS.EVENTS_CHANNEL, action] as const;
};
