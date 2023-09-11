import Transmission from 'transmission-promise';
import {config} from './config';
import path from 'path';

/**
 * Adds torrent links to your torrent client, based on the parameters in the
 * config. Resolves with the number of new torrents added.
 * @param {Array<{folder: string, link: string}>} links List of Magnet links
 * and the folder to download them to.
 * @param {string} mediaRoot Optional root directory to download to.
 */
export const addTorrents = async (
    links: Array<{folder: string, link: string}>,
    mediaRoot: string = '',
): Promise<number> => {
  let count = 0;
  const t = new Transmission(config.transmission);
  for (const {folder, link} of links) {
    // In automated tests we won't actually add the torrents.
    if (process.env['NODE_ENV'] !== 'test') {
      await t.addUrl(link, {
        'download-dir': path.join(mediaRoot, folder.trim()),
      });
    }
    count++;
  }
  return count;
};
