import { useState } from "react";
import { PayloadAction } from '@reduxjs/toolkit';
import { BROWSER_EVENTS as EVENTS } from "../events";
import useEvent from "./useEvent";
import { useAppDispatch } from "./redux";

const useEventHandler = () => {
  const dispatch = useAppDispatch();
  const [lastEvent, setLastEvent] = useState<PayloadAction>();

  useEvent<PayloadAction>(EVENTS.EVENTS_CHANNEL, (_, event) => {
    dispatch(event);
    setLastEvent(event);
  });

  return { lastEvent };
};

export default useEventHandler;
