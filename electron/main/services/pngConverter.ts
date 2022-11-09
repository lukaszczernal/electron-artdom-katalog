import Jimp from "jimp";

const pngConverter = (pngPath: string, jpgPath: string) => {
  const promise = new Promise(async (resolve, reject) => {
    const pngSource = Jimp.read(pngPath);
    pngSource.then((source) =>
      source.quality(55).write(jpgPath, (error) => {
        if (error) {
          reject(`${jpgPath} file could not be created`);
        }
        resolve(`${jpgPath} generated`);
      })
    );
  });
  return promise;
};

export default pngConverter;
