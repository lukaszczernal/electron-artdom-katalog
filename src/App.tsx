import {
  ActionIcon,
  Affix,
  Button,
  Center,
  Drawer,
  FileButton,
  TextInput,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { IconCheck, IconFileExport, IconFilePlus, IconX } from "@tabler/icons";
import { EventError, Page } from "./models";
import { useEffect, useMemo, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import styles from "./app.module.scss";
import { PageDetails } from "./components/PageDetails";
import { Thumbnail } from "./components/Thumbnail";
import {
  useGenerateCatalog,
  usePages,
  useSourcePath,
  useUploadPage,
} from "./services";
import { BehaviorSubject, map, Subject, switchMap, withLatestFrom } from "rxjs";
import { Settings } from "./components/Settings";
import { showNotification, updateNotification } from "@mantine/notifications";
import { PagePreview } from "./components/PagePreview";
import { ThumbnailAction } from "./components/ThumbnailAction";

const App: React.FC = () => {
  // TODO wrap in separate hook
  // useEffect(() => {
  //   //@ts-ignore
  //   const eventSub: Subscription = window.electron?.events.subscribe((r) => {
  //     console.log('subscribed callback', r)
  //   })

  //   return () => {
  //     eventSub?.unsubscribe?.();
  //   }
  // })

  const theme = useMantineTheme();
  const [selectedPageKey, setSelectedPageKey] = useState<string | null>(null);
  const [updateCount, setUpdateCount] = useState(0);
  const [pageList, setPageList] = useState<Page[]>([]);
  const [pagePreview, setPagePreview] = useState<Page | null>();

  const searchPhraseStream = useMemo(() => new BehaviorSubject<string>(""), []);
  const pageStream = useMemo(() => new BehaviorSubject<Page[]>([]), []);

  const onSortEndStream = useMemo(() => new Subject(), []);

  const [searchMode, setSearchMode] = useState(true);

  const { sourcePath, regiserPath } = useSourcePath();
  const { data: pages, savePages } = usePages();
  const { uploadPage } = useUploadPage();
  const {
    generate,
    isLoading: isGeneratingCatalog,
    onFinish: onGenerateCatalogFinish,
    onStart: onGenerateCatalogStart,
  } = useGenerateCatalog();

  const selectedPage = useMemo(() => {
    return pages.find((page) => page.svg.file === selectedPageKey);
  }, [selectedPageKey, pages]);

  // TODO this refresh method is so lame
  useEffect(() => {
    setUpdateCount((prev) => prev + 1);
  }, [pages]);

  useEffect(() => {
    const sortedList = pages.map((page) => ({
      ...page,
      id: page.svg.file,
    }));
    pageStream.next(sortedList);
  }, [pages]);

  const setSorted = (pages: Page[]) => {
    pageStream.next(pages);
  };

  const onSortEnd = () => {
    onSortEndStream.next(true);
  };

  // TODO move catalog-creation code to separate module
  const onCatalogGenerateStart = () => {
    showNotification({
      id: "catalog-generate",
      color: "teal",
      title: "Katalog",
      message: "Trwa generowanie",
      disallowClose: true,
      loading: true,
      autoClose: false,
    });
  };

  const onCatalogGenerateFinish = (error: EventError) => {
    error
      ? updateNotification({
          id: "catalog-generate",
          title: "Katalog nie został wynegerowany",
          message: <>{error}</>,
          autoClose: true,
        })
      : updateNotification({
          id: "catalog-generate",
          icon: <IconCheck />,
          color: "teal",
          title: "Katalog",
          message: "Wynegerowany pomyślnie.",
          autoClose: true,
        });
  };

  const onPagePreview = (page: Page) => {
    setSelectedPageKey(null);
    setPagePreview(page);
  };

  useEffect(() => {
    regiserPath();
    const onGenerateCatalogStartSub = onGenerateCatalogStart.subscribe(
      onCatalogGenerateStart
    );

    const onGenerateCatalogFinishSub = onGenerateCatalogFinish.subscribe({
      next: onCatalogGenerateFinish,
      error: onCatalogGenerateFinish,
    });

    const searchModeSub = searchPhraseStream
      .pipe(map((phrase) => phrase.length > 0))
      .subscribe((isDisabled) => setSearchMode(isDisabled));

    const pageSub = pageStream
      .pipe(
        switchMap((pages) =>
          searchPhraseStream.pipe(
            map((phrase) => phrase.trim()),
            map((phrase) => (phrase.length > 0 ? phrase.split(" ") : [])),
            map((phrases) =>
              pages
                .filter((page) => {
                  const keywords =
                    (phrases.length > 0 && page.keywords?.join(" ")) || "";

                  const filename = page.svg.file.toLowerCase();

                  return phrases.length > 0
                    ? phrases.every(
                        (phrase) =>
                          `${keywords} ${filename}`.match(
                            phrase.toLowerCase()
                          ) !== null
                      )
                    : true;
                })
                .map((page) => ({ ...page }))
            )
          )
        )
      )
      .subscribe(setPageList);

    const sortEventSub = onSortEndStream
      .pipe(withLatestFrom(pageStream))
      .subscribe(([_, pages]) => savePages(pages));

    return () => {
      onGenerateCatalogFinishSub.unsubscribe();
      onGenerateCatalogStartSub.unsubscribe();
      searchModeSub.unsubscribe();
      sortEventSub.unsubscribe();
      pageSub.unsubscribe();
    };
  }, []);

  return (
    <>
      <div className={styles.app}>
        <Center>
          <header className={styles.app__header}>Katalog Produktów</header>
        </Center>
        <ul className={styles.app__list}>
          <ReactSortable
            disabled={searchMode}
            list={pageList}
            setList={setSorted}
            onEnd={onSortEnd}
            className={styles.app__listDraggable}
          >
            {pageList.map((page) => (
              <li key={page.svg.file} className={styles.app__page}>
                <ThumbnailAction
                  onClick={() => onPagePreview(page)}
                  actions={
                    <Button
                      size="xs"
                      variant="light"
                      onClick={() => setSelectedPageKey(page.svg.file)}
                    >
                      Szczegóły
                    </Button>
                  }
                >
                  <Thumbnail
                    disabled={page.status !== "enable"}
                    src={`safe-file-protocol://${sourcePath}/png/${page.svg.file}.png?cache=${updateCount}`}
                  />
                </ThumbnailAction>
              </li>
            ))}
          </ReactSortable>
        </ul>
      </div>

      <Affix position={{ top: 10, right: 16 }}>
        <TextInput
          placeholder="Szukaj..."
          radius="xl"
          value={searchPhraseStream.value}
          onChange={(event) =>
            searchPhraseStream.next(event.currentTarget.value)
          }
          rightSection={
            searchMode && (
              <ActionIcon
                radius="xl"
                variant="filled"
                color={theme.primaryColor}
                onClick={() => searchPhraseStream.next("")}
              >
                <IconX size={18} />
              </ActionIcon>
            )
          }
        />
      </Affix>

      <Tooltip label="Generuj PDF" position="left" withArrow>
        <Affix position={{ bottom: 100, right: 16 }}>
          <ActionIcon
            loading={isGeneratingCatalog}
            color="blue"
            size="xl"
            radius="xl"
            variant="filled"
            onClick={generate}
          >
            <IconFileExport size={18} />
          </ActionIcon>
        </Affix>
      </Tooltip>

      <Tooltip label="Dodaj nową stronę" position="left" withArrow>
        <Affix position={{ bottom: 40, right: 16 }}>
          <FileButton onChange={uploadPage} accept="image/svg">
            {(props) => (
              <ActionIcon
                color="blue"
                size="xl"
                radius="xl"
                variant="filled"
                {...props}
              >
                <IconFilePlus size={18} />
              </ActionIcon>
            )}
          </FileButton>
        </Affix>
      </Tooltip>

      <Settings />

      <Drawer
        opened={Boolean(selectedPageKey)}
        onClose={() => setSelectedPageKey(null)}
        title={selectedPageKey}
        position="bottom"
        padding="xl"
        size="xl"
      >
        {selectedPage && (
          <PageDetails
            page={selectedPage}
            imageUpdate={updateCount}
            sourcePath={sourcePath}
          />
        )}
      </Drawer>

      {pagePreview && (
        <PagePreview
          selectedPage={pagePreview}
          pages={pageList}
          sourcePath={sourcePath}
          onClickOutside={() => setPagePreview(null)}
        />
      )}
    </>
  );
};

export default App;
