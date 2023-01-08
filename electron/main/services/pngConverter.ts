import sharp from "sharp";

export enum ImageSize {
  THUMBNAIL = "thumbnail",
  CLIENT = "client",
}

interface Options {
  size?: ImageSize;
}

const pngConverter = (pngPath: string, jpgPath: string, options?: Options) => {
  const pngSource = sharp(pngPath);

  switch (options?.size) {
    case ImageSize.THUMBNAIL:
      pngSource.resize(200, 283).jpeg({ quality: 75 });
      break;
    case ImageSize.CLIENT:
      pngSource.resize(800, 1132).jpeg({ quality: 55 });
      break;
    default:
      pngSource.jpeg({ quality: 45 });
  }

  return pngSource
    .toFile(jpgPath)
    .then(() => `${jpgPath} generated`)
    .catch(() => `${jpgPath} file could not be created`);
};

export default pngConverter;
