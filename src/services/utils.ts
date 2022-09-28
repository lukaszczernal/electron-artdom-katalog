import { Page } from "@/models";

export const pageMetadata = (file: string): Page => ({
  svg: {
    file,
  },
  status: "enable",
  id: file,
});
