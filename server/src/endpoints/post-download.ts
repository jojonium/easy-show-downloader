import {Request, Response} from 'express';
import {readDataFile} from '../fs-helper.js';
import {sendError} from './send-error.js';
import {logger} from '../logger.js';
import {config} from '../config.js';
import {resolveTorrents} from '../resolve-torrents.js';
import {addTorrents} from '../add-torrents.js';
import {Data} from '@easy-show-downloader/common/dist/data.js';

export const postDownload = async (_: Request, res: Response) => {
  logger.log('Checking for new torrents to download.');
  let data: Data;
  try {
    data = await readDataFile(config.DATA_FILE);
  } catch (e) {
    logger.log(
      'Failure in POST /api/download. ' +
      `Could not read data file at '${config.DATA_FILE}'.\n${e}`,
      'ERROR',
    );
    sendError(res, 500, 'Server failed to read show data.');
    return;
  }
  let torrentData = [];
  try {
    torrentData = await resolveTorrents(data);
  } catch (e) {
    logger.log(
      'Failure in POST /api/download. Could not resolve torrents with \n' +
      `rssFeeds: [${data.rssUrls.join(', ')}]\n` +
      `shows:\n\t${data.shows.map((s) => s.toJsonString()).join('\n\t')}\n` +
      e,
      'ERROR',
    );
    sendError(res, 500, 'Server failed to resolve a list of torrent links.');
    return;
  }
  try {
    const count = await addTorrents(torrentData, data.mediaRoot);
    res.status(200).type('application/json').send({torrentsAdded: count});
  } catch (e) {
    logger.log(
      'Failure in POST /api/download. ' +
      `Could not add torrents to the client.\n${e}`,
      'ERROR',
    );
    sendError(res, 500, 'Server failed to add torrents to the client.');
  }
};
