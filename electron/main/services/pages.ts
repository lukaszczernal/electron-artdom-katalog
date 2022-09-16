import fs from "fs";
import { spawn } from "child_process";
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

const editPage = (filePath: string, successCallback: () => void) => {
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

export { readPages, refreshPage, editPage };
