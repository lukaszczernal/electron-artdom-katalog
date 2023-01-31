import { useContext, useEffect, useMemo, useState } from "react";
import { PagesContext } from "./context/pagesContext";
import { difference } from "lodash-es";
import useClientCatalog from "./useClientCatalog";
import { ClientFileUpdatePayload } from "./store/actions";

const useCompareCatalog = () => {
  const { pageIds, pages } = useContext(PagesContext);
  const [updatedPages, setUpdatedPages] = useState<string[]>([]);
  const [removedPages, setRemovedPages] = useState<string[]>([]);
  const [newPages, setNewPages] = useState<string[]>([]);

  const {
    fetch: fetchClientData,
    isLoading,
    error,
    data: clientData,
  } = useClientCatalog();

  const compare = () => {
    fetchClientData();
  };

  useEffect(() => {
    if (!clientData || !pageIds) {
      return;
    }

    const clientPageIds = clientData.map((page) => page.svg.file);

    const newPages: string[] = difference(pageIds, clientPageIds);
    const removedPages: string[] = difference(clientPageIds, pageIds);
    const updatedPages = clientData
      .filter((clientPage) => {
        const clientPageId = clientPage.svg.file;
        const currentPage = pages?.[clientPageId];
        return currentPage ? clientPage.version !== currentPage.version : false;
      })
      .map((page) => page.svg.file);

    setNewPages(newPages);
    setRemovedPages(removedPages);
    setUpdatedPages(updatedPages);
  }, [pageIds, clientData]);

  const allChangedPages = useMemo(() => {
    const uploadPages: ClientFileUpdatePayload[] = updatedPages
      .concat(newPages)
      .map((fileId) => ({
        type: "upload",
        fileId,
      }));

    const removePages: ClientFileUpdatePayload[] = removedPages.map(
      (fileId) => ({
        type: "remove",
        fileId,
      })
    );

    return uploadPages.concat(removePages);
  }, [newPages, removedPages, updatedPages]);

  return {
    compare,
    isLoading,
    error,
    updatedPages,
    removedPages,
    newPages,
    allChangedPages,
  };
};

export default useCompareCatalog;
