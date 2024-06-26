// The built directory structure
//
// ├─┬ dist
// │ ├─┬ electron
// │ │ ├─┬ main
// │ │ │ └── index.js
// │ │ └─┬ preload
// │ │   └── index.js
// │ ├── index.html
// │ ├── ...other-static-files-from-public
// │
process.env.DIST = join(__dirname, "../..");
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : join(process.env.DIST, "../public");
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  protocol,
  autoUpdater,
  dialog,
} from "electron";
import { release } from "os";
import { join } from "path";
import { registerEventHandlers } from "./eventsHandler";
import contextMenu from "electron-context-menu";
import { reduxEvent } from "./utils";
import { ACTIONS } from '../../src/services/store/actions';

contextMenu();

const server = "https://electron-artdom-katalog-hazel.vercel.app"; // TODO move to env variables
const appURL = `${server}/update/${process.platform}/${app.getVersion()}`;

if (app.isPackaged) {
  autoUpdater.setFeedURL({ url: appURL });

  // setInterval(() => {
  //   autoUpdater.checkForUpdates();
  // }, 30000);

  autoUpdater.on("update-downloaded", (_event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: "info",
      buttons: ["Restart", "Later"],
      title: "Application Update",
      message: process.platform === "win32" ? releaseNotes : releaseName,
      detail: `A new version has been downloaded. Restart the application to apply the updates. ${appURL}`,
    };

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall();
    });
  });

  autoUpdater.on("error", (message) => {
    console.error(`There was a problem updating the application: ${appURL}`);
    console.error(message);
  });
}

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

app.commandLine.appendSwitch("disable-http-cache");

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

async function createWindow() {
  win = new BrowserWindow({
    title: "Artdom Product Catalog",
    icon: join(process.env.PUBLIC, "favicon.svg"),
    minWidth: 800,
    minHeight: 600,
    width: 1600,
    height: 1020,
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (app.isPackaged) {
    win.loadFile(indexHtml);
  } else {
    win.loadURL(url);
    win.webContents.openDevTools();
  }

  // Test actively push message to the Electron-Renderer
  // win.webContents.on('did-finish-load', () => {
  //   win?.webContents.send('main-process-message', new Date().toLocaleString())
  // })

  win.webContents.session.on("will-download", (_event, item, webContents) => {
    item.on("updated", (_event, state) => {
      if (state === "interrupted") {
        webContents.send(...reduxEvent(ACTIONS.APP_DOWNLOAD_STATUS(state)));
      } else if (state === "progressing") {
        if (item.isPaused()) {
          webContents.send(...reduxEvent(ACTIONS.APP_DOWNLOAD_STATUS("paused")));
        } else {
          const progress =
            Math.round((item.getReceivedBytes() / item.getTotalBytes()) * 100) /
            100;
          webContents.send(...reduxEvent(ACTIONS.APP_DOWNLOAD_STATUS(state)));
          webContents.send(...reduxEvent(ACTIONS.APP_DOWNLOAD_PROGRESS(progress)));
        }
      }
    });
    item.once("done", (_event, state) => {
      webContents.send(...reduxEvent(ACTIONS.APP_DOWNLOAD_STATUS(state)));
      if (state === "completed") {
        webContents.send(...reduxEvent(ACTIONS.APP_DOWNLOAD_SUCCESS()));
      } else {
        webContents.send(...reduxEvent(ACTIONS.APP_DOWNLOAD_FAIL()));
      }
    });
  });

  registerEventHandlers(win);

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("ready", async () => {
  const protocolName = "safe-file-protocol";
  protocol.registerFileProtocol(protocolName, (request, callback) => {
    let url = request.url.replace(`${protocolName}://`, "");
    url = url.split("?")[0]; // remove cache query param
    callback(url);
  });
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// new window example arg: new windows url
ipcMain.handle("open-win", (event, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
    },
  });

  if (app.isPackaged) {
    childWindow.loadFile(indexHtml, { hash: arg });
  } else {
    childWindow.loadURL(`${url}/#${arg}`);
    // childWindow.webContents.openDevTools({ mode: "undocked", activate: true })
  }
});
