import { promises } from "fs";
import * as Parser from "rss-parser";
import Transmission = require("transmission-promise");
import { ShowFileFormat } from "./endpoints/getShows";

interface Config {
  rssURLs: string[];
  transmissionOptions: {
    host: string;
    port: number;
    username: string;
    password: string;
    ssl: boolean;
    url: string;
  };
}

interface ShowTuple {
  showName: string;
  link: string;
  episodeName: string;
}

/**
 * Gets the list of episodes we need to download
 * @return a promise that resolves with a list of episodes we want or rejects
 * with an object like this in case of an error:
 * {
 *   status: 500,
 *   message: "Something went wrong",
 *   reason: {Some kind of Error object}
 * }
 */
export const getEpisodesToDownload = (): Promise<ShowTuple[]> => {
  let config: Config;
  let transmission: Transmission;
  let torrentNames: string[];
  let shows: string[];

  return new Promise((resolve, reject) => {
    promises
      .readFile("../config.json", { encoding: "utf8" })
      .then((value) => {
        // save the config value for later
        config = JSON.parse(value);
        if (config.rssURLs.length < 1) {
          throw new Error("No RSS URLs provided in config.json");
        }

        // get the list of desired shows from the file
        return promises.readFile("../storage/shows.json", { encoding: "utf8" });
      }, (reason) => {
        reject({
          message: "Failed to read config.json",
          reason,
          status: 500,
        });
        return;
      })
      .then((res) => {
        let json: ShowFileFormat;
        try {
          if (typeof res !== "string") {
            throw new Error("Failed to read shows.json");
          }
          json = JSON.parse(res);
        } catch (err) {
          // invalid format
          throw new Error("Invalid shows.json format");
        }
        shows = json.shows;

        // get the list of all torrent names from transmission
        transmission = new Transmission(config.transmissionOptions);
        return transmission.get(false, ["name"]);
      }, (reason) => {
        reject({
          message: "Failed to read shows.json",
          reason,
          status: 500,
        });
        return;
      })
      .then((res) => {
        torrentNames = res.torrents.map((obj: { name: string }) => obj.name);
        // parse RSS feeds for desired torrents
        return getRSSFeeds(config.rssURLs);
      }, (reason) => {
        reject({
          message: "Failed to get torrent names from Transmission",
          reason,
          status: 500,
        });
        return;
      }).then((res) => {
        if (!res) {
          throw new Error("Failed to get RSS feeds");
        }
        const wantedLinks: ShowTuple[] = [];
        // get list of torrents we want
        // this could probably be more efficient
        for (const feed of res) {
          for (const item of feed.items) {
            for (const show of shows) {
              const regex = new RegExp(`(\[.*\])? ?${show} - \d*.*`, "i");
              if (item.title.match(regex) !== null) {
                wantedLinks.push({
                  episodeName: item.title,
                  link: item.link,
                  showName: show,
                });
                break;
              }
            }
          }
        }
        // see if we already have any of these torrents
        const confirmedLinks: ShowTuple[] = [];
        for (const wanted of wantedLinks) {
          let alreadyHave = false;
          for (const torrentName of torrentNames) {
            if (wanted.episodeName === torrentName) {
              // tslint:disable-next-line: no-console
              console.log(torrentName);
              alreadyHave = true;
              break;
            }
          }
          // we don't have wanted yet
          if (!alreadyHave) confirmedLinks.push(wanted);
        }
        // we found all the links we need, resolve now
        resolve(confirmedLinks);
      }, (reason) => {
        reject({
          message: "Failed to get RSS feeds",
          reason,
          status: 500,
        });
        return;
      }).catch((err: Error) => {
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
  const parser = new Parser();

  // convert urls to array of functions returning promises
  const functions = urls.map((url) => () => parser.parseURL(url));

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
