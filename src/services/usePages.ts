import { ipcRenderer as nodeEventBus, IpcRendererEvent } from "electron";
import { useEffect, useState } from "react";
import { BROWSER_EVENTS as EVENTS } from "../events";
import { Page } from "../models";
import useRefreshPage from "./useRefreshPage";

export const usePages = () => {
  const [data, setData] = useState<Page[]>([]);
  const { refreshPage } = useRefreshPage();

  const fetchPages = () => {
    nodeEventBus.send(EVENTS.PAGES_FETCH);
  };

  const savePages = (pages: Page[]) => {
    nodeEventBus.send(EVENTS.PAGES_SAVE, pages);
  };

  const editPage = (filename: string) => {
    nodeEventBus.send(EVENTS.PAGE_EDIT, filename);
  };

  const removePage = (filename?: string | null) => {
    if (!filename) return;
    nodeEventBus.send(EVENTS.PAGE_DELETE, filename);
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
    nodeEventBus.on(EVENTS.PAGE_DELETE_SUCCESS, callback);
    return () => {
      nodeEventBus.removeListener(EVENTS.PAGE_UPDATE_SUCCESS, callback);
      nodeEventBus.removeListener(EVENTS.PAGES_SAVE_SUCCESS, callback);
      nodeEventBus.removeListener(EVENTS.PAGE_DELETE_SUCCESS, callback);
    };
  }, []);

  useEffect(() => {
    const callback = (_: IpcRendererEvent) => fetchPages();
    nodeEventBus.on(EVENTS.ENV_REGISTER_SUCCESS, callback);
    return () => {
      nodeEventBus.removeListener(EVENTS.ENV_REGISTER_SUCCESS, callback);
    };
  }, []);

  return { fetchPages, data, editPage, savePages, removePage };
};

export default usePages;
