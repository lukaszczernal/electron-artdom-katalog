import { useEffect, useState } from "react";
import { ipcRenderer as nodeEventBus, IpcRendererEvent } from "electron";
import { BROWSER_EVENTS as EVENTS } from "../events";
import useUpdatePage from './useUpdatePage';
import { pageMetadata } from './utils';
import useRefreshPage from './useRefreshPage';

const useUploadPage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { updatePage } = useUpdatePage();
  const { refreshPage } = useRefreshPage();

  const uploadPage = (file: File) => {
    setIsUploading(true);
    nodeEventBus.send(EVENTS.PAGE_UPLOAD, { path: file.path, name: file.name });
  };

  useEffect(() => {
    const callback = (_: IpcRendererEvent) => setIsUploading(false);
    nodeEventBus.on(EVENTS.PAGE_UPLOAD_FAIL, callback);
    return () => {
      nodeEventBus.removeListener(EVENTS.PAGE_UPLOAD_FAIL, callback);
    };
  }, []);

  useEffect(() => {
    const callback = (_: IpcRendererEvent, filename: string) => {
      setIsUploading(false);
      const page = pageMetadata(filename);
      refreshPage(filename);
      updatePage(page);
    };
    nodeEventBus.on(EVENTS.PAGE_UPLOAD_SUCCESS, callback);
    return () => {
      nodeEventBus.removeListener(EVENTS.PAGE_UPLOAD_SUCCESS, callback);
    };
  }, []);

  return { isUploading, uploadPage };
};

export default useUploadPage;
