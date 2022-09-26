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
  savePages,
  generatePDF,
} from "./services/pages";

const registerEventHandlers = (_: BrowserWindow) => {
  browserEventBus.on(
    EVENTS.PAGES_FETCH,
    (event: IpcMainEvent, sourcePath: string) => {
      const pages = readPages(sourcePath); // TODO create separete setup method
      event.reply(EVENTS.PAGES_FETCH_SUCCESS, pages);
    }
  );

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

  // browser.webContents.on("did-finish-load", () => {
  //   browser.webContents.send("smthngForBrowser", "weird");
  //   browser?.webContents.send(
  //     "main-process-message",
  //     new Date().toLocaleString()
  //   );
  // });
};

export { registerEventHandlers };
