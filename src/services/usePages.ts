import { ipcRenderer as nodeEventBus } from "electron";
import { useCallback, useEffect, useMemo, useState } from "react";
import { arrayMoveImmutable as arrayMove } from "array-move";
import { BROWSER_EVENTS as EVENTS } from "../events";
import { Page } from "../models";
import useEvent from "./useEvent";
import { BehaviorSubject, combineLatest, map } from "rxjs";

interface Pages {
  [k: string]: Page;
}

export const usePages = () => {
  const [pageIds, setPageIds] = useState<string[]>([]);
  const [pages, setPages] = useState<Pages>();
  const data = useMemo(() => new BehaviorSubject<Page[]>([]), []);
  const searchPhrase = useMemo(() => new BehaviorSubject<string[]>([]), []);

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
    if (data.value) {
      const sortedPages = arrayMove(data.value, oldIndex, newIndex);
      savePages(sortedPages);
    }
  };

  const searchPages = (phrase: string) => {
    const trimmed = phrase.trim();
    const phraseList = trimmed.length ? trimmed.split(" ") : [];
    searchPhrase.next(phraseList);
  };

  const setSearchResults = (results: Page[]) => {
    setPageIds(results.map((page) => page.svg.file));
    setPages(
      results.reduce((pages, page) => {
        pages[page.svg.file] = page;
        return pages;
      }, {})
    );
  };

  useEffect(() => {
    const searchSub = combineLatest([searchPhrase, data])
      .pipe(
        map(([phraseList, pages]) =>
          phraseList.length === 0
            ? pages
            : pages.filter((page) => {
                const keywords = page.keywords?.join(" ") || "";
                const filename = page.svg.file.toLowerCase();

                return phraseList.some(
                  (phrase) =>
                    `${keywords} ${filename}`.match(phrase.toLowerCase()) !==
                    null
                );
              })
        )
      )
      .subscribe(setSearchResults);

    return () => {
      searchSub.unsubscribe();
    };
  }, []);

  useEvent<Page[]>(EVENTS.PAGES_FETCH_SUCCESS, (_, pages) => {
    console.log("fetch success"); // TODO called many times
    data.next(pages);
  });
  useEvent(EVENTS.PAGE_REFRESH_SUCCESS, () => {
    data.next([...data.value]);
  });
  useEvent(EVENTS.PAGE_UPDATE_SUCCESS, fetchPages);
  useEvent(EVENTS.PAGES_SAVE_SUCCESS, fetchPages);
  useEvent(EVENTS.PAGE_DELETE_SUCCESS, fetchPages);
  useEvent(EVENTS.ENV_REGISTER_SUCCESS, fetchPages);

  return {
    fetchPages,
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
