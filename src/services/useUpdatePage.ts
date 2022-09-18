import { ipcRenderer as nodeEventBus, IpcRendererEvent } from "electron";
import { Page } from "electron/models";
import { useEffect, useState } from "react";
import { BROWSER_EVENTS as EVENTS } from "../../electron/events";

export const useUpdatePage = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  const updatePage = (page: Page) => {
    setIsUpdating(true);
    nodeEventBus.send(EVENTS.PAGES_UPDATE, page);
  };

  useEffect(() => {
    const callback = (_: IpcRendererEvent) => setIsUpdating(false);
    nodeEventBus.on(EVENTS.PAGES_UPDATE_SUCCESS, callback);
    nodeEventBus.on(EVENTS.PAGES_UPDATE_FAIL, callback);
    return () => {
      nodeEventBus.removeListener(EVENTS.PAGES_UPDATE_SUCCESS, callback);
      nodeEventBus.removeListener(EVENTS.PAGES_UPDATE_FAIL, callback);
    };
  }, []);

  return { isUpdating, updatePage };
};

export default useUpdatePage;
