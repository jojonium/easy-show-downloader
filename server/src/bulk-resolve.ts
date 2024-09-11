import {Data} from '@easy-show-downloader/common/dist/data';
import {Show} from '@easy-show-downloader/common/dist/show';
import {resolveTorrents} from './resolve-torrents';

/**
 * Helper for downloading ALL torrents from an RSS feed to a single folder.
 * Returns the list of torrent links.
 * @param folder The folder to download to within the media root.
 * @param url URL of the RSS feed.
 */
export const bulkResolve = async (
  folder: string,
  url: string
): Promise<Array<{folder: string, link: string}>> => {
  const data: Data = {
    shows: [new Show(folder)],
    rssUrls: [url]
  };
  return await resolveTorrents(data, true);
};
