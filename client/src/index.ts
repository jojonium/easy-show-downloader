import {getData} from './api-helpers';
import {Data} from '@easy-show-downloader/common/dist/data';
import {Show} from '@easy-show-downloader/common/dist/show';

let data: Data;

const refreshData = async () => {
  document.getElementById('shows-container')?.classList.add('hidden');
  document.getElementById('feeds-container')?.classList.add('hidden');
  document.querySelectorAll('.loading')
    .forEach(elt => elt.classList.add('glow'));
  data = await getData();
  console.log(data);
  updateShowDisplay(data.shows);
  updateFeedsDisplay(data.rssUrls);
  document.getElementById('shows-container')?.classList.remove('hidden');
  document.getElementById('feeds-container')?.classList.remove('hidden');
  document.querySelectorAll('.loading')
    .forEach(elt => elt.classList.remove('glow'));
};

const updateShowDisplay = (shows: Show[]) => {
  const parent = document.getElementById('shows-container');
  if (parent === null) throw new Error('Can\'t get shows container!');
  if (shows.length === 0) {
    const node = document.createElement('p');
    node.innerText = 'No shows.';
    parent.appendChild(node);
    return;
  }
  // TODO Display shows.
};

const updateFeedsDisplay = (rssFeeds: string[]) => {
  const parent = document.getElementById('feeds-container');
  if (parent === null) throw new Error('Can\'t get feeds container!');
  if (rssFeeds.length === 0) {
    const node = document.createElement('p');
    node.innerText = 'No RSS feeds.';
    parent.appendChild(node);
    return;
  }
  // TODO Display RSS URLs.
};

window.onload = async () => {
  await refreshData();
};
