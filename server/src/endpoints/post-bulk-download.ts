import {Request, Response} from 'express';
import {readDataFile} from '../fs-helper';
import {sendError} from './send-error';
import {logger} from '../logger';
import {config} from '../config';
import {addTorrents} from '../add-torrents';
import {Data} from '@easy-show-downloader/common/dist/data';
import {bulkResolve} from '../bulk-resolve';

/**
 * Downloads ALL torrents from an RSS feed to a single folder. The request body
 * should be a JSON in the format {folder: string, rssUrl: string}.
 */
export const postBulkDownload = async (req: Request, res: Response) => {
  logger.log('Downloading all torrents from an RSS feed.');
  const folder = req.body['folder'] ?? '';
  if (!req.body['rssUrl']) {
    logger.log(
      'Failure in POST /api/bulk-download. Request body should be in he format ' +
      '{folder: string, rssUrl: string}.',
      'ERROR',
    );
    sendError(
      res,
      400,
      'Request body should be in the format {folder: string, rssUrl: string}');
    return;
  }
  const rssUrl = req.body['rssUrl'] ?? '';

  let data: Data;
  try {
    data = await readDataFile(config.DATA_FILE);
  } catch (e) {
    logger.log(
      'Failure in POST /api/bulk-download. ' +
      `Could not read data file at '${config.DATA_FILE}'.\n${e}`,
      'ERROR',
    );
    sendError(res, 500, 'Server failed to read show data.');
    return;
  }
  let torrentData = [];
  try {
    torrentData = await bulkResolve(folder, rssUrl);
  } catch (e) {
    logger.log(
      'Failure in POST /api/bulk-download. Could not resolve torrents from:\n' +
      '"' + rssUrl + '"\n' +
      e,
      'ERROR'
    );
    sendError(res, 500, 'Server failed to resolve a list of torrent links.');
    return;
  }
  try {
    const count = await addTorrents(torrentData, data.mediaRoot);
    res.status(200).type('application/json').send({torrentsAdded: count});
  } catch (e) {
    logger.log(
      'Failure in POST /api/bulk-download. ' +
      `Could not add torrents to the client.\n${e}`,
      'ERROR',
    );
    sendError(res, 500, 'Server failed to add torrents to the client.');
  }
};
