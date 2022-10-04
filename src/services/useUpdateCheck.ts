import { HazelResponse } from '@/models';
import { ipcRenderer as nodeEventBus, IpcRendererEvent } from "electron";
import { useEffect, useState } from "react";
import { BROWSER_EVENTS as EVENTS } from "../events";

export const useUpdateCheck = () => {
  const [feedURL, setFeedURL] = useState<string>("");
  const [updateLog, setUpdateLog] = useState<string[]>([]);
  const [hazelResponse, setHazelResponse] = useState<HazelResponse>();
  const [hazelError, setHazelError] = useState<any>();

  // const checkUpdates = () => {
  //   nodeEventBus.send(EVENTS.APP_CHECK_UPDATES);
  // };

  const checkHazel = () => {
    nodeEventBus.send(EVENTS.APP_CHECK_UPDATES);
    nodeEventBus.send(EVENTS.APP_CHECK_HAZEL);
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

  useEffect(() => {
    const callback = (_: IpcRendererEvent, response: HazelResponse) => setHazelResponse(response);
    nodeEventBus.on(EVENTS.APP_CHECK_HAZEL_SUCCESS, callback);
    return () => {
      nodeEventBus.removeListener(EVENTS.APP_CHECK_HAZEL_SUCCESS, callback);
    };
  }, []);

  useEffect(() => {
    const callback = (_: IpcRendererEvent, error: any) => setHazelError(error);
    nodeEventBus.on(EVENTS.APP_CHECK_HAZEL_FAIL, callback);
    return () => {
      nodeEventBus.removeListener(EVENTS.APP_CHECK_HAZEL_FAIL, callback);
    };
  }, []);

  return { checkHazel, feedURL, updateLog, hazelResponse, hazelError };
};

export default useUpdateCheck;
