import * as express from "express";
import { readFile } from "fs";

interface FileFormat {
  shows: string[];
}

/**
 * Returns the list of shows
 *
 * Returns 200 along with a "shows" field containing an array of show names if
 * successful, or 500 if an internal server error occurred
 * @param req the HTML request
 * @param res the HTML response
 */
export const getShows = (req: express.Request, res: express.Response) => {
  readFile("storage/shows.json", (err, data) => {
    let showArray: string[];
    if (err) {
      if (err.errno === -2) {
        // no such file
        showArray = [];
      } else {
        res.status(500).header("Content-Type", "application/json").send(
          JSON.stringify({
            message: "Failed to read file: " + err.message,
            status: 500,
          })
        );
        return;
      }
    }
    if (!err) { // if the showArray wasn't already set to []
      try {
        const json: FileFormat = JSON.parse(data.toString("utf8"));
        showArray = json.shows;
      } catch (e) {
        res.status(500).header("Content-Type", "application/json").send(
          JSON.stringify({
            exception: e,
            message: "Unable to process file contents",
            status: 500,
          })
        );
        return;
      }
    }
    res.status(200).header("Content-Type", "application/json").send(
      JSON.stringify({
        message: "Successfully read shows file",
        shows: showArray,
        status: 200,
      })
    );
  });
};
