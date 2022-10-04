import { existsSync, mkdirSync } from "fs";
import { getPath } from "./env";

const createDirectory = (path?: string) => {
  if (path && !existsSync(path)) {
    mkdirSync(path);
  }
};

const setDirectories = () => {
  createDirectory(getPath().PNG_STORAGE_PATH);
};

export { setDirectories };
