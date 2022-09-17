import fs from "fs";
import { spawn } from "child_process";
import { Page } from "../../models";
import svgConverter from "./svgConverter";

const PAGE_STORAGE_PATH = "public/data/pages-array.json";
const PAGE_STORAGE_PATH_BACKUP = "public/data/temp.pages-array.json";

const readPages = (): Page[] => {
  const res = fs.readFileSync(PAGE_STORAGE_PATH, {
    encoding: "utf8",
  });
  const pages = JSON.parse(res);
  return pages;
};

const savePrimaryStorage = (pages: Page[]) => {
  return saveStorage(pages, PAGE_STORAGE_PATH);
};

const saveBackupStorage = (pages: Page[]) => {
  return saveStorage(pages, PAGE_STORAGE_PATH_BACKUP);
};

const saveStorage = (pages: Page[], path: string) => {
  const promise = new Promise<string>((resolve, reject) => {
    if (!pages && pages.length === 0) {
      reject("Nothing to be stored.");
    }

    fs.writeFile(path, JSON.stringify(pages), (error) => {
      if (error) {
        reject(`Storage update failed: ${path}`);
      }
      resolve(`Storage saved successfully: ${path}`);
    });
  });

  return promise;
};

const savePages = (pages: Page[]): Promise<any> => {
  return saveBackupStorage(pages).then(() => savePrimaryStorage(pages));
};

const refreshPage = (filename: string) => {
  const pages = readPages();
  const page = pages.find((page) => page.svg.file === filename);

  if (!page) return; // TODO send error message

  const pngPath = `public/png/${page.svg.file}.png`;

  return svgConverter(page.svg.path, pngPath, { width: 2000 });
};

const editPage = (filePath: string, successCallback: () => void) => {
  fs.exists(filePath, function (exists) {
    if (exists) {
      console.log("file exists", filePath);
      var childProcess = spawn("inkscape", [filePath]);

      childProcess.on("error", (err) => {
        console.error("Inkscape error: ", err);
      });

      childProcess.on("exit", function (code, signal) {
        if (code) {
          console.error("Inkscape exited with code", code);
        } else if (signal) {
          console.error("Inkscape was killed with signal", signal);
        } else {
          console.log("Inkscape exited okay");
          successCallback();
        }
      });
    } else {
      console.log("file does not exist", filePath);
    }
  });
};

const updatePage = (
  page: Page,
  successCallback: () => void,
  failCallback: (message: string) => void
) => {
  fs.exists(PAGE_STORAGE_PATH, function (exists) {
    if (exists) {
      const pages = readPages();
      const pageIndex = pages.findIndex(
        (item) => item.svg.file === page.svg.file
      );

      if (pageIndex < 0) {
        failCallback("page to update could not be found");
        return;
      }

      pages[pageIndex] = page;

      savePages(pages)
        .then(successCallback)
        .catch(() => {
          failCallback("Saving page storage failed");
        });
    } else {
      failCallback("page storage does not exist");
    }
  });
};

export { readPages, refreshPage, editPage, updatePage };
