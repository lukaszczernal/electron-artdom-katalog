import { Page } from "electron/models";

export const pageMetadata = (file: string): Page => ({
  svg: {
    dir: "svg",
    file,
    path: `public/svg/${file}`,
  },
  status: "enable",
});
