import { SOURCE_FILE_NAME } from "../../../src/constants";

let SOURCE_PATH = null;

const getPath = () => ({
  PAGE_STORAGE_PATH: SOURCE_PATH
    ? `${SOURCE_PATH}/data/${SOURCE_FILE_NAME}`
    : null,
  PAGE_STORAGE_PATH_BACKUP: SOURCE_PATH
    ? `${SOURCE_PATH}/data/temp.${SOURCE_FILE_NAME}`
    : null,
  SVG_STORAGE_PATH: SOURCE_PATH ? `${SOURCE_PATH}/svg` : null,
  PNG_STORAGE_PATH: SOURCE_PATH ? `${SOURCE_PATH}/png` : null,
  JPG_STORAGE_PATH: SOURCE_PATH ? `${SOURCE_PATH}/jpg` : null,
  PDF_STORAGE_PATH: SOURCE_PATH ? `${SOURCE_PATH}/pdf` : null,
  CLIENT_JPG_STORAGE_PATH: SOURCE_PATH ? `${SOURCE_PATH}/jpg/client` : null,
  THUMB_STORAGE_PATH: SOURCE_PATH ? `${SOURCE_PATH}/jpg/thumb` : null,
});

const registerSourcePath = (sourcePath?: string) => {
  if (sourcePath) {
    SOURCE_PATH = sourcePath;
  }
};

const getSourcePath = () => {
  return SOURCE_PATH;
};

const getHost = () => {
  switch (process.env.APP_DEV) {
    case "true":
      return "http://localhost:80";
    default:
      return "http://artdom.opole.pl";
  }
};

export { registerSourcePath, getSourcePath, getPath, getHost };
