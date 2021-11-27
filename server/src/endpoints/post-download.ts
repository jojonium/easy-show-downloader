import {Request, Response} from 'express';
import {readDataFile} from '../fs-helper';
import {sendError} from './send-error';
import {logger} from '../logger';
import {config} from '../config';
import {resolveTorrents} from '../resolve-torrents';
import {addTorrents} from '../add-torrents';
import {Data} from '@easy-show-downloader/common/dist/data';

export const postDownload = async (_: Request, res: Response) => {
  logger.log('Checking for new torrents to download.');
  let data: Data = {shows: [], rssUrls: []};
  try {
    data = await readDataFile(config.DATA_FILE);
  } catch (e) {
    logger.log(
        'Failure in POST /api/download. ' +
        `Could not read data file at '${config.DATA_FILE}'.\n${e}`,
        'ERROR',
    );
    sendError(res, 500, 'Server failed to read show data.');
  }
  let torrentData = {};
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
    sendError(res, 500, 'Server resolve a list of torrent links.');
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
