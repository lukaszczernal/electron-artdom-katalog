import { Page } from "@/models";
import { ipcRenderer as nodeEventBus } from "electron";
import { useState } from "react";
import { BROWSER_EVENTS as EVENTS } from "../events";
import useEvent from "./useEvent";

export const useRefreshPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAllLoading, setIsAllLoading] = useState<boolean>(false);

  const refreshPage = (filename: string) => {
    setIsLoading(true);
    nodeEventBus.send(EVENTS.PAGE_REFRESH, filename);
  };

  const refreshAll = (pages: Page[]) => {
    setIsAllLoading(true);
    nodeEventBus.send(EVENTS.PAGE_REFRESH_ALL, pages);
  }

  useEvent(EVENTS.PAGE_REFRESH_SUCCESS, () => setIsLoading(false));
  useEvent(EVENTS.PAGE_REFRESH_ALL_SUCCESS, () => setIsAllLoading(false));


  return { refreshPage, isLoading, refreshAll, isAllLoading };
};

export default useRefreshPage;
