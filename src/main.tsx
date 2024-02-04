import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import PagesProvider from "@/services/context/pagesContext";
import SourcePathProvider from "@/services/context/sourcePathContext";
import EventHandlerProvider from "@/services/context/eventHandlerProvider";
import App from "@/App";
import store from "@/store";
import { Provider } from "react-redux";
import "./main.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <EventHandlerProvider>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <Notifications />
          <SourcePathProvider>
            <PagesProvider>
              <App />
            </PagesProvider>
          </SourcePathProvider>
        </MantineProvider>
      </EventHandlerProvider>
    </Provider>
  </React.StrictMode>
);

postMessage({ payload: "removeLoading" }, "*");
