import fs from "fs";
import { Page } from "../../../src/models";

const nextFilename = (filename: string) => {
  const filenameParts = filename.split("-");
  let prefix = Number(filenameParts[0]);
  if (isNaN(prefix)) {
    filenameParts.unshift("1");
  } else {
    filenameParts[0] = String(prefix + 1);
  }
  return filenameParts.join("-");
};

export const findNewFilename = (filename: string, pages: Page[]) => {
  const pageIndex = pages.findIndex((item) => item.svg.file === filename);

  if (pageIndex < 0) {
    return filename;
  }

  const newFilename = nextFilename(filename);
  return findNewFilename(newFilename, pages);
};

export const removeFileAsync = (path: string) => {
  const promise = new Promise((resolve, reject) => {
    if (fs.existsSync(path) === false) {
      resolve("File already deleted");
    }

    try {
      fs.accessSync(path);
      fs.unlink(path, (err) => {
        err
          ? reject(`File could not be deleted: ${err} ${path}`)
          : resolve(`File deleted successfully: ${path}`);
      });
    } catch (err) {
      reject(`File access denied: ${err} ${path}`);
    }
  });

  return promise;
};
