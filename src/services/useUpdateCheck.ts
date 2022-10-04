import { ipcRenderer as nodeEventBus, IpcRendererEvent } from "electron";
import { useEffect, useState } from "react";
import { BROWSER_EVENTS as EVENTS } from "../events";

export const useUpdateCheck = () => {
  const [feedURL, setFeedURL] = useState<string>("");
  const [updateLog, setUpdateLog] = useState<string[]>([]);

  const checkUpdates = () => {
    nodeEventBus.send(EVENTS.APP_CHECK_UPDATES);
  };

  const writeLog = (msg: string) => {
    setUpdateLog((prev) => [...prev, msg]);
  };

  useEffect(() => {
    const callback = (_: IpcRendererEvent, updateURL) => setFeedURL(updateURL);
    nodeEventBus.on(EVENTS.APP_CHECK_UPDATES_SUCCESS, callback);
    return () => {
      nodeEventBus.removeListener(EVENTS.APP_CHECK_UPDATES_SUCCESS, callback);
    };
  }, []);

  useEffect(() => {
    const callback = (_: IpcRendererEvent) => writeLog("Update Available.");
    nodeEventBus.on(EVENTS.APP_CHECK_UPDATES_AVAILABLE, callback);
    return () => {
      nodeEventBus.removeListener(EVENTS.APP_CHECK_UPDATES_AVAILABLE, callback);
    };
  }, []);

  useEffect(() => {
    const callback = (_: IpcRendererEvent) => writeLog("Update Downloaded.");
    nodeEventBus.on(EVENTS.APP_CHECK_UPDATES_DOWNLOADED, callback);
    return () => {
      nodeEventBus.removeListener(
        EVENTS.APP_CHECK_UPDATES_DOWNLOADED,
        callback
      );
    };
  }, []);

  useEffect(() => {
    const callback = (_: IpcRendererEvent) => writeLog("Checking for updates.");
    nodeEventBus.on(EVENTS.APP_CHECK_UPDATES_LOADING, callback);
    return () => {
      nodeEventBus.removeListener(EVENTS.APP_CHECK_UPDATES_LOADING, callback);
    };
  }, []);

  useEffect(() => {
    const callback = (_: IpcRendererEvent) => writeLog("Update not available.");
    nodeEventBus.on(EVENTS.APP_CHECK_UPDATES_NOT_AVAILABLE, callback);
    return () => {
      nodeEventBus.removeListener(
        EVENTS.APP_CHECK_UPDATES_NOT_AVAILABLE,
        callback
      );
    };
  }, []);

  useEffect(() => {
    const callback = (_: IpcRendererEvent, updateURL) =>
      writeLog(`Update feed URL: ${updateURL}`);
    nodeEventBus.on(EVENTS.APP_CHECK_UPDATES_SUCCESS, callback);
    return () => {
      nodeEventBus.removeListener(
        EVENTS.APP_CHECK_UPDATES_NOT_AVAILABLE,
        callback
      );
    };
  }, []);

  return { checkUpdates, feedURL, updateLog };
};

export default useUpdateCheck;
