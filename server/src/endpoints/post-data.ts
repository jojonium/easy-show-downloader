import {Request, Response} from 'express';
import {parsePlainDataObject, writeDataFile} from '../fs-helper';
import {sendError} from './send-error';
import {logger} from '../logger';
import {config} from '../config';

export const postData = async (req: Request, res: Response) => {
  try {
    const data = parsePlainDataObject(req.body);
    try {
      await writeDataFile(config.DATA_FILE, data);
    } catch (e) {
      logger.log(
          'Failure in POST /data. ' +
        `Could not write data file to '${config.DATA_FILE}'.\n${e}`,
          'ERROR',
      );
      sendError(res, 500, 'Server failed to write show data.');
    }
    res.status(200).end();
  } catch (e: any) {
    logger.log(
        `Failure in POST /data. Invalid request.'.\n${e}`,
        'ERROR',
    );
    sendError(
        res,
        400,
        'Invalid request. Failed to parse data object from body.',
        {body: req.body, error: e.message},
    );
  }
};