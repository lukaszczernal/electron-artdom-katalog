import Inkscape from "inkscape";
import fs from "fs";

const svgConverter = (svgpath, pngpath, options) => {
  const svg = fs.createReadStream(svgpath);
  const stream = fs.createWriteStream(pngpath);

  // Inkscape version >= 1.0.0
  // const converter = new Inkscape(["--export-type=png", "--export-width=1024", '-b', '#ffffff']);

  // Inkscape verson < 1.0.0
  const converter = new Inkscape(["-e", "-w", '1024', '-b', '#ffffff']);

  svg.pipe(converter).pipe(stream);

  return stream;
};

export default svgConverter;
