import {Data} from './data';
import {Show} from '../../common/src/show';
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
  const plainObject = {
    rssUrls: data.rssUrls,
    shows: data.shows.map((s) => {
      return {
        title: s.title,
        regex: s.regex.source,
        folder: s.folder,
        feedUrl: s.feedUrl ?? null,
      };
    }),
  };
  fs.promises.writeFile(path, JSON.stringify(plainObject));
};

/**
 * Parse a stringified JSON representation of a Data object. Throws an error if
 * the string is malformed.
 * @param {string} s
 * @return {Data}
 */
export const parseDataString = (s: string): Data => {
  if (s === '') {
    return {
      shows: [],
      rssUrls: [],
    };
  }
  const data = JSON.parse(s);
  const showObjects: any[] = data['shows'] ?? [];
  // Check to make sure showObjects is an array.
  if (!Array.isArray(showObjects)) {
    throw new Error('Failed to parse data string. Shows list is invalid.');
  }
  const shows: Show[] = showObjects.map((s) =>
    Show.fromJsonString(JSON.stringify(s)),
  );
  let rssUrls: any[] = data['rssUrls'] ?? [];
  // Check to make sure rssUrls is a string array.
  if (!Array.isArray(rssUrls) || rssUrls.some((s) => typeof s !== 'string')) {
    throw new Error('Failed to parse data string. RSS URLs list is invalid.');
  }
  rssUrls = rssUrls.map((s) => s.toString());
  return {
    shows: shows,
    rssUrls: rssUrls,
  };
};
