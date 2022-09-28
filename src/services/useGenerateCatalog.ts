import { ipcRenderer as nodeEventBus, IpcRendererEvent } from "electron";
import { useEffect, useMemo, useState } from "react";
import { Subject } from "rxjs";
import { BROWSER_EVENTS as EVENTS } from "../../electron/events";
import { EventError } from "../../electron/models";

export const useGenerateCatalog = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const onFinish = useMemo(() => new Subject<EventError>(), []);
  const onStart = useMemo(() => new Subject(), []);

  const generate = () => {
    setIsLoading(true);
    onStart.next(true);
    nodeEventBus.send(EVENTS.PDF_GENERATE);
  };

  useEffect(() => {
    const callback = (_: IpcRendererEvent) => {
      setIsLoading(false);
      onFinish.next(null);
    };
    nodeEventBus.on(EVENTS.PDF_GENERATE_SUCCESS, callback);
    return () => {
      nodeEventBus.removeListener(EVENTS.PDF_GENERATE_SUCCESS, callback);
    };
  }, []);

  useEffect(() => {
    const callback = (_: IpcRendererEvent, error: EventError) => {
      setIsLoading(false);
      onFinish.next(error);
    };
    nodeEventBus.on(EVENTS.PDF_GENERATE_FAIL, callback);
    return () => {
      nodeEventBus.removeListener(EVENTS.PDF_GENERATE_FAIL, callback);
    };
  }, []);

  return { generate, isLoading, onStart, onFinish };
};

export default useGenerateCatalog;
