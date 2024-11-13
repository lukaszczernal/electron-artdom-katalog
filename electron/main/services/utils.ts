import fs from "fs";
import { Response } from "node-fetch";

const getCurrentFormattedDate = () => {
  // Get the current date
  const now = new Date();

  // Extract date components
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  // Format date as yyyy-mm-dd_hh-mm-ss
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
};

export const getCleanFilenameChunks = (rawFilename: string) => {
  const filename = encodeURI(rawFilename);
  const suffixIndex = filename.lastIndexOf(".");
  const noSuffix = filename.substring(0, suffixIndex);
  const suffix = filename.substring(suffixIndex, filename.length);
  const cleanedSuffix: string = new RegExp(/^(\.)[a-zA-Z0-9]+/, "gm").exec(
    suffix
  )[0];

  return [noSuffix, cleanedSuffix];
};

export const findNewFilename = (rawFilename: string) => {
  const [noSuffix, cleanedSuffix] = getCleanFilenameChunks(rawFilename);

  return `${noSuffix}-${getCurrentFormattedDate()}${cleanedSuffix}`;
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

export const handleResponse = (res: Response) => {
  if (res.status >= 400) {
    throw res.statusText;
  }
  return res.json();
};

export const handleResponseError = (res: any) => {
  throw typeof res === "string" ? res : "Unhandled error";
};
