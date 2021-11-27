import {
  Data,
  parseDataString,
  stringifyData,
} from '@easy-show-downloader/common/dist/data';
import fs from 'fs';

/**
 * Reads show data from a file on the file system. If the file doesn't exist it
 * successfully returns an empty Data object.
 * @param {string} path Path to the data file.
 */
export const readDataFile = async (path: fs.PathLike): Promise<Data> => {
  try {
    const fileContents = (await fs.promises.readFile(path)).toString();
    return parseDataString(fileContents);
  } catch (e: any) {
    if (e && e['code'] === 'ENOENT') {
      return {
        shows: [],
        rssUrls: [],
      };
    } else {
      // We don't know how to deal with any other kind of error.
      throw e;
    }
  }
};

export const writeDataFile = async (
    path: fs.PathLike,
    data: Data,
): Promise<void> => {
  await fs.promises.writeFile(path, stringifyData(data));
};
