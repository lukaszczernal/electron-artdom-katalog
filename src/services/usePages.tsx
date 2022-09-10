import { ipcRenderer as nodeEventBus, IpcRendererEvent } from "electron";
import { useEffect, useState } from "react";
import { BROWSER_EVENTS as EVENTS } from "../../electron/events";

interface Page {
  svg: {
    dir: string;
    file: string;
    path: string,
  },
  status: 'enabled' | 'disabled',
};

export const usePages = () => {
  const [data, setData] = useState<Page[]>();

  const request = () => {
    nodeEventBus.send(EVENTS.PAGES_FETCH);
  };

  const refreshPage = (filename: string) => {
    nodeEventBus.send(EVENTS.PAGES_REFRESH, filename)
  }

  useEffect(() => {
    const callback = (_: IpcRendererEvent, pages: Page[]) => setData(pages);
    nodeEventBus.on(EVENTS.PAGES_FETCH_SUCCESS, callback);
    () => nodeEventBus.removeListener(EVENTS.PAGES_FETCH_SUCCESS, callback);
  }, []);

  return { request, data, refreshPage };
};

export default usePages;
