import {
  BrowserWindow,
  ipcMain as browserEventBus,
  IpcMainEvent,
} from "electron";
import { BROWSER_EVENTS as EVENTS } from "../events";
import { FileInfo, Page } from "../models";
import {
  readPages,
  refreshPage,
  editPage,
  updatePage,
  uploadPage,
} from "./services/pages";

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

  browserEventBus.on(
    EVENTS.PAGES_EDIT,
    (event: IpcMainEvent, filename: string) => {
      editPage(filename, () => event.reply(EVENTS.PAGES_EDIT_SUCCESS));
    }
  );

  browserEventBus.on(EVENTS.PAGES_UPDATE, (event: IpcMainEvent, page: Page) => {
    updatePage(
      page,
      () => event.reply(EVENTS.PAGES_UPDATE_SUCCESS),
      () => event.reply(EVENTS.PAGES_UPDATE_FAIL)
    );
  });

  browserEventBus.on(
    EVENTS.PAGE_UPLOAD,
    (event: IpcMainEvent, file: FileInfo) => {
      uploadPage(
        file,
        (filename: string) => event.reply(EVENTS.PAGE_UPLOAD_SUCCESS, filename),
        () => event.reply(EVENTS.PAGE_UPLOAD_FAIL, file)
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
