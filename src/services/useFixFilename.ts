import { ipcRenderer as nodeEventBus, IpcRendererEvent } from "electron";
import { useEffect, useState } from "react";
import { BROWSER_EVENTS as EVENTS } from "../events";

export const useFixFilename = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  const fixFilename = (pageId: string | null) => {
    if (!pageId) {
      nodeEventBus.send(EVENTS.PAGE_FILENAME_FIX_FAIL, "No pageId selected");
      return;
    }

    setIsUpdating(true);
    nodeEventBus.send(EVENTS.PAGE_FILENAME_FIX, pageId);
  };

  useEffect(() => {
    const callback = (_: IpcRendererEvent) => setIsUpdating(false);
    nodeEventBus.on(EVENTS.PAGE_FILENAME_FIX_SUCCESS, callback);
    nodeEventBus.on(EVENTS.PAGE_FILENAME_FIX_FAIL, callback);
    return () => {
      nodeEventBus.removeListener(EVENTS.PAGE_FILENAME_FIX_SUCCESS, callback);
      nodeEventBus.removeListener(EVENTS.PAGE_FILENAME_FIX_FAIL, callback);
    };
  }, []);

  return { isUpdating, fixFilename };
};

export default useFixFilename;
