import useAsyncEvent from "./useAsyncEvent";
import { EventError } from "@/models";
import { BROWSER_EVENTS } from "@/events";

const useUpdateClientCatalog = () => {
  const { fetch: uploadPage, error: uploadPageError, data: uploadResponse, onFinish: onUploadFinish } = useAsyncEvent<
    string,
    EventError
  >(
    BROWSER_EVENTS.CLIENT_UPLOAD_PAGES,
    BROWSER_EVENTS.CLIENT_UPLOAD_PAGES_SUCCESS,
    BROWSER_EVENTS.CLIENT_UPLOAD_PAGES_FAIL
  );

  const { fetch: removePage, error: removePageError, data: removeResponse, onFinish: onRemoveFinish } = useAsyncEvent<
    string,
    EventError
  >(
    BROWSER_EVENTS.CLIENT_REMOVE_PAGES,
    BROWSER_EVENTS.CLIENT_REMOVE_PAGES_SUCCESS,
    BROWSER_EVENTS.CLIENT_REMOVE_PAGES_FAIL
  );

  const upload = (pageId?: string) => {
    uploadPage(pageId);
  };

  const remove = (pageId?: string) => {
    removePage(pageId);
  };

  return {
    upload,
    remove,
    uploadPageError,
    removePageError,
    onUploadFinish,
    onRemoveFinish,
    uploadResponse,
    removeResponse,
  };
};

export default useUpdateClientCatalog;
