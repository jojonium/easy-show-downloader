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

export const getEpisodesToDownload = () => {
  let config: Config;
  let transmission: Transmission;
  let torrentNames: string[];
  let shows: string[];

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
      throw reason;
    })
    .then((res) => {
      let json: ShowFileFormat;
      try {
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
      throw reason;
    })
    .then((res) => {
      torrentNames = res.torrents.map((obj: { name: string }) => obj.name);

      // parse RSS feeds for desired torrents
      return getRSSFeeds(config.rssURLs);
    }, (reason) => {
      throw reason;
    }).then((res) => {
      const wantedLinks: ShowTuple[] = [];
      // get list of torrents we want
      // this could probably be more efficient
      for (const feed of res) {
        for (const item of feed.items) {
          for (const show of shows) {
            const regex = new RegExp(`(\[.*\])? ?${show} - \d*.*`);
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
      // tslint:disable-next-line: no-console
      console.log(wantedLinks);
    }, (reason) => {
      throw reason;
    });
};

getEpisodesToDownload();

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
