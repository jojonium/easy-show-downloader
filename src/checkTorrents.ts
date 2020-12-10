import { promises } from "fs";
import * as Parser from "rss-parser";
import Transmission = require("transmission-promise");
import { ShowFileFormat } from "./endpoints/getShows";
import { rssFilter } from "./rssFilter";

export interface Config {
  rssURLs: string[];
  showDirectory: string;
  transmissionOptions: {
    host: string;
    port: number;
    username: string;
    password: string;
    ssl: boolean;
    url: string;
  };
}

export interface ShowTuple {
  showName: string;
  link: string;
  fileName: string;
  episodeNumber: number;
}

export interface OutObject {
  status: number;
  message: string;
  reason: object | string;
}

/**
 * Gets the list of episodes we need to download
 * @param config the object contained in config.json
 * @param transmission a object for connecting to the Transmission server
 * @return a promise that resolves with a list of episodes we want or rejects
 * with an object like this in case of an error:
 * {
 *   status: 500,
 *   message: "Something went wrong",
 *   reason: {Some kind of Error object}
 * }
 */
export const getEpisodesToDownload = (
  config: Config,
  transmission: Transmission
): Promise<ShowTuple[]> => {
  let torrentNames: string[];
  let shows: RegExp[];

  return new Promise((resolve, reject) => {
    // get the list of desired shows from the file
    promises
      .readFile("storage/shows.json", { encoding: "utf8" })
      .then(
        (res) => {
          let json: ShowFileFormat;
          try {
            if (typeof res !== "string") {
              throw new Error("Failed to read shows.json");
            }
            json = JSON.parse(res);
            shows = json.shows.map((s) => new RegExp(s));
          } catch (err) {
            throw new Error("Invalid shows.json format");
          }

          // get the list of all torrent names from transmission
          return transmission.get(false, ["name"]);
        },
        (reason) => {
          reject({
            message: "Failed to read shows.json",
            reason,
            status: 500,
          });
          return;
        }
      )
      .then(
        (res) => {
          torrentNames = res.torrents.map((obj: { name: string }) => obj.name);
          // parse RSS feeds for desired torrents
          return getRSSFeeds(config.rssURLs);
        },
        (reason) => {
          reject({
            message: "Failed to get torrent names from Transmission",
            reason,
            status: 500,
          });
          return;
        }
      )
      .then(
        (res) => {
          if (!res) {
            throw new Error("Failed to get RSS feeds");
          }
          // get list of torrents we want
          const wantedLinks = rssFilter(res, shows);
          // see if we already have any of these torrents
          const confirmedLinks: ShowTuple[] = [];
          for (const wanted of wantedLinks) {
            let alreadyHave = false;
            for (const torrentName of torrentNames) {
              if (wanted.fileName === torrentName) {
                alreadyHave = true;
                break;
              }
            }
            // we don't have wanted yet
            if (!alreadyHave) confirmedLinks.push(wanted);
          }
          // we found all the links we need, resolve now
          resolve(confirmedLinks);
        },
        (reason) => {
          reject({
            message: "Failed to get RSS feeds",
            reason,
            status: 500,
          });
          return;
        }
      )
      .catch((err: Error) => {
        reject({
          message: "Error was thrown, see reason for details",
          reason: err.message,
          status: 500,
        });
        return;
      });
  });
};

/**
 * Fetches any number of RSS feeds asynchronously
 * @param urls list of complete urls of RSS feeds to fetch
 * @return a promise that resolves with an array of objects representing the
 * output of each RSS feed
 */
const getRSSFeeds = (urls: string[]): Promise<Parser.Output[]> => {
  // convert urls to array of functions returning promises
  const functions = urls.map((url) => () => {
    let parser: Parser = new Parser();
    // special cases for known URLs
    if (/https:\/\/nyaa.si\/.*/.test(url)) {
      parser = new Parser({
        customFields: {
          item: ["nyaa:seeders"],
        },
      });
    }
    return parser.parseURL(url);
  });

  // this function executes an array of promises in sequence, returning one big
  // promise that wraps them and resolves to the concatentation of their results
  const serial = (funcs: Array<() => Promise<Parser.Output>>) =>
    funcs.reduce(
      (promise, func) =>
        promise.then((result) =>
          func().then(Array.prototype.concat.bind(result))
        ),
      Promise.resolve([])
    );

  return serial(functions);
};

/**
 * Adds any number of torrents asynchronously
 * @param transmission Transmission object
 * @param shows list of shows we want to add
 * @param baseDir base directory for TV shows, which contains each show's
 * individual folder
 * @return a promise that resolves with nothing
 */
export const addAllTorrents = (
  transmission: Transmission,
  shows: ShowTuple[],
  baseDir: string
): Promise<void> => {
  // execute each promise sequentially
  let p = Promise.resolve();
  shows.forEach((show) => {
    let downloadTo = baseDir;
    if (downloadTo.slice(-1) !== "/") downloadTo += "/";
    downloadTo += show.showName;
    p = p.then(() =>
      transmission.addUrl(show.link, {
        "download-dir": downloadTo,
      })
    );
  });
  return p;
};
