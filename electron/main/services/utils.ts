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
