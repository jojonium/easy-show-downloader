import {Data} from '@easy-show-downloader/common/dist/data';
import Parser from 'rss-parser';
import {logger} from './logger';

/**
 * Reads the RSS feeds and shows specified in the data file and finds all
 * matching torrents, returning a map of show titles to folder names and
 * matching torrent links.
 * @param {Data} data
 */
export const resolveTorrents = async (
    data: Data,
): Promise<{[key: string]: {folder: string; links: string[]}}> => {
  const parser = new Parser();
  const matchingLinks: {[key: string]: {folder: string; links: string[]}} =
    {};
  for (const s of data.shows) {
    matchingLinks[s.title] = {
      folder: s.folder,
      links: [],
    };
  }

  for (const url of data.rssUrls) {
    try {
      const feed = await parser.parseURL(url);
      const shows = data.shows.filter(
          (s) => s.feedUrl === undefined || s.feedUrl === url,
      );
      for (const item of feed.items) {
        for (const show of shows) {
          if (show.regex.test(item.title ?? '') && item.link) {
            matchingLinks[show.title]?.links.push(item.link);
          }
        }
      }
    } catch (err) {
      logger.log(`Problem fetching or parsing RSS URL "${url}":\n` +
        err,
      'WARN');
      continue;
    }
  }
  return matchingLinks;
};
