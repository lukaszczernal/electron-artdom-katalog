import Jimp from "jimp";

export enum ImageSize {
  THUMBNAIL = 'thumbnail',
  CLIENT = 'client',
}

interface Options {
  size?: ImageSize;
}

const pngConverter = (pngPath: string, jpgPath: string, options?: Options) => {
  const promise = new Promise(async (resolve, reject) => {
    const pngSource = Jimp.read(pngPath);
    pngSource.then((source) => {
      switch(options?.size) {
        case ImageSize.THUMBNAIL:
          source.quality(75);
          source.resize(200, 283);
          break;
        case ImageSize.CLIENT:
          source.quality(55);
          source.resize(800, 1132);
          break;
        default:
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
