import {
  type Data,
  parsePlainDataObject,
  stringifyData,
} from '@easy-show-downloader/common/src/data';

const API_HOST = import.meta.env.VITE_API_HOST ?? '';

/**
 * Fetches data from the server, resolving with the result or rejecting with an
 * Error containing a descriptive message.
 * @return {Promise<Data>}
 */
export const getData = async (): Promise<Data> => {
  const res = await fetch(`${API_HOST}/api/data`);
  if (res.status === 200) {
    const json = await res.json();
    const data = parsePlainDataObject(json);
    return data;
  } else {
    let message = `${res.status} Error from server!`;
    try {
      const json = await res.json();
      console.error(json);
      message += ' "' + json['message'] + '"';
    } catch (_) { /* Continue */}
    throw new Error(message);
  }
};

/**
 * Sends data to the server. Throws an error if the server responds with an
 * error.
 * @param {Data} data
 */
export const postData = async (data: Data): Promise<void> => {
  const res = await fetch(`${API_HOST}/api/data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: stringifyData(data),
  });
  if (res.status === 200) {
    return;
  } else {
    let message = `${res.status} Error from server!`;
    try {
      const json = await res.json();
      console.error(json);
      message += ' "' + json['message'] + '"';
    } catch (_) { /* Continue */}
    throw new Error(message);
  }
};

/**
 * Tells the server to download new episodes. Throws an error if the error
 * responds with an error.
 * @returns {number} the number of torrents added
 */
export const postDownload = async (): Promise<number> => {
  const res = await fetch(`${API_HOST}/api/download`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
  if (res.status === 200) {
    return (await res.json())['torrentsAdded'];
  } else {
    let message = `${res.status} Error from server!`;
    try {
      const json = await res.json();
      console.error(json);
      message += ' "' + json['message'] + '"';
    } catch (_) { /* Continue */}
    throw new Error(message);
  }
};

/**
 * Tells the server to download ALL episodes from a single RSS feed to a
 * particular folder.
 * @param folder The folder under the media root to download to.
 * @param rssUrl URL of the RSS feed.
 * @returns {number} the number of torrents added
 */
export const postBulkDownload =
  async (folder: string, rssUrl: string): Promise<number> => {
    const res = await fetch(`${API_HOST}/api/bulk-download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({folder, rssUrl})
    });
    if (res.status === 200) {
      return (await res.json())['torrentsAdded'];
    } else {
      let message = `${res.status} Error from server!`;
      try {
        const json = await res.json();
        console.error(json);
        message += ' "' + json['message'] + '"';
      } catch (_) { /* Continue */}
      throw new Error(message);
    }
  };
