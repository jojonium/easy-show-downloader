import type { Data } from '@easy-show-downloader/common/src/data';
import { Show } from '@easy-show-downloader/common/src/show';
import { writable, type Subscriber, type Invalidator, type Unsubscriber } from 'svelte/store';

/**
 * Modified version of Data from common/src with only the fields we care about
 * on the client side, plus IDs.
 */
export type ClientSideData = {
  shows: {folder: string, regex: RegExp, id: number}[],
  rssUrls: {url: string, id: number}[],
  mediaRoot: string
}

export type DataStore = {
  subscribe: (run: Subscriber<ClientSideData>, invalidate?: Invalidator<ClientSideData> | undefined) => Unsubscriber,
  set: (value: ClientSideData) => void,
  addShow: () => void,
  addFeed: () => void,
  removeShow: (i: number) => void,
  removeFeed: (i: number) => void,
}

export function createDataStore(initial: Data): DataStore {
  let si = 1;
  let ri = 1;
  const csd: ClientSideData = {
    shows: initial.shows.map(s => {
      return {folder: s.folder, regex: s.regex, id: si++};
    }),
    rssUrls: initial.rssUrls.map(r => {
      return {url: r, id: ri++};
    }),
    mediaRoot: initial.mediaRoot ?? ''
  }
  const { subscribe, update, set } = writable(csd);

  return {
    subscribe,
    set,
    addShow: () => {
      update($data => {
        return {...$data, shows: [...$data.shows, {folder: '', regex: /.*/, id: si++}]};
      });
    },
    addFeed: () => {
      update($data => {
        return {...$data, rssUrls: [...$data.rssUrls, {url: '', id: ri++}]};
      });
    },
    removeShow: (id: number) => {
      update($data => {
        return {...$data, shows: $data.shows.filter((s) => s.id !== id)};
      });
    },
    removeFeed: (id: number) => {
      update($data => {
        return {...$data, rssUrls: $data.rssUrls.filter((r) => r.id !== id)};
      });
    }
  };
}

/**
 * Converts a client-side data to the data format accepted by the server.
 */
export const toServerFormat = (d: ClientSideData): Data => {
  return {
    mediaRoot: d.mediaRoot,
    shows: d.shows.map(s => new Show('', s.regex, s.folder)),
    rssUrls: d.rssUrls.map(r => r.url)
  };
}

export const stringify = (
  d: ClientSideData
): {mediaRoot: string, shows: string, rssUrls: string} => {
  return {
    mediaRoot: d.mediaRoot,
    shows: JSON.stringify(d.shows.map(s => {
      return {...s, regex: s.regex.source};
    })),
    rssUrls: JSON.stringify(d.rssUrls)
  };
}
