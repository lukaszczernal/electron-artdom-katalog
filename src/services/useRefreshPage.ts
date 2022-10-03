import { ipcRenderer as nodeEventBus, IpcRendererEvent } from "electron";
import { useEffect, useState } from "react";
import { BROWSER_EVENTS as EVENTS } from "../events";

export const usePages = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshPage = (filename: string) => {
    setIsLoading(true);
    nodeEventBus.send(EVENTS.PAGE_REFRESH, filename);
  };

  useEffect(() => {
    const callback = (_: IpcRendererEvent) => setIsLoading(false);
    nodeEventBus.on(EVENTS.PAGE_REFRESH_SUCCESS, callback);
    return () => {
      nodeEventBus.removeListener(EVENTS.PAGE_REFRESH_SUCCESS, callback);
    };
  }, []);


  return { refreshPage, isLoading };
};

export default usePages;
