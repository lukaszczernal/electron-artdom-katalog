import {
  autoUpdater,
  BrowserWindow,
  ipcMain as browserEventBus,
  IpcMainEvent,
} from "electron";
import fetch from "node-fetch";
import { BROWSER_EVENTS as EVENTS } from "../../src/events";
import { FileInfo, Page } from "../../src/models";
import { setDirectories } from "./services/directories";
import { registerSourcePath } from "./services/env";
import {
  readPages,
  refreshPage,
  editPage,
  updatePage,
  uploadPage,
  savePages,
  generatePDF,
  removePage,
} from "./services/pages";

const registerEventHandlers = (browser: BrowserWindow) => {
  browserEventBus.on(
    EVENTS.ENV_REGISTER,
    (event: IpcMainEvent, sourcePath: string) => {
      registerSourcePath(sourcePath);
      setDirectories();
      event.reply(EVENTS.ENV_REGISTER_SUCCESS, sourcePath);
    }
  );

  browserEventBus.on(EVENTS.PAGES_FETCH, (event: IpcMainEvent) => {
    const pages = readPages();
    event.reply(EVENTS.PAGES_FETCH_SUCCESS, pages);
  });

  browserEventBus.on(
    EVENTS.PAGE_REFRESH,
    (event: IpcMainEvent, filename: string) => {
      refreshPage(filename).on("finish", () =>
        event.reply(EVENTS.PAGE_REFRESH_SUCCESS, filename)
      );
    }
  );

  browserEventBus.on(
    EVENTS.PAGE_EDIT,
    (event: IpcMainEvent, filename: string) => {
      editPage(filename, () => event.reply(EVENTS.PAGE_EDIT_SUCCESS, filename));
    }
  );

  browserEventBus.on(
    EVENTS.PAGE_DELETE,
    (event: IpcMainEvent, filename: string) => {
      removePage(filename)
        .then((message) => event.reply(EVENTS.PAGE_DELETE_SUCCESS, message))
        .catch((message) => event.reply(EVENTS.PAGE_DELETE_FAIL, message));
    }
  );

  browserEventBus.on(EVENTS.PAGE_UPDATE, (event: IpcMainEvent, page: Page) => {
    updatePage(
      page,
      () => event.reply(EVENTS.PAGE_UPDATE_SUCCESS),
      () => event.reply(EVENTS.PAGE_UPDATE_FAIL)
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

  browserEventBus.on(
    EVENTS.PAGES_SAVE,
    (event: IpcMainEvent, pages: Page[]) => {
      savePages(pages)
        .then(() => event.reply(EVENTS.PAGES_SAVE_SUCCESS))
        .catch(() => event.reply(EVENTS.PAGES_SAVE_FAIL));
    }
  );

  browserEventBus.on(EVENTS.PDF_GENERATE, (event: IpcMainEvent) => {
    generatePDF()
      .then(() => event.reply(EVENTS.PDF_GENERATE_SUCCESS))
      .catch(() => event.reply(EVENTS.PDF_GENERATE_FAIL));
  });

  browserEventBus.on(EVENTS.APP_CHECK_UPDATES, (event: IpcMainEvent) => {
    autoUpdater.checkForUpdates();
    event.reply(EVENTS.APP_CHECK_UPDATES_SUCCESS, autoUpdater.getFeedURL());
  });

  autoUpdater.on("checking-for-update", () => {
    browser.webContents.send(EVENTS.APP_CHECK_UPDATES_LOADING);
  });

  autoUpdater.on("update-available", () => {
    browser.webContents.send(EVENTS.APP_CHECK_UPDATES_AVAILABLE);
  });

  autoUpdater.on("update-downloaded", () => {
    browser.webContents.send(EVENTS.APP_CHECK_UPDATES_DOWNLOADED);
  });

  autoUpdater.on("update-not-available", () => {
    browser.webContents.send(EVENTS.APP_CHECK_UPDATES_NOT_AVAILABLE);
  });

  browserEventBus.on(EVENTS.APP_CHECK_HAZEL, (event: IpcMainEvent) => {
    const feedURL = autoUpdater.getFeedURL();
    if (!feedURL) {
      event.reply(EVENTS.APP_CHECK_HAZEL_FAIL, 'No feedURL provided.');
      return;
    }

    fetch(feedURL)
      .then((res) => res.json())
      .then((res) => event.reply(EVENTS.APP_CHECK_HAZEL_SUCCESS, res))
      .catch((err) => event.reply(EVENTS.APP_CHECK_HAZEL_FAIL, err));
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
