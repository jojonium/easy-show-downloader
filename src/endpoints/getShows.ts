import * as express from "express";
import { promises } from "fs";

export interface ShowFileFormat {
  shows: string[];
}

const sendSuccess = (res: express.Response, showArray: string[]) => {
  res.status(200).header("Content-Type", "application/json").send(
    JSON.stringify({
      message: "Successfully read shows file",
      shows: showArray,
      status: 200,
    })
  );
};

/**
 * Returns the list of shows
 *
 * Returns 200 along with a "shows" field containing an array of show names if
 * successful, or 500 if an internal server error occurred
 * @param req the HTML request
 * @param res the HTML response
 */
export const getShows = (req: express.Request, res: express.Response) => {
  promises.readFile("storage/shows.json", { encoding: "utf8" }).then((str) => {
    let json: ShowFileFormat;
    try {
      json = JSON.parse(str);
    } catch (err) {
      // invalid format
      sendSuccess(res, []);
    }
    sendSuccess(res, json.shows);
  }, (reason) => {
    // file doesn't exist
    sendSuccess(res, []);
  }).catch((reason: Error) => {
    res.status(500).header("Content-Type", "application/json").send(
      JSON.stringify({
        message: "Failed to read file",
        reason: reason.message,
        status: 500,
      })
    );
  });
};
