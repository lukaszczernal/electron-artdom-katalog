import { ipcRenderer as nodeEventBus, IpcRendererEvent } from "electron";
import { Page } from "@/models";
import { useEffect, useState } from "react";
import { BROWSER_EVENTS as EVENTS } from "../events";

export const useUpdatePage = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  const updatePage = (page: Page) => {
    setIsUpdating(true);
    nodeEventBus.send(EVENTS.PAGE_UPDATE, page);
  };

  useEffect(() => {
    const callback = (_: IpcRendererEvent) => setIsUpdating(false);
    nodeEventBus.on(EVENTS.PAGE_UPDATE_SUCCESS, callback);
    nodeEventBus.on(EVENTS.PAGE_UPDATE_FAIL, callback);
    return () => {
      nodeEventBus.removeListener(EVENTS.PAGE_UPDATE_SUCCESS, callback);
      nodeEventBus.removeListener(EVENTS.PAGE_UPDATE_FAIL, callback);
    };
  }, []);

  return { isUpdating, updatePage };
};

export default useUpdatePage;
