import {
  Data,
  parsePlainDataObject,
  stringifyData,
} from '@easy-show-downloader/common/dist/data';
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
    } catch (e: any) {
      log('Error! Failed to parse data from server: ' + e?.message, true);
    }
  } else {
    const json = await res.json();
    console.error(json);
    log(
      `${res.status} Error! Failed to retrieve data from server: ` +
      json['message'],
      true
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
        `${res.status} Error! Failed to post data to server: ${json['message']}`,
        true
      );
    }
  } catch (e: any) {
    console.error(e);
    log('Error! Failed to post data to server: ' + e?.message, true);
  }
};
