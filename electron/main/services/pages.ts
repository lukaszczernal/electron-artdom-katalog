import fs from "fs";

const readPages = () => {
  const res = fs.readFileSync("public/data/pages-array.json", {encoding: 'utf8'});
  const pages = JSON.parse(res);
  return pages;
};

export { readPages };
