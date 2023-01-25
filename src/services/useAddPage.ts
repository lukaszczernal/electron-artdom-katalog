import { useEffect, useState } from "react";
import { ipcRenderer as nodeEventBus, IpcRendererEvent } from "electron";
import { BROWSER_EVENTS as EVENTS } from "../events";
import useUpdatePage from "./useUpdatePage";
import { pageMetadata } from "./utils";
import useRefreshPage from "./useRefreshPage";

const useAddPage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { updatePage } = useUpdatePage();
  const { refreshPage } = useRefreshPage();

  const addPage = (file: File | null) => {
    setIsUploading(true);
    if (file) {
      nodeEventBus.send(EVENTS.PAGE_ADD, { path: file.path, name: file.name });
    }
  };

  useEffect(() => {
    const callback = (_: IpcRendererEvent) => setIsUploading(false);
    nodeEventBus.on(EVENTS.PAGE_ADD_FAIL, callback);
    return () => {
      nodeEventBus.removeListener(EVENTS.PAGE_ADD_FAIL, callback);
    };
  }, []);

  useEffect(() => {
    const callback = (_: IpcRendererEvent, filename: string) => {
      setIsUploading(false);
      const page = pageMetadata(filename);
      refreshPage(page);
      updatePage(page);
    };
    nodeEventBus.on(EVENTS.PAGE_ADD_SUCCESS, callback);
    return () => {
      nodeEventBus.removeListener(EVENTS.PAGE_ADD_SUCCESS, callback);
    };
  }, []);

  return { isUploading, addPage };
};

export default useAddPage;
