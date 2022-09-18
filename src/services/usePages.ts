import { ipcRenderer as nodeEventBus, IpcRendererEvent } from "electron";
import { useEffect, useState } from "react";
import { BROWSER_EVENTS as EVENTS } from "../../electron/events";
import { Page } from "../../electron/models";

export const usePages = () => {
  const [data, setData] = useState<Page[]>([]);

  const request = () => {
    nodeEventBus.send(EVENTS.PAGES_FETCH);
  };

  const refreshPage = (filename: string) => {
    nodeEventBus.send(EVENTS.PAGES_REFRESH, filename);
  };

  const editPage = (filePath: string) => {
    nodeEventBus.send(EVENTS.PAGES_EDIT, filePath);
  };

  useEffect(() => {
    const callback = (_: IpcRendererEvent, pages: Page[]) => setData(pages);
    nodeEventBus.on(EVENTS.PAGES_FETCH_SUCCESS, callback);
    return () => {
      nodeEventBus.removeListener(EVENTS.PAGES_FETCH_SUCCESS, callback);
    };
  }, []);

  useEffect(() => {
    const callback = (_: IpcRendererEvent) => {
      setData((data) => [...data]);
    };
    nodeEventBus.on(EVENTS.PAGES_REFRESH_SUCCESS, callback);
    nodeEventBus.on(EVENTS.PAGES_EDIT_SUCCESS, callback);
    return () => {
      nodeEventBus.removeListener(EVENTS.PAGES_REFRESH_SUCCESS, callback);
      nodeEventBus.removeListener(EVENTS.PAGES_EDIT_SUCCESS, callback);
    };
  }, []);

  return { request, data, refreshPage, editPage };
};

export default usePages;
