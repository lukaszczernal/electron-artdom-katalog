import {
  BrowserWindow,
  ipcMain as browserEventBus,
  IpcMainEvent,
} from "electron";
import { BROWSER_EVENTS as EVENTS } from "../events";
import { readPages } from "./services/pages";

const registerEventHandlers = (browser: BrowserWindow) => {
  browserEventBus.on(EVENTS.PAGES_FETCH, (event: IpcMainEvent) => {
    const pages = readPages();
    event.reply(EVENTS.PAGES_FETCH_SUCCESS, pages);
  });

  // browser.webContents.on("did-finish-load", () => {
  //   browser.webContents.send("smthngForBrowser", "weird");
  //   browser?.webContents.send(
  //     "main-process-message",
  //     new Date().toLocaleString()
  //   );
  // });
};

export { registerEventHandlers };
