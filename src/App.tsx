import {
  ActionIcon,
  Affix,
  Center,
  Drawer,
  FileButton,
  Tooltip,
} from "@mantine/core";
import { IconFileExport, IconFilePlus } from "@tabler/icons";
import { Page } from "electron/models";
import { useEffect, useMemo, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import styles from "./app.module.scss";
import { PageDetails } from "./components/PageDetails";
import { Thumbnail } from "./components/Thumbnail";
import { usePages, useUploadPage } from "./services";
import { Subject, withLatestFrom } from "rxjs";

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

  const { data: pages, fetchPages, savePages, generatePDF } = usePages();
  const { uploadPage } = useUploadPage();

  const selectedPage = useMemo(() => {
    return pages.find((page) => page.svg.file === selectedPageKey);
  }, [selectedPageKey, pages]);

  useEffect(() => {
    fetchPages();
  }, []);

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

  useEffect(() => {
    const stream = pageListStream.subscribe(setPageList);

    const sortStream = onSortEndStream
      .pipe(withLatestFrom(pageListStream))
      .subscribe(([_, pages]) => savePages(pages));

    return () => {
      stream.unsubscribe();
      sortStream.unsubscribe();
    };
  }, []);

  return (
    <>
      <div className={styles.app}>
        <Center>
          <header className={styles.app__header}>
            Katalog Produktów {updateCount}
          </header>
        </Center>
        <ul className={styles.app__list}>
          <ReactSortable
            list={pageList}
            setList={setSorted}
            onEnd={onSortEnd}
            className={styles.app__listDraggable}
          >
            {pageList.map((page) => (
              <li key={page.svg.file}>
                <a
                  className={styles.app__page}
                  onClick={() => setSelectedPageKey(page.svg.file)}
                >
                  <Thumbnail
                    disabled={page.status !== "enable"}
                    src={`png/${page.svg.file}.png?${updateCount}`}
                    width={200}
                  />
                </a>
              </li>
            ))}
          </ReactSortable>
        </ul>
      </div>

      <Tooltip label="Generuj PDF" position="left" withArrow>
        <Affix position={{ bottom: 100, right: 40 }}>
          <ActionIcon
            color="blue"
            size="xl"
            radius="xl"
            variant="filled"
            onClick={generatePDF}
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

      <Drawer
        opened={Boolean(selectedPageKey)}
        onClose={() => setSelectedPageKey(null)}
        title={selectedPageKey}
        position="bottom"
        padding="xl"
        size="xl"
      >
        {selectedPage && <PageDetails page={selectedPage} />}
      </Drawer>
    </>
  );
};

export default App;
