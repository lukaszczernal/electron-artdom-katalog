import { ipcRenderer as nodeEventBus, IpcRendererEvent } from "electron";
import { useEffect, useState } from 'react';
import { BROWSER_EVENTS as EVENTS } from "../events";

export const useUpdateCheck = () => {
  const [feedURL, setFeedURL] = useState<string>('');

  const checkUpdates = () => {
    nodeEventBus.send(EVENTS.APP_CHECK_UPDATES);
  };

  useEffect(() => {
    const callback = (_: IpcRendererEvent, updateURL) => setFeedURL(updateURL);
    nodeEventBus.on(EVENTS.APP_CHECK_UPDATES_SUCCESS, callback);
    return () => {
      nodeEventBus.removeListener(EVENTS.APP_CHECK_UPDATES_SUCCESS, callback);
    };
  }, []);

  return { checkUpdates, feedURL };
};

export default useUpdateCheck;
