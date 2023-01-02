import { BROWSER_EVENTS as EVENTS } from "../events";
import { EventError } from "../models";
import useAsyncEvent from "./useAsyncEvent";

export const useGenerateCatalog = () => {
  return useAsyncEvent<void, EventError>(
    EVENTS.PDF_GENERATE,
    EVENTS.PDF_GENERATE_SUCCESS,
    EVENTS.PDF_GENERATE_FAIL
  );
};

export default useGenerateCatalog;
