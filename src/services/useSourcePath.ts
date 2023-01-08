import { useCallback, useEffect, useState } from "react";
import { ipcRenderer as nodeEventBus, IpcRendererEvent } from "electron";
import { BROWSER_EVENTS as EVENTS } from "../events";
import useEvent from "./useEvent";
import { EnvInfo } from "@/models";

const KEY = "CATALOG_SOURCE_PATH";

const useSourcePath = () => {
  const [path, setPath] = useState<string>();
  const [envInfo, setEnvInfo] = useState<EnvInfo>();

  const regiserPath = useCallback(() => {
    const refreshedPath = localStorage.getItem(KEY);
    nodeEventBus.send(EVENTS.ENV_REGISTER, refreshedPath);
  }, []);

  const setSourcePath = (path: string) => {
    localStorage.setItem(KEY, path);
    // regiserPath();
  };

  // TODO combine useEffect and two useEvent
  useEffect(() => {
    const callback = (_: IpcRendererEvent, envInfo: EnvInfo) => {
      setPath(envInfo.sourcePath || "");
    };
    nodeEventBus.on(EVENTS.ENV_REGISTER_SUCCESS, callback);
    return () => {
      nodeEventBus.removeListener(EVENTS.ENV_REGISTER_SUCCESS, callback);
    };
  }, []);

  useEvent(
    EVENTS.ENV_REGISTER_SUCCESS,
    (_: IpcRendererEvent, envInfo: EnvInfo) => setSourcePath(envInfo.sourcePath)
  );

  useEvent(
    EVENTS.ENV_REGISTER_SUCCESS,
    (_: IpcRendererEvent, envInfo: EnvInfo) => setEnvInfo(envInfo)
  );

  return { sourcePath: path, setSourcePath, regiserPath, envInfo };
};

export default useSourcePath;
