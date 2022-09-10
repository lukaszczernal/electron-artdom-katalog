import { useEffect } from "react";
import styles from "./app.module.scss";
import { usePages } from "./services";
// import { Subscription } from 'rxjs'

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

  const { data: pages, request, refreshPage } = usePages();

  useEffect(() => {
    request();
  }, []);

  return (
    <div className={styles.app}>
      <header className={styles.app__header}>Katalog Produktów</header>
      <ul>
        {pages?.map((page) => {
          return <li key={page.svg.file}><a onClick={refreshPage}>{page.svg.file}</a></li>;
        })}
      </ul>
    </div>
  );
};

export default App;
