import Inkscape from "inkscape";
import fs from "fs";
import { removeFileAsync } from "./utils";

const IMAGE_OUTPUT_WIDTH = 2000;

const svgConverter = (svgpath, pngpath) => {
  const svg = fs.createReadStream(svgpath);
  const stream = fs.createWriteStream(`${pngpath}`);

  const promise = new Promise<string>((resolve, reject) => {
    stream.on("finish", () => {
      resolve("SVG file converted to PNG file.");
    });

    stream.on("error", () => {
      reject("SVG file failed to convert to PNG.");
    });

    removeFileAsync(pngpath).then(() => {
      const converter = new Inkscape([
        "-e",
        "-w",
        `${IMAGE_OUTPUT_WIDTH}`,
        "-b",
        "#ffffff",
      ]);

      svg.pipe(converter).pipe(stream);
    });
  });

  return promise;
};

export default svgConverter;
