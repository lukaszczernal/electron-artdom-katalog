import { Page, PageStatus } from "@/models";

export const pageMetadata = (file: string): Page => ({
  svg: {
    file,
  },
  status: PageStatus.enable,
  id: file,
});
