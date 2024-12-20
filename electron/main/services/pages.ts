import fs from "fs";
import { spawn } from "child_process";
import PDFkit from "pdfkit";
import { FileInfo, Page, UploadType } from "../../../src/models";
import svgConverter from "./svgConverter";
import {
  findNewFilename,
  handleResponse,
  handleResponseError,
  removeFileAsync,
} from "./utils";
import { getHost, getPath } from "./env";
import pngConverter, { ImageSize } from "./pngConverter";
import { from, lastValueFrom, map, mergeMap } from "rxjs";
import fetch from "node-fetch";
import FormData from "form-data";
import { ClientFileUpdatePayload } from "../../../src/services/store/actions";
import { SOURCE_FILE_NAME } from "../../../src/constants";

// TODO move to env variables
const HOST = getHost();

const readPages = (): Page[] => {
  if (getPath().PAGE_STORAGE_PATH === null) {
    return []; // TODO add error handling or empty state
  }

  const res = fs.readFileSync(getPath().PAGE_STORAGE_PATH, {
    encoding: "utf8",
  });
  const pages = JSON.parse(res);
  return pages;
};

const savePrimaryStorage = (pages: Page[]) => {
  return saveStorage(pages, getPath().PAGE_STORAGE_PATH);
};

const saveBackupStorage = (pages: Page[]) => {
  return saveStorage(pages, getPath().PAGE_STORAGE_PATH_BACKUP);
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
  const promise = new Promise<string>((resolve, reject) => {
    const pngPath = `${getPath().PNG_STORAGE_PATH}/${filename}.png`;
    const svgPath = `${getPath().SVG_STORAGE_PATH}/${filename}`;
    const jpgPath = `${getPath().JPG_STORAGE_PATH}/${filename}.jpg`;
    const thumbPath = `${getPath().THUMB_STORAGE_PATH}/${filename}.jpg`;
    const clientPath = `${getPath().CLIENT_JPG_STORAGE_PATH}/${filename}.jpg`;

    return svgConverter(svgPath, pngPath)
      .then(() => pngConverter(pngPath, jpgPath))
      .then(() =>
        pngConverter(pngPath, thumbPath, { size: ImageSize.THUMBNAIL })
      )
      .then(() => pngConverter(pngPath, clientPath, { size: ImageSize.CLIENT }))
      .then(() => resolve(filename))
      .catch(reject);
  });
  return promise;
};

const refreshAllPages = async (pages: Page[]) => {
  if (pages.length === 0) {
    return Promise.resolve();
  }

  const concurrency = 4;
  const refreshStream = from(pages).pipe(
    map((page) => page.svg.file),
    mergeMap(refreshPage, concurrency)
  );

  return lastValueFrom(refreshStream);
};

const getPageData = (pageId: string) =>
  readPages().find((page) => pageId === page.id);

const fixPageFilename = (
  pageId: string,
  successCallback: (page: Page) => void,
  failCallback: (page: Page) => void
) => {
  const originalPage = getPageData(pageId);
  const filename = originalPage.svg.file;
  const filePath = `${getPath().SVG_STORAGE_PATH}/${filename}`;

  const newFileName = findNewFilename(filename);
  const newFilePath = `${getPath().SVG_STORAGE_PATH}/${newFileName}`;

  // copy svg file on disk with new name
  fs.copyFileSync(filePath, newFilePath);

  // remove all png's and jpg's related to that file
  removePageImages(filename);

  const fixedPage = { ...originalPage };
  fixedPage.svg.file = newFileName;
  fixedPage.id = newFileName;

  replacePageData(
    fixedPage,
    filename,
    () => successCallback(fixedPage),
    () => failCallback(fixedPage)
  );
};

