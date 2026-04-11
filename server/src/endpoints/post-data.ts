import {Request, Response} from 'express';
import {writeDataFile} from '../fs-helper.js';
import {parsePlainDataObject} from '@easy-show-downloader/common/dist/data.js';
import {sendError} from './send-error.js';
import {logger} from '../logger.js';
import {config} from '../config.js';

export const postData = async (req: Request, res: Response) => {
  try {
    const data = parsePlainDataObject(req.body);
    try {
      await writeDataFile(config.DATA_FILE, data);
    } catch (e) {
      logger.log(
        'Failure in POST /api/data. ' +
        `Could not write data file to '${config.DATA_FILE}'.\n${e}`,
        'ERROR',
      );
      sendError(res, 500, 'Server failed to write show data.');
      return;
    }
    res.status(200).end();
  } catch (e) {
    const err = e as {message: string};
    logger.log(`Failure in POST /api/data. Invalid request.'.\n${err}`, 'ERROR');
    sendError(
      res,
      400,
      'Invalid request. Failed to parse data object from body.',
      {body: req.body, error: err.message},
    );
  }
};
