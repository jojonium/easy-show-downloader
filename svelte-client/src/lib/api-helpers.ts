import {
  type Data,
  parsePlainDataObject,
  stringifyData,
} from '@easy-show-downloader/common/src/data';
import {log} from './log';

/**
 * Fetches data from the server, resolving with the result.
 * @return {Promise<Data>}
 */
export const getData = async (): Promise<Data> => {
  const res = await fetch('/api/data');
  if (res.status === 200) {
    try {
      const json = await res.json();
      const data = parsePlainDataObject(json);
      log('Retreived data from server.');
      return data;
    } catch (e: unknown) {
      const message = (e instanceof Error) ? e.message : "" + e
      log('Error! Failed to parse data from server: ' + message, true);
    }
  } else {
    const json = await res.json();
    console.error(json);
    log(
        `${res.status} Error! Failed to retrieve data from server: ` +
      json['message'],
        true,
    );
  }
  return {shows: [], rssUrls: []};
};

/**
 * Sends data to the server. Throws an error if the server responds with an
 * error.
 * @param {Data} data
 */
export const postData = async (data: Data): Promise<void> => {
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: stringifyData(data),
    });
    if (res.status === 200) {
      log('Saved data to server.');
    } else {
      const json = await res.json();
      console.error(json);
      log(
          `${res.status} Error! Failed to post data: ${json['message']}`,
          true,
      );
    }
  } catch (e: unknown) {
    console.error(e);
    const message = (e instanceof Error) ? e.message : "" + e
    log('Error! Failed to post data to server: ' + message, true);
  }
};

/**
 * Tells the server to download new episodes.
 */
export const postDownload = async (): Promise<void> => {
  try {
    const res = await fetch('/api/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    });
    let json: {torrentsAdded?: number, message?: string} = {};
    try {
      json = await res.json();
    } catch (e) { /* continue */ }
    if (res.status === 200) {
      const count = json['torrentsAdded'] ?? 0;
      log(`Added ${count} torrent${count !== 1 ? 's' : ''}.`);
    } else {
      console.error(json);
      log(
          `${res.status} Error! Server responded with: ${json['message']} `,
          true,
      );
    }
  } catch (e: unknown) {
    console.error(e);
    const message = (e instanceof Error) ? e.message : "" + e
    log('Error! Failed to contact server: ' + message, true);
  }
};
