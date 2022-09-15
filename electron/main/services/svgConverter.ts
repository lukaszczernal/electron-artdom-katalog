import Inkscape from "inkscape";
import fs from "fs";

const svgConverter = (svgpath, pngpath, options) => {
  const svg = fs.createReadStream(svgpath);
  const stream = fs.createWriteStream(pngpath);
  const converter = new Inkscape(["--export-type=png", "--export-width=1024", '-b', '#ffffff']);

  svg.pipe(converter).pipe(stream);

  return stream;
};

export default svgConverter;
