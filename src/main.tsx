import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import PagesProvider from "@/services/context/pagesContext";
import SourcePathProvider from "@/services/context/sourcePathContext";
import EventHandlerProvider from "@/services/context/eventHandlerProvider";
import App from "@/App";
import store from "@/store";
import { Provider } from "react-redux";
import "./main.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // TODO unfortuantelly some 3rd party libs are not ready for React 18
  // <React.StrictMode>
  <Provider store={store}>
    <EventHandlerProvider>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <NotificationsProvider>
          <SourcePathProvider>
            <PagesProvider>
              <App />
            </PagesProvider>
          </SourcePathProvider>
        </NotificationsProvider>
      </MantineProvider>
    </EventHandlerProvider>
  </Provider>
  // </React.StrictMode>
);

postMessage({ payload: "removeLoading" }, "*");
