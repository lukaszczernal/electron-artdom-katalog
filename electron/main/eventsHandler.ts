import {
  autoUpdater,
  BrowserWindow,
  ipcMain as browserEventBus,
  IpcMainEvent,
} from "electron";
import fetch from "node-fetch";
import { BROWSER_EVENTS as EVENTS } from "../../src/events";
import { EnvInfo, FileInfo, Page } from "../../src/models";
import { ACTIONS } from "../../src/services/store/actions";
import { setDirectories } from "./services/directories";
import { registerSourcePath, getSourcePath } from "./services/env";
import {
  readPages,
  refreshPage,
  refreshAllPages,
  editPage,
  updatePage,
  uploadPage,
  savePages,
  generatePDF,
  removePage,
  fetchClientData,
  uploadClientPage,
  removeClientPage,
  uploadAllClientPages,
} from "./services/pages";
import { reduxEvent } from "./utils";

const registerEventHandlers = (browser: BrowserWindow) => {
  browserEventBus.on(
    EVENTS.ENV_REGISTER,
    (event: IpcMainEvent, sourcePath: string) => {
      registerSourcePath(sourcePath);
      setDirectories();
      event.reply(EVENTS.ENV_REGISTER_SUCCESS, {
        sourcePath,
        resourcePath: process.resourcesPath,
      } as EnvInfo);
    }
  );

  browserEventBus.on(EVENTS.PAGES_FETCH, (event: IpcMainEvent) => {
    if (getSourcePath() === null) {
      browserEventBus.emit(EVENTS.ENV_REGISTER);
      return;
    }

    const pages = readPages();
    event.reply(EVENTS.PAGES_FETCH_SUCCESS, pages);
  });

  browserEventBus.on(EVENTS.PAGE_REFRESH, (event: IpcMainEvent, page: Page) => {
    refreshPage(page.svg.file)
      .then(() =>
        updatePage(
          page,
          () => event.reply(EVENTS.PAGE_UPDATE_SUCCESS),
          () => event.reply(EVENTS.PAGE_UPDATE_FAIL)
        )
      )
      .then(() => event.reply(EVENTS.PAGE_REFRESH_SUCCESS))
      .catch((error) => event.reply(EVENTS.PAGE_REFRESH_FAIL, error));
  });

  browserEventBus.on(EVENTS.PAGE_REFRESH_ALL, (event: IpcMainEvent) => {
    const pages = readPages();
    refreshAllPages(pages).then(() =>
      event.reply(EVENTS.PAGE_REFRESH_ALL_SUCCESS)
    );
  });

  browserEventBus.on(EVENTS.PAGE_EDIT, (event: IpcMainEvent, page: Page) => {
    editPage(page.svg.file, () => {
      event.reply(EVENTS.PAGE_EDIT_SUCCESS, page);
    });
  });

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

  browserEventBus.on(EVENTS.PAGE_ADD, (event: IpcMainEvent, file: FileInfo) => {
    uploadPage(
      file,
      (filename: string) => event.reply(EVENTS.PAGE_ADD_SUCCESS, filename),
      () => event.reply(EVENTS.PAGE_ADD_FAIL, file)
    );
  });

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
      .catch((error) => event.reply(EVENTS.PDF_GENERATE_FAIL, error));
  });

  browserEventBus.on(EVENTS.APP_CHECK_UPDATES, (event: IpcMainEvent) => {
    autoUpdater.checkForUpdates();
    event.reply(EVENTS.APP_CHECK_UPDATES_SUCCESS, autoUpdater.getFeedURL());
  });

  browserEventBus.on(EVENTS.CLIENT_CATALOG, (event: IpcMainEvent) => {
    fetchClientData()
      .then((res) => res.json())
      .then((res: Page[]) =>
        event.reply(...reduxEvent(ACTIONS.CLIENT_CATALOG_SUCCESS(res)))
      )
      .catch((err) =>
        event.reply(...reduxEvent(ACTIONS.CLIENT_CATALOG_FAIL(err)))
      );
  });

  browserEventBus.on(
    EVENTS.CLIENT_FILE_UPLOAD,
    (event: IpcMainEvent, pageId?: string) => {
      if (!pageId) {
        event.reply(...reduxEvent(ACTIONS.CLIENT_CATALOG_FAIL(pageId)));
        return;
      }

      uploadClientPage(pageId)
        .then(() =>
          event.reply(...reduxEvent(ACTIONS.CLIENT_FILE_UPLOAD_SUCCESS(pageId)))
        )
        .catch(() =>
          event.reply(...reduxEvent(ACTIONS.CLIENT_FILE_UPLOAD_FAIL(pageId)))
        );
    }
  );

  browserEventBus.on(
    EVENTS.CLIENT_FILE_UPLOAD_ALL,
    (event: IpcMainEvent, pageIds?: string[]) => {
      if (!pageIds) {
        event.reply(
          ...reduxEvent(
            ACTIONS.CLIENT_FILE_UPLOAD_ALL_FAIL("No pageIds provided.")
          )
        );
        return;
      }

      uploadAllClientPages(pageIds).subscribe({
        next: (pageId) =>
          event.reply(
            ...reduxEvent(ACTIONS.CLIENT_FILE_UPLOAD_SUCCESS(pageId))
          ),
        error: (pageId) =>
          event.reply(...reduxEvent(ACTIONS.CLIENT_FILE_UPLOAD_FAIL(pageId))),
        complete: () =>
          event.reply(...reduxEvent(ACTIONS.CLIENT_FILE_UPLOAD_ALL_SUCCESS())),
      });
    }
  );

  browserEventBus.on(
    EVENTS.CLIENT_FILE_REMOVE,
    (event: IpcMainEvent, pageId?: string) => {
      if (!pageId) {
        event.reply(...reduxEvent(ACTIONS.CLIENT_FILE_REMOVE_FAIL(pageId)));
        return;
      }

      removeClientPage(pageId)
        .then(() =>
          event.reply(...reduxEvent(ACTIONS.CLIENT_FILE_REMOVE_SUCCESS(pageId)))
        )
        .catch(() =>
          event.reply(...reduxEvent(ACTIONS.CLIENT_FILE_REMOVE_FAIL(pageId)))
        );
    }
  );

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
      event.reply(EVENTS.APP_CHECK_HAZEL_FAIL, "No feedURL provided.");
      return;
    }

    fetch(feedURL)
      .then((res) => res.json())
      .then((res) => event.reply(EVENTS.APP_CHECK_HAZEL_SUCCESS, res))
      .catch((err) => event.reply(EVENTS.APP_CHECK_HAZEL_FAIL, err));
  });

  browserEventBus.on(EVENTS.APP_DOWNLOAD, (_, url) => {
    browser.webContents.downloadURL(url);
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
