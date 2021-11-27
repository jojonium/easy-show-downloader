import Transmission from 'transmission-promise';
import {config} from './config';
/**
 * Adds torrent links to your torrent client, based on the parameters in the
 * config. Resolves with the number of new torrents added.
 * @param {object} showData
 */
export const addTorrents = async (showData: {
  [key: string]: { folder: string; links: string[] };
}): Promise<number> => {
  let count = 0;
  const t = new Transmission(config.transmission);
  for (const title in showData) {
    if (!showData[title]) continue;
    for (const link of showData[title]?.links ?? []) {
      // In automated tests we won't actually add the torrents.
      if (process.env['NODE_ENV'] !== 'test') {
        await t.addUrl(link, {
          'download-dir': showData[title]?.folder ?? title,
        });
      }
      count++;
    }
  }
  return count;
};
