import { useState } from "react";
import { BROWSER_EVENTS as EVENTS } from "../events";
import useEvent from "./useEvent";
import { EventPayload } from "@/models/redux";
import { useAppDispatch } from "./redux";

const useEventHandler = () => {
  const dispatch = useAppDispatch();
  const [lastEvent, setLastEvent] = useState<EventPayload>();

  useEvent<EventPayload>(EVENTS.EVENTS_CHANNEL, (_, event) => {
    dispatch(event);
    setLastEvent(event);
  });

  return { lastEvent };
};

export default useEventHandler;
