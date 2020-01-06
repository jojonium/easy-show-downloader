import * as express from "express";
import { promises } from "fs";

interface RequestBody {
  shows: string[];
}

/**
 * Updates the list of shows, replacing it with one sent in the request.
 * Required fields: "shows", which is an array of strings, each being a show
 * name
 *
 * Returns 200 if successfully updated, 400 if the request was invalid, or 500
 * if an internal server error occurred
 * @param req the HTML request
 * @param res the HTML response
 */
export const postShows = (req: express.Request, res: express.Response) => {
  let body: RequestBody;
  try {
    body = req.body;
  } catch (e) {
    res.status(400).header("Content-Type", "application/json").send(
      JSON.stringify({
        message: "Invalid request: missing or invalid 'shows' field",
        status: 400,
      })
    );
    return;
  }
  promises.mkdir(
    "storage",
    { mode: 0o775, recursive: true }
  ).then(() => {
    return promises.writeFile(
      "storage/shows.json",
      JSON.stringify(body),
      { mode: 0o664 }
    );
  }).then(() => {
    res.status(200).header("Content-Type", "application/json").send(
      JSON.stringify({
        message: "Shows list successfully updated",
        status: 200,
      })
    );
  }).catch((reason: Error) => {
    res.status(500).header("Content-Type", "application/json").send(
      JSON.stringify({
        message: "Failed to write to file",
        reason: reason.message,
        status: 500,
      })
    );
  });
};
