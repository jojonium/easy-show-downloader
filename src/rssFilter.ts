import * as Parser from "rss-parser";
import { ShowTuple } from "./checkTorrents";

/**
 * Returns a list of torrents from any of the RSS feeds that match any of the
 * desired show titles and have unique episode numbers
 * @param feeds a list of RSS feeds to search through for relevant items
 * @param shows a list of regular expressions to search for, with a capturing
 * group named 'episode' that contains the episode number and a capturing group
 * named 'name' that contains the show name
 */
export const rssFilter = (
  feeds: Parser.Output[],
  shows: RegExp[]
): ShowTuple[] => {
  const wantedLinks = new Array<ShowTuple>();

  for (const regex of shows) {
    for (const feed of feeds) {
      for (const item of feed.items) {
        const m = item.title.match(regex);
        if (m !== null && m.length >= 3) {
          const episode = +m.groups.episode;
          const name = m.groups.name;
          if (
            !wantedLinks.some(
              (val) => val.episodeNumber === episode && val.showName === name
            )
          ) {
            // don't have this episode yet
            wantedLinks.push({
              episodeNumber: episode,
              fileName: item.title,
              link: item.link,
              showName: name,
            });
          }
        }
      }
    }
  }

  return wantedLinks;
};
