import { ipcRenderer as nodeEventBus, IpcRendererEvent } from "electron";
import { useEffect, useState } from "react";
import { BROWSER_EVENTS as EVENTS } from "../../electron/events";
import { Page } from "../../electron/models";

export const usePages = () => {
  const [data, setData] = useState<Page[]>([]);

  const fetchPages = () => {
    nodeEventBus.send(EVENTS.PAGES_FETCH);
  };

  const savePages = (pages: Page[]) => {
    nodeEventBus.send(EVENTS.PAGES_SAVE, pages);
  };

  const refreshPage = (filename: string) => {
    nodeEventBus.send(EVENTS.PAGE_REFRESH, filename);
  };

  const editPage = (filename: string) => {
    nodeEventBus.send(EVENTS.PAGE_EDIT, filename);
  };

  useEffect(() => {
    const callback = (_: IpcRendererEvent, pages: Page[]) => setData(pages);
    nodeEventBus.on(EVENTS.PAGES_FETCH_SUCCESS, callback);
    return () => {
      nodeEventBus.removeListener(EVENTS.PAGES_FETCH_SUCCESS, callback);
    };
  }, []);

  useEffect(() => {
    const callback = (_: IpcRendererEvent) => setData((data) => [...data]);
    nodeEventBus.on(EVENTS.PAGE_REFRESH_SUCCESS, callback);
    return () => {
      nodeEventBus.removeListener(EVENTS.PAGE_REFRESH_SUCCESS, callback);
    };
  }, []);

  useEffect(() => {
    const callback = (_: IpcRendererEvent, filename: string) =>
      refreshPage(filename);
    nodeEventBus.on(EVENTS.PAGE_EDIT_SUCCESS, callback);
    return () => {
      nodeEventBus.removeListener(EVENTS.PAGE_EDIT_SUCCESS, callback);
    };
  }, []);

  useEffect(() => {
    const callback = (_: IpcRendererEvent) => fetchPages();
    nodeEventBus.on(EVENTS.PAGE_UPDATE_SUCCESS, callback);
    nodeEventBus.on(EVENTS.PAGES_SAVE_SUCCESS, callback);
    return () => {
      nodeEventBus.removeListener(EVENTS.PAGE_UPDATE_SUCCESS, callback);
      nodeEventBus.removeListener(EVENTS.PAGES_SAVE_SUCCESS, callback);
    };
  }, []);

  useEffect(() => {
    const callback = (_: IpcRendererEvent) => fetchPages();
    nodeEventBus.on(EVENTS.ENV_REGISTER_SUCCESS, callback);
    return () => {
      nodeEventBus.removeListener(EVENTS.ENV_REGISTER_SUCCESS, callback);
    };
  }, []);

  return { fetchPages, data, refreshPage, editPage, savePages };
};

export default usePages;
