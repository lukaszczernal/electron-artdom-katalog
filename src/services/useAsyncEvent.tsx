import { ipcRenderer as nodeEventBus, IpcRendererEvent } from "electron";
import { BROWSER_EVENTS } from "@/events";
import { useMemo, useState } from "react";
import useEvent from "./useEvent";
import { Subject } from "rxjs";

interface AsyncState<T = any, E = any> {
  data?: T;
  error?: E;
  isLoading: boolean;
}

const useAsyncEvent = <T extends any, E = any>(
  triggerEvent: BROWSER_EVENTS,
  successEvent: BROWSER_EVENTS,
  failEvent: BROWSER_EVENTS
) => {
  const onFinish = useMemo(() => new Subject<T>(), []);
  const [asyncState, setAsyncState] = useState<AsyncState<T, E>>({
    isLoading: false,
  });

  const fetch = (payload?: T) => nodeEventBus.send(triggerEvent, payload);

  const onFinishCallback = (_: IpcRendererEvent, data: T) => {
    setAsyncState({
      data,
      isLoading: false,
    });
    onFinish.next(data);
  };

  const onErrorCallback = (_: IpcRendererEvent, error: E) => {
    setAsyncState((prev) => ({
      ...prev,
      isLoading: false,
      error,
    }));
    onFinish.error(error);
  };

  // TODO check if we are really removing correct callback reference
  useEvent(successEvent, onFinishCallback);
  useEvent(failEvent, onErrorCallback);

  return { fetch, onFinish, ...asyncState };
};

export default useAsyncEvent;
