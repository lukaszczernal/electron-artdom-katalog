import { ipcRenderer as nodeEventBus } from "electron";
import { useState } from "react";
import { BROWSER_EVENTS as EVENTS } from "../events";
import { Page } from "../models";
import useEvent from './useEvent';
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

  useEvent<Page[]>(EVENTS.PAGES_FETCH_SUCCESS, (_, pages) => setData(pages));
  useEvent(EVENTS.PAGE_REFRESH_SUCCESS, () => setData((data) => [...data]));
  useEvent<string>(EVENTS.PAGE_EDIT_SUCCESS, (_, filename) => refreshPage(filename));
  useEvent(EVENTS.PAGE_UPDATE_SUCCESS, fetchPages);
  useEvent(EVENTS.PAGES_SAVE_SUCCESS, fetchPages);
  useEvent(EVENTS.PAGE_DELETE_SUCCESS, fetchPages);
  useEvent(EVENTS.ENV_REGISTER_SUCCESS, fetchPages);

  return { fetchPages, data, editPage, savePages, removePage };
};

export default usePages;
