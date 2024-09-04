import {Show} from './show';

/**
 * Contains all the data the server knows about shows and RSS sources.
 */
export type Data = {
  shows: Show[];
  rssUrls: string[];
  mediaRoot?: string;
}

/**
 * Turn a data object into a JSON string that can be read by parseDataString().
 * @param {Data} data Data to stringify.
 * @return {string} JSON string of the data.
 */
export const stringifyData = (data: Data): string => {
  const plainObject = {
    ...data,
    shows: data.shows.map((s) => {
      return {
        folder: s.folder,
        regex: s.regex.source,
        feedUrl: s.feedUrl ?? null,
      };
    }),
  };
  return JSON.stringify(plainObject);
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
  return parsePlainDataObject(data);
};

/* eslint-disable @typescript-eslint/no-explicit-any */
// This function is suppsoed to parse plain objects so we need explicit any
export const parsePlainDataObject = (o: {[key: string]: any}): Data => {
  const showObjects: any[] = o['shows'] ?? [];
  // Check to make sure showObjects is an array.
  if (!Array.isArray(showObjects)) {
    throw new Error('Failed to parse data string. Shows list is invalid.');
  }
  const shows: Show[] = showObjects.map((s) =>
    Show.fromJsonString(JSON.stringify(s)),
  );
  let rssUrls: any[] = o['rssUrls'] ?? [];
  // Check to make sure rssUrls is a string array.
  if (!Array.isArray(rssUrls) || rssUrls.some((s) => typeof s !== 'string')) {
    throw new Error('Failed to parse data string. RSS URLs list is invalid.');
  }
  rssUrls = rssUrls.map((s) => s.toString());
  return {
    ...o,
    shows: shows,
    rssUrls: rssUrls,
  };
};
/* eslint-enable @typescript-eslint/no-explicit-any */

/** An empty data object, useful as a placeholder or for testing. */
export const blankData = {
  shows: [],
  rssUrls: [],
  mediaRoot: '',
};
