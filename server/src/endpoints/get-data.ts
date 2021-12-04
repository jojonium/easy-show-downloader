import {Request, Response} from 'express';
import {readDataFile} from '../fs-helper';
import {config} from '../config';
import {sendError} from './send-error';
import {logger} from '../logger';
import {stringifyData} from '@easy-show-downloader/common/dist/data';

export const getData = async (_: Request, res: Response) => {
  try {
    const data = await readDataFile(config.DATA_FILE);
    res
        .status(200)
        .header('Content-Type', 'application/json')
        .send(stringifyData(data));
  } catch (e) {
    logger.log(
        'Failure in GET /api/data. ' +
      `Could not read data file '${config.DATA_FILE}'.\n${e}`,
        'ERROR',
    );
    sendError(res, 500, 'Server failed to read show data.');
  }
};
