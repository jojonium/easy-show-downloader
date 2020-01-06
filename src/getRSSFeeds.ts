import * as Parser from "rss-parser";

/**
 * Fetches any number of RSS feeds asynchronously
 * @param urls list of complete urls of RSS feeds to fetch
 * @return a promise that resolves with an array of objects representing the
 * output of each RSS feed
 */
export const getRSSFeeds = (urls: string[]): Promise<Parser.Output[]> => {
  const parser = new Parser();

  // convert urls to array of functions returning promises
  const functions = urls.map((url) => () => parser.parseURL(url));

  // this function executes an array of promises in sequence, returning one big
  // promise that wraps them and resolves to the concatentation of their results
  const serial = (funcs: Array<() => Promise<Parser.Output>>) =>
    funcs.reduce((promise, func) => promise.then((result) =>
      func().then(Array.prototype.concat.bind(result))), Promise.resolve([]));

  return serial(functions);
};
