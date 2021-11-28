import {
  Data,
  parsePlainDataObject,
  stringifyData,
} from '@easy-show-downloader/common/dist/data';

/**
 * Fetches data from the server, resolving with the result.
 * @return {Promise<Data>}
 */
export const getData = async (): Promise<Data> => {
  const res = await fetch('/api/data');
  if (res.status === 200) {
    const json = await res.json();
    return parsePlainDataObject(json);
  } else {
    const json = await res.json();
    throw new Error(json['message']);
  }
};

/**
 * Sends data to the server. Throws an error if the server responds with an
 * error.
 * @param {Data} data
 */
export const postData = async (data: Data): Promise<void> => {
  const res = await fetch('/api/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: stringifyData(data),
  });
  if (res.status !== 200) {
    const json = await res.json();
    throw new Error(json['message']);
  }
};
