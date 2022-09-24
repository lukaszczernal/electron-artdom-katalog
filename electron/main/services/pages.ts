import fs from "fs";
import { spawn } from "child_process";
import PDFkit from 'pdfkit';
import Jimp from "jimp";
import { FileInfo, Page } from "../../models";
import svgConverter from "./svgConverter";
import { findNewFilename } from "./utils";

const PAGE_STORAGE_PATH = "public/data/pages-array.json";
const PAGE_STORAGE_PATH_BACKUP = "public/data/temp.pages-array.json";
const SVG_STORAGE_PATH = "public/svg";
const PNG_STORAGE_PATH = "public/png";

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
  const pngPath = `${PNG_STORAGE_PATH}/${filename}.png`;
  const svgPath = `${SVG_STORAGE_PATH}/${filename}`;

  return svgConverter(svgPath, pngPath, { width: 400 });
};

const editPage = (filename: string, successCallback: () => void) => {
  const filePath = `${SVG_STORAGE_PATH}/${filename}`;
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
  fs.exists(PAGE_STORAGE_PATH, (exists) => {
    if (exists) {
      const pages = readPages();
      const pageIndex = pages.findIndex(
        (item) => item.svg.file === page.svg.file
      );

      if (pageIndex < 0) {
        // Page does not exist - create new
        pages.push(page);
      } else {
        // Update existing page
        pages[pageIndex] = page;
      }

      savePages(pages)
        .then(successCallback)
        .catch(() => {
          failCallback("Saving page storage failed");
        });
    } else {
      failCallback("Page storage does not exist");
    }
  });
};

const uploadPage = (
  file: FileInfo,
  successCallback: (filename: string) => void,
  failCallback: (message: string) => void
) => {
  const pages = readPages();
  const filename = findNewFilename(file.name, pages);

  var is = fs.createReadStream(file.path);
  var os = fs.createWriteStream(`${SVG_STORAGE_PATH}/${filename}`);

  is.pipe(os);

  os.on("error", () => {
    failCallback("Saving new page failed");
  });

  os.on("close", () => {
    successCallback(filename);
  });
};

const generatePDF = () => {
  const pages = readPages();

  // 1. Check for which svg we need to generate jpg because its not created
  const pagesToUpdate = pages.filter(
    (page) => fs.existsSync(`public/jpg/${page.svg.file}.jpg`) === false
  );

  // 2. TODO Check for which svg we need to generate jpg because it was updated

  // 3. Generate missing jpg's
  const imageConvertion = Promise.all(
    pagesToUpdate.map((page) => {
      const pngPath = `public/png/${page.svg.file}.png`; // TODO this should be env const
      const jpgPath = `public/jpg/${page.svg.file}.jpg`; // TODO this should be env const
      const promise = new Promise((resolve, reject) => {
        Jimp.read(pngPath, (err, buffer) => {
          if (err) {
            reject(`File could not be converted: ${pngPath}`);
          }
          buffer.quality(55).write(jpgPath);
        });
      });
      return promise;
    })
  );

  // 4. Generate PDF
  return imageConvertion.then(() => {
    const pdf = new PDFkit({'size': [631.36, 841.89]});  //CUSTOM VALUES TO FILL OUT IPAD'S 4:3 SCREEN
    pages.forEach(page => {
      const jpgPath = `public/jpg/${page.svg.file}.jpg`; // TODO this should be env const
      pdf.addPage();
      pdf.image(jpgPath, 20, 0, {'fit': [595, 841]});
    });
    pdf.end();
    pdf.pipe(fs.createWriteStream('public/pdf/katalog.pdf')) // TOOD change to env constant
  });

  // 5. TODO Remove old PDF's
};

export {
  readPages,
  refreshPage,
  editPage,
  updatePage,
  uploadPage,
  savePages,
  generatePDF,
};
