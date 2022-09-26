import { ipcRenderer as nodeEventBus, IpcRendererEvent } from "electron";
import { useEffect, useState } from "react";
import { BROWSER_EVENTS as EVENTS } from "../../electron/events";

export const useGenerateCatalog = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const generate = () => {
    setIsLoading(true);
    nodeEventBus.send(EVENTS.PDF_GENERATE);
  };

  useEffect(() => {
    const callback = (_: IpcRendererEvent) => {
      setIsLoading(false);
    };
    nodeEventBus.on(EVENTS.PDF_GENERATE_SUCCESS, callback);
    nodeEventBus.on(EVENTS.PDF_GENERATE_FAIL, callback);
    return () => {
      nodeEventBus.removeListener(EVENTS.PDF_GENERATE_SUCCESS, callback);
      nodeEventBus.removeListener(EVENTS.PDF_GENERATE_FAIL, callback);
    };
  }, []);

  return { generate, isLoading };
};

export default useGenerateCatalog;
