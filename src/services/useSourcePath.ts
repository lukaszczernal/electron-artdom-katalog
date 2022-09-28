import { useEffect, useState } from "react";
import { ipcRenderer as nodeEventBus, IpcRendererEvent } from "electron";
import { BROWSER_EVENTS as EVENTS } from "../../electron/events";

const KEY = "CATALOG_SOURCE_PATH";

const useSourcePath = () => {
  const [path, setPath] = useState<string>("");

  const regiserPath = () => {
    const refreshedPath = localStorage.getItem(KEY);
    nodeEventBus.send(EVENTS.ENV_REGISTER, refreshedPath);
  };

  const setSourcePath = (path: string) => {
    localStorage.setItem(KEY, path);
    regiserPath();
  };

  useEffect(() => {
    const callback = (_: IpcRendererEvent, sourcePath: string) =>
      setPath(sourcePath || "");
    nodeEventBus.on(EVENTS.ENV_REGISTER_SUCCESS, callback);
    return () => {
      nodeEventBus.removeListener(EVENTS.ENV_REGISTER_SUCCESS, callback);
    };
  }, []);

  return { sourcePath: path, setSourcePath, regiserPath };
};

export default useSourcePath;
