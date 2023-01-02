import { BROWSER_EVENTS as EVENTS } from "../events";
import { EventError, Page } from "../models";
import useAsyncEvent from "./useAsyncEvent";

export const useGenerateCatalog = () => {
  return useAsyncEvent<Page[], EventError>(
    EVENTS.CLIENT_FETCH_PAGES,
    EVENTS.CLIENT_FETCH_PAGES_SUCCESS,
    EVENTS.CLIENT_FETCH_PAGES_FAIL
  );
};

export default useGenerateCatalog;
