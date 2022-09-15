import fs from "fs";
import { Page } from "../../models";
import svgConverter from "./svgConverter";

const readPages = (): Page[] => {
  const res = fs.readFileSync("public/data/pages-array.json", {
    encoding: "utf8",
  });
  const pages = JSON.parse(res);
  return pages;
};

const refreshPage = (filename: string) => {
  const pages = readPages();
  const page = pages.find((page) => page.svg.file === filename);

  if (!page) return; // TODO send error message

  const pngPath = `public/png/${page.svg.file}.png`;

  return svgConverter(page.svg.path, pngPath, { width: 2000 });
};

export { readPages, refreshPage };
