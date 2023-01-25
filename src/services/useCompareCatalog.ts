import { useContext, useEffect, useMemo, useState } from "react";
import { PagesContext } from "./context/pagesContext";
import { difference } from "lodash-es";
import useClientCatalog from "./useClientCatalog";

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

  const totalChanges = useMemo(
    () => updatedPages.length + removedPages.length + newPages.length,
    [updatedPages, removedPages, newPages]
  );

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

  return {
    compare,
    isLoading,
    error,
    totalChanges,
    updatedPages,
    removedPages,
    newPages,
  };
};

export default useCompareCatalog;
