import Jimp from "jimp";

interface Options {
  thumbnail?: boolean;
}

const pngConverter = (pngPath: string, jpgPath: string, options?: Options) => {
  const promise = new Promise(async (resolve, reject) => {
    const pngSource = Jimp.read(pngPath);
    pngSource.then((source) => {
      if (options?.thumbnail) {
        source.quality(75);
        source.resize(200, 283);
      } else {
        source.quality(55);
      }

      return source.write(jpgPath, (error) => {
        if (error) {
          reject(`${jpgPath} file could not be created`);
        }
        resolve(`${jpgPath} generated`);
      });
    });
  });
  return promise;
};

export default pngConverter;
