import { spawnSync } from "child_process";
import Inkscape from "inkscape";
import fs from "fs";

const svgConverter = (svgpath, pngpath, options) => {
  const svg = fs.createReadStream(svgpath);
  const stream = fs.createWriteStream(pngpath);

  const inkscapeVersionProcess = spawnSync("inkscape", ["--version"], {
    encoding: "utf8",
  });

  const inkscapeVersionOutput = inkscapeVersionProcess.stdout;
  const [_, version] = inkscapeVersionOutput.split(" ");
  const [majorVersion] = version.split(".");

  const converter =
    majorVersion === "1"
      ? new Inkscape([
          "--export-type=png",
          "--export-width=1024",
          "-b",
          "#ffffff",
        ])
      : new Inkscape(["-e", "-w", "1024", "-b", "#ffffff"]);

  svg.pipe(converter).pipe(stream);

  return stream;
};

export default svgConverter;
