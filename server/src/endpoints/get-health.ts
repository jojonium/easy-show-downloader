import {Request, Response} from 'express';
import {config} from '../config.js';
import {readDataFile} from '../fs-helper.js';
import {sendError} from './send-error.js';
import {logger} from '../logger.js';

export const getHealth = async (_: Request, res: Response) => {
  // Make sure data file is readable.
  try {
    await readDataFile(config.DATA_FILE);
  } catch (e) {
    logger.log(
      'Failure in GET /api/health. ' +
      `Could not read data file '${config.DATA_FILE}'.\n${e}`,
      'ERROR',
    );
    sendError(res, 500, 'Unable to read data file.');
    return;
  }
  res.status(200).header('Content-Type', 'text/plain').send('Healthy!');
};
