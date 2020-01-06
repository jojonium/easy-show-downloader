import * as express from "express";
import { promises } from "fs";
import Transmission = require("transmission-promise");
import {
  addAllTorrents,
  Config,
  getEpisodesToDownload,
  RejectionObject,
} from "../checkTorrents";

const sendFailure = (
  res: express.Response,
  status: number,
  message: string,
  reason: object | string
) => {
  res.status(status).header("Content-Type", "application/json").send(
    JSON.stringify({
      message,
      reason,
      status,
    })
  );
};

const sendSuccess = (res: express.Response, num: number) => {
  res.status(200).header("Content-Type", "application/json").send(
    JSON.stringify({
      message: `Adding ${num} episode` + (num !== 1) ? "s" : "",
      status: 200,
    })
  );
};

export const postDownload = (req: express.Request, res: express.Response) => {
  let config: Config;
  let transmission: Transmission;
  let numAdded: number;

  promises.readFile("../config.json", { encoding: "utf8" }).then((value) => {
    // save the config value for later
    config = JSON.parse(value);
    if (config.rssURLs.length < 1) {
      throw new Error("No RSS URLs provided in config.json");
    }

    transmission = new Transmission(config.transmissionOptions);

    return getEpisodesToDownload(config, transmission);
  }, (reason) => {
    sendFailure(res, 500, "Failed to read config.json", reason);
    return;
  }).then((result) => {
    if (!result || result.length < 1) {
      // no episodes to add
      sendSuccess(res, 0);
      return;
    }
    numAdded = result.length;
    // add each of the confirmed torrent links
    return addAllTorrents(transmission, result, config.showDirectory);
  }, (reason: RejectionObject) => {
    sendFailure(res, reason.status, reason.message, reason.reason);
    return;
  }).then(() => {
    // all torrents added, return success
    sendSuccess(res, numAdded);
    return;
  }, (reason) => {
    sendFailure(res, 500, "Failed to add torrents", reason);
    return;
  })
  .catch((err: Error) => {
    sendFailure(
      res,
      500,
      "Error was thrown, see reason for details",
      err.message
    );
    return;
  });
};
