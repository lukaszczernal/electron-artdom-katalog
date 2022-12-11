import { ipcRenderer as nodeEventBus } from "electron";
import { useCallback, useEffect, useState } from "react";
import { arrayMoveImmutable as arrayMove } from "array-move";
import { BROWSER_EVENTS as EVENTS } from "../events";
import { Page } from "../models";
import useEvent from "./useEvent";

interface Pages {
  [k: string]: Page;
}

export const usePages = () => {
  const [data, setData] = useState<Page[]>([]);
  const [pageIds, setPageIds] = useState<string[]>([]);
  const [pages, setPages] = useState<Pages>();

  const fetchPages = useCallback(() => {
    console.log("page fetch request");
    nodeEventBus.send(EVENTS.PAGES_FETCH);
  }, []);

  const savePages = (pages: Page[]) => {
    nodeEventBus.send(EVENTS.PAGES_SAVE, pages);
  };

  const editPage = (page: Page) => {
    nodeEventBus.send(EVENTS.PAGE_EDIT, page);
  };

  const removePage = (filename?: string | null) => {
    if (!filename) return;
    nodeEventBus.send(EVENTS.PAGE_DELETE, filename);
  };

  const sortPages = (oldIndex, newIndex) => {
    if (data) {
      const sortedPages = arrayMove(data, oldIndex, newIndex);
      savePages(sortedPages);
    }
  };

  // TODO fix search
  // if user remove some search phrase letters new pages does not show up
  const searchPages = (phrase: string) => {
    const trimmed = phrase.trim();
    const searchPhrases = trimmed.length ? trimmed.split(" ") : [];

    if (searchPhrases.length === 0) {
      fetchPages();
      return;
    }

    setData((prev) =>
      prev.filter((page) => {
        const keywords = page.keywords?.join(" ") || "";
        const filename = page.svg.file.toLowerCase();

        return searchPhrases.some(
          (phrase) =>
            `${keywords} ${filename}`.match(phrase.toLowerCase()) !== null
        );
      })
    );
  };

  useEffect(() => {
    setPageIds(data.map((page) => page.svg.file));
    setPages(
      data.reduce((pages, page) => {
        pages[page.svg.file] = page;
        return pages;
      }, {})
    );
  }, [data]);

  useEvent<Page[]>(EVENTS.PAGES_FETCH_SUCCESS, (_, pages) => {
    console.log("fetch success"); // TODO called many times
    setData(pages);
  });
  useEvent(EVENTS.PAGE_REFRESH_SUCCESS, () => {
    setData((data) => [...data]);
  });
  useEvent(EVENTS.PAGE_UPDATE_SUCCESS, fetchPages);
  useEvent(EVENTS.PAGES_SAVE_SUCCESS, fetchPages);
  useEvent(EVENTS.PAGE_DELETE_SUCCESS, fetchPages);
  useEvent(EVENTS.ENV_REGISTER_SUCCESS, fetchPages);

  return {
    fetchPages,
    data,
    pages,
    pageIds,
    editPage,
    savePages,
    removePage,
    sortPages,
    searchPages,
  };
};

export default usePages;
