import {Data} from '@easy-show-downloader/common/dist/data';
import Parser from 'rss-parser';
import {logger} from './logger';

/**
 * Reads the RSS feeds and shows specified in the data file and finds all
 * matching torrents, returning a list of links and the folders to download them
 * to.
 * @param {Data} data
 */
export const resolveTorrents = async (
    data: Data,
): Promise<Array<{folder: string, link: string}>> => {
  const parser = new Parser();
  const links: {folder: string, link: string}[] = [];

  for (const url of data.rssUrls) {
    try {
      const shows = data.shows.filter(
          (s) => s.feedUrl === undefined || s.feedUrl === url,
      );
      if (shows.length === 0) continue; // No shows actually want this feed.

      const feed = await parser.parseURL(url);
      for (const item of feed.items) {
        for (const show of shows) {
          if (item.title && item.link && show.regex.test(item.title)) {
            links.push({
              folder: (show.folder),
              link: item.link,
            });
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
  return links;
};
