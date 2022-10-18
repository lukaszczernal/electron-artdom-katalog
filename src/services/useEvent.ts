import { useEffect } from "react";
import { ipcRenderer as nodeEventBus, IpcRendererEvent } from "electron";
import { BROWSER_EVENTS as EVENTS } from "../events";

type EventCallback<P> = (_: IpcRendererEvent, payload: P) => void;

const useEvent = <P extends any>(event: EVENTS, callback: EventCallback<P>) => {
  useEffect(() => {
    nodeEventBus.on(event, callback);
    return () => {
      nodeEventBus.removeListener(event, callback);
    };
  }, []);
};

export default useEvent;
