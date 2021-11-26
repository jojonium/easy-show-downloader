import {Response} from 'express';

/**
 * Helper for sending an error response.
 * @param {Response} res Express response object.
 * @param {number} statusCode HTTP status code, e.g. 401.
 * @param {string} message Short message describing the error.
 */
export const sendError = async (
    res: Response,
    statusCode: number,
    message: string,
) => {
  res
      .status(statusCode)
      .header('Content-Type', 'application/json')
      .send(JSON.stringify({statusCode, message}));
};
