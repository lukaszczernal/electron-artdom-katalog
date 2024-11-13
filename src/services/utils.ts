import { Page, PageStatus } from "@/models";

export const pageMetadata = (file: string): Page => ({
  svg: {
    file,
  },
  status: PageStatus.enable,
  id: file,
});

export const isFilenameValid = (rawFilename: string) => {
  return new RegExp(/(\.)svg$/, "gm").test(rawFilename.toLowerCase());
};