const editPage = (filename: string, successCallback: () => void) => {
  const filePath = `${getPath().SVG_STORAGE_PATH}/${filename}`;

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

const replacePageData = (
  page: Page,
  filenameToUpdate: string,
  successCallback?: () => void,
  failCallback?: (message: string) => void
) => {
  fs.exists(getPath().PAGE_STORAGE_PATH, (exists) => {
    if (exists) {
      const pages = readPages();
      const pageIndex = pages.findIndex(
        (item) => item.svg.file === filenameToUpdate
      );

      if (pageIndex < 0) {
        // Page does not exist - create new
        pages.push(page);
      } else {
        // Update existing page
        pages[pageIndex] = {
          ...page,
          version: Date.now(),
        };
      }

      savePages(pages).then(successCallback).catch(failCallback);
    } else {
      failCallback?.("Page storage does not exist");
    }
  });
};

const uploadPage = (
  file: FileInfo,
  successCallback: (filename: string) => void,
  failCallback: (message: string) => void
) => {
  const filename = findNewFilename(file.name);

  var is = fs.createReadStream(file.path);
  var os = fs.createWriteStream(`${getPath().SVG_STORAGE_PATH}/${filename}`);

  is.pipe(os);

  os.on("error", () => {
    failCallback("Saving new page failed");
  });

  os.on("close", () => {
    successCallback(filename);
  });
};

const generatePDF = async () => {
  const pages = readPages().filter((page) => page.status === "enable");

  // 1. Check for which svg we need to generate jpg because its not created
  const pagesToUpdate = pages.filter((page) => {
    const jpgPath = `${getPath().JPG_STORAGE_PATH}/${page.svg.file}.jpg`;
    const pngPath = `${getPath().PNG_STORAGE_PATH}/${page.svg.file}.png`;
    const existsJpg = fs.existsSync(jpgPath);
    const existsPng = fs.existsSync(pngPath);

    if (!existsJpg || !existsPng) {
      return true;
    }

    const isEmptyJpg = fs.statSync(jpgPath)?.size === 0;
    const isEmptyPng = fs.statSync(pngPath)?.size === 0;

    return isEmptyJpg || isEmptyPng;
  });

  // 2. TODO Check for which svg we need to generate jpg because it was updated

  // 3. Generate missing jpg's
  await refreshAllPages(pagesToUpdate);

  // 3.5 Generate new pdf file name with timestamp

  // 4. Generate PDF
  const promise = new Promise((resolve) => {
    const pdf = new PDFkit({ size: [631.36, 841.89] }); //CUSTOM VALUES TO FILL OUT IPAD'S 4:3 SCREEN
    pages.forEach((page) => {
      const jpgPath = `${getPath().JPG_STORAGE_PATH}/${page.svg.file}.jpg`;
      pdf.addPage();
      if (page.keywords) {
        pdf.fillColor("#ffffff").text(page.keywords.join(" "), 0, 0);
      }
      pdf.image(jpgPath, 20, 0, { fit: [595, 841] });
    });
    pdf.end();
    const pdfPath = `${getPath().PDF_STORAGE_PATH}/katalog.pdf`;
    pdf.pipe(fs.createWriteStream(pdfPath));

    // TODO add error handling for writing stream
    return resolve("Catalog generated successfully");
  });

  return promise;

  // 5. TODO Remove old PDF's
};

const removePageImages = (filename: string) =>
  removeFileAsync(`${getPath().JPG_STORAGE_PATH}/${filename}.jpg`)
    .then(() =>
      removeFileAsync(`${getPath().CLIENT_JPG_STORAGE_PATH}/${filename}.jpg`)
    )
    .then(() =>
      removeFileAsync(`${getPath().THUMB_STORAGE_PATH}/${filename}.jpg`)
    )
    .then(() =>
      removeFileAsync(`${getPath().PNG_STORAGE_PATH}/${filename}.png`)
    )
    .then(() => removeFileAsync(`${getPath().SVG_STORAGE_PATH}/${filename}`));

const removePage = (filename: string) =>
  removePageImages(filename).then(() => {
    const pages = readPages().filter((page) => page.svg.file !== filename);
    return savePages(pages);
  });

const fetchClientData = () =>
  fetch(`${HOST}/data/${SOURCE_FILE_NAME}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(handleResponse)
    .catch(handleResponseError);

const updateClientPage = (page: ClientFileUpdatePayload) => {
  return page.type === "remove"
    ? removeClientPage(page.fileId)
    : uploadClientPage(page.fileId);
};

const uploadClientPage = (pageId: string) => {
  const page = readPages().find((page) => page.svg.file === pageId);
  if (!page) {
    // return Promise.reject(`No page found for id: ${pageId}`); // TODO add error structure {id:..., message:...}
    return Promise.reject(pageId);
  }

  const imagePath = `${getPath().CLIENT_JPG_STORAGE_PATH}/${pageId}.jpg`;

  // TODO read file async
  let readStream = fs.readFileSync(imagePath);

  const formData = new FormData();
  formData.append("uploadType", UploadType.IMAGE);
  formData.append("upfile", readStream, {
    contentType: "image/jpeg",
    filename: `${pageId}.jpg`,
  });

  return fetch(`${HOST}/upload.php`, {
    method: "POST",
    body: formData,
  })
    .then(handleResponse)
    .then(() => pageId)
    .catch(() => {
      throw pageId;
    });
};

const removeClientPage = (pageId: string) =>
  fetch(`${HOST}/remove.php?pageId=${pageId}`, {
    method: "DELETE",
  })
    .then(handleResponse)
    .then(() => pageId)
    .catch(() => {
      throw pageId;
    });

const uploadClientData = () => {
  const dataPath = `${getPath().PAGE_STORAGE_PATH}`;

  // TODO read file async
  let readStream = fs.readFileSync(dataPath);

  const formData = new FormData();
  formData.append("uploadType", UploadType.DATA);
  formData.append("upfile", readStream, {
    filename: SOURCE_FILE_NAME,
  });

  return fetch(`${HOST}/upload.php`, {
    method: "POST",
    body: formData,
  })
    .catch((err) => {
      throw err;
    })
    .then(handleResponse)
    .then(() => SOURCE_FILE_NAME)
    .catch(() => {
      throw SOURCE_FILE_NAME;
    });
};

export {
  readPages,
  refreshPage,
  refreshAllPages,
  editPage,
  fixPageFilename,
  replacePageData,
  uploadPage,
  savePages,
  generatePDF,
  removePage,
  fetchClientData,
  updateClientPage,
  uploadClientData,
};
