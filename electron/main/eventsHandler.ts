import {
  BrowserWindow,
  ipcMain as browserEventBus,
  IpcMainEvent,
} from "electron";
import { BROWSER_EVENTS as EVENTS } from "../events";
import { readPages, refreshPage } from "./services/pages";

const registerEventHandlers = (_: BrowserWindow) => {
  browserEventBus.on(EVENTS.PAGES_FETCH, (event: IpcMainEvent) => {
    const pages = readPages();
    event.reply(EVENTS.PAGES_FETCH_SUCCESS, pages);
  });

  browserEventBus.on(
    EVENTS.PAGES_REFRESH,
    (event: IpcMainEvent, filename: string) => {
      refreshPage(filename).on("finish", () =>
        event.reply(EVENTS.PAGES_REFRESH_SUCCESS, filename)
      );
    }
  );

  // browser.webContents.on("did-finish-load", () => {
  //   browser.webContents.send("smthngForBrowser", "weird");
  //   browser?.webContents.send(
  //     "main-process-message",
  //     new Date().toLocaleString()
  //   );
  // });
};

export { registerEventHandlers };
