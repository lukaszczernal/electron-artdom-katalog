import { Button, Drawer } from "@mantine/core";
import { Page } from "electron/models";
import { useEffect, useState } from "react";
import styles from "./app.module.scss";
import { usePages } from "./services";

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

  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [updateCount, setUpdateCount] = useState(0);

  const { data: pages, request, refreshPage, editPage } = usePages();

  useEffect(() => {
    request();
  }, []);

  // TODO this refresh method is so lame
  useEffect(() => {
    setUpdateCount((prev) => prev + 1);
  }, [pages]);

  return (
    <>
      <div className={styles.app}>
        <header className={styles.app__header}>Katalog Produktów</header>
        <ul className={styles.app__list}>
          {pages?.map((page) => {
            return (
              <li className={styles.app__listItem} key={page.svg.file}>
                <a
                  className={styles.app__page}
                  onClick={() => setSelectedPage(page)}
                >
                  <img
                    src={`png/${page.svg.file}.png?${updateCount}`}
                    width="200"
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <Drawer
        opened={Boolean(selectedPage)}
        onClose={() => setSelectedPage(null)}
        title={selectedPage?.svg.file}
        position="bottom"
        padding="xl"
        size="xl"
      >
        {selectedPage && (
          <>
            <img
              src={`png/${selectedPage?.svg.file}.png?${updateCount}`}
              width="200"
            />
            <Button onClick={() => refreshPage(selectedPage?.svg.file)}>
              Refresh
            </Button>
            <Button onClick={() => editPage(selectedPage?.svg.path)}>
              Edit
            </Button>
          </>
        )}
      </Drawer>
    </>
  );
};

export default App;
