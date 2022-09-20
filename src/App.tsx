import { ActionIcon, Affix, Center, Drawer, FileButton } from "@mantine/core";
import { IconPlus } from "@tabler/icons";
import { useEffect, useMemo, useState } from "react";
import { ItemInterface, ReactSortable } from "react-sortablejs";
import styles from "./app.module.scss";
import { PageDetails } from "./components/PageDetails";
import { Thumbnail } from "./components/Thumbnail";
import { usePages, useUploadPage } from "./services";

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
  const [pageList, setPageList] = useState<ItemInterface[]>([]);

  const { data: pages, fetchPages } = usePages();
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
    console.log('new page version?')
  }, [pages]);

  useEffect(() => {
    console.log('save new page sorting');
  }, [pageList])

  return (
    <>
      <div className={styles.app}>
        <Center>
          <header className={styles.app__header}>Katalog Produktów</header>
        </Center>
        <ul className={styles.app__list}>
          <ReactSortable
            list={pageList}
            setList={setPageList}
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
              <IconPlus size={18} />
            </ActionIcon>
          )}
        </FileButton>
      </Affix>

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
