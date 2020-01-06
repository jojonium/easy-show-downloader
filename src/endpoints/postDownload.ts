import * as express from "express";
import {
  OutObject,
} from "../checkTorrents";
import { downloadTorrents } from "../downloadTorrents";

export const postDownload = (req: express.Request, res: express.Response) => {
  downloadTorrents().then((value) => {
    res.status(value.status).header("Content-Type", "application/json").send(
      JSON.stringify(value)
    );
  }, (reason: OutObject) => {
    res.status(reason.status).header("Content-Type", "application/json").send(
      JSON.stringify(reason)
    );
  }).catch((err: Error) => {
    res.status(500).header("Content-Type", "application/json").send(
      JSON.stringify({
        message: "Error thrown, see reason for more details",
        reason: err.message,
        status: 500,
      })
    );
  });
};
