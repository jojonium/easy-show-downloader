import { promises } from "fs";
import Transmission = require("transmission-promise");
import {
  addAllTorrents,
  Config,
  getEpisodesToDownload,
  OutObject
} from "./checkTorrents";

/**
 * Downloads torrents for all new episodes
 */
export const downloadTorrents = (): Promise<OutObject> => {
  let config: Config;
  let transmission: Transmission;
  let numAdded: number;

  return new Promise((resolve, reject) => {
    promises.readFile("config.json", { encoding: "utf8" }).then((value) => {
      // save the config value for later
      config = JSON.parse(value);
      if (config.rssURLs.length < 1) {
        throw new Error("No RSS URLs provided in config.json");
      }

      transmission = new Transmission(config.transmissionOptions);

      return getEpisodesToDownload(config, transmission);
    }, (reason) => {
      reject({ status: 500, message: "Failed to read config.json", reason });
      return;
    }).then((result) => {
      if (!result || result.length < 1) {
        // no episodes to add
        resolve({ status: 200, message: "Added 0 episodes", reason: "" });
        return;
      }
      numAdded = result.length;
      // add each of the confirmed torrent links
      return addAllTorrents(transmission, result, config.showDirectory);
    }, (reason: OutObject) => {
      reject(reason);
      return;
    }).then(() => {
      // all torrents added, return success
      let message = "Added " + numAdded + " episode";
      if (numAdded !== 1) message += "s";
      resolve({ status: 200, message, reason: "" });
      return;
    }, (reason) => {
      reject({ status: 500, message: "Failed to add torrents", reason });
      return;
    })
    .catch((err: Error) => {
      throw err;
    });
  });
};
