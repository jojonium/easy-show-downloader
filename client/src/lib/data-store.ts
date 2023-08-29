import type { Data } from '@easy-show-downloader/common/src/data';
import { Show } from '@easy-show-downloader/common/src/show';
import { writable, type Invalidator, type Subscriber, type Unsubscriber } from 'svelte/store';

export function createDataStore(initial: Data): DataStore {
  if (initial.mediaRoot === undefined) initial.mediaRoot = '';
  const { subscribe, update, set } = writable(initial);

  return {
    subscribe,
    set,
    addShow: () => {
      update($data => {
        return {...$data, shows: [...$data.shows, new Show('', /.*/)]};
      });
    },
    addFeed: () => {
      update($data => {
        return {...$data, rssUrls: [...$data.rssUrls, '']};
      });
    },
    removeShow: (i: number) => {
      update($data => {
        return {...$data, shows: $data.shows.filter((_, j) => j !== i)};
      });
    },
    removeFeed: (i: number) => {
      update($data => {
        return {...$data, rssUrls: $data.rssUrls.filter((_, j) => j !== i)};
      });
    }
  };
}

export type DataStore = {
  subscribe: (run: Subscriber<Data>, invalidate?: Invalidator<Data> | undefined) => Unsubscriber,
  set: (value: Data) => void,
  addShow: () => void,
  addFeed: () => void,
  removeShow: (i: number) => void,
  removeFeed: (i: number) => void,
}
