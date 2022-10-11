import {
  ActionIcon,
  Affix,
  Center,
  Drawer,
  FileButton,
  Tooltip,
} from "@mantine/core";
import { IconCheck, IconFileExport, IconFilePlus } from "@tabler/icons";
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
import { Subject, withLatestFrom } from "rxjs";
import { Settings } from "./components/Settings";
import { showNotification, updateNotification } from "@mantine/notifications";

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

  const [selectedPageKey, setSelectedPageKey] = useState<string | null>(null);
  const [updateCount, setUpdateCount] = useState(0);
  const [pageList, setPageList] = useState<Page[]>([]);

  const pageListStream = useMemo(() => new Subject<Page[]>(), []);

  const onSortEndStream = useMemo(() => new Subject(), []);

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
    setPageList(sortedList);
  }, [pages]);

  const setSorted = (pages: Page[]) => {
    pageListStream.next(pages);
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

  useEffect(() => {
    regiserPath();
    const onGenerateCatalogStartSub = onGenerateCatalogStart.subscribe(
      onCatalogGenerateStart
    );

    const onGenerateCatalogFinishSub = onGenerateCatalogFinish.subscribe({
      next: onCatalogGenerateFinish,
      error: onCatalogGenerateFinish,
    });

    const sortedPageListSub = pageListStream.subscribe(setPageList);

    const sortEventSub = onSortEndStream
      .pipe(withLatestFrom(pageListStream))
      .subscribe(([_, pages]) => savePages(pages));

    return () => {
      onGenerateCatalogFinishSub.unsubscribe();
      onGenerateCatalogStartSub.unsubscribe();
      sortedPageListSub.unsubscribe();
      sortEventSub.unsubscribe();
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
            list={pageList}
            setList={setSorted}
            onEnd={onSortEnd}
            className={styles.app__listDraggable}
          >
            {pageList.map((page) => (
              <li key={page.svg.file} className={styles.app__page}>
                <Thumbnail
                  onClick={() => setSelectedPageKey(page.svg.file)}
                  disabled={page.status !== "enable"}
                  src={`safe-file-protocol://${sourcePath}/png/${page.svg.file}.png?cache=${updateCount}`}
                />
              </li>
            ))}
          </ReactSortable>
        </ul>
      </div>

      <Tooltip label="Generuj PDF" position="left" withArrow>
        <Affix position={{ bottom: 100, right: 40 }}>
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
        <Affix position={{ bottom: 40, right: 40 }}>
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
    </>
  );
};

export default App;
