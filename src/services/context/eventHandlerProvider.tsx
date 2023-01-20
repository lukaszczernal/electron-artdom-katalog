import React from "react";
import useEventHandler from "../useEventHandler";

type EventHanlderModel = ReturnType<typeof useEventHandler>;

interface Props {
  children: React.ReactElement;
}

export const EventHandlerContext = React.createContext<
  EventHanlderModel | undefined
>(undefined);

const EventHandlerProvider: React.FC<Props> = ({ children }) => {
  const eventHandlerService = useEventHandler();

  return (
    <EventHandlerContext.Provider value={eventHandlerService}>
      {children}
    </EventHandlerContext.Provider>
  );
};

export default EventHandlerProvider;
