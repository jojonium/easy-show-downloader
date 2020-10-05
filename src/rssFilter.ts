import * as Parser from "rss-parser";
import { ShowTuple } from "./checkTorrents";

/**
 * Returns a list of torrents from any of the RSS feeds that match any of the
 * desired show titles
 * @param feeds a list of RSS feeds to search through for relevant items
 * @param shows a list of show titles to search for
 */
export const rssFilter = (
  feeds: Parser.Output[],
  shows: string[]
): ShowTuple[] => {
  const wantedLinks = new Array<ShowTuple>();

  for (const feed of feeds) {
    for (const show of shows) {
      let bestShowMatch: Parser.Item;
      for (const item of feed.items) {
        let regex: RegExp;
        // specific regexes for known providers
        regex = new RegExp(`(\[.*\])? ?${show} - \d*.*`, "i");
        if (feed.link === "https://nyaa.si/") {
          regex = new RegExp(`(\[.*\])? ?${show} - \d+ \[1080p\].*`, "i");
        }

        if (regex.test(item.title)) {
          // for Nyaa torrents (where seeders are reported) grab only the
          // highest-seeded torrent
          if (
            bestShowMatch === undefined ||
            item["nyaa:seeders"] > bestShowMatch["nyaa:seeders"]
          ) {
            bestShowMatch = item;
          }
        }
      }
      if (bestShowMatch !== undefined) {
        wantedLinks.push({
          episodeName: bestShowMatch.title,
          link: bestShowMatch.link,
          showName: show,
        });
      }
    }
  }

  return wantedLinks;
};
