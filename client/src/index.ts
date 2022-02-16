import {getData, postData, postDownload} from './api-helpers';
import {Data} from '@easy-show-downloader/common/dist/data';
import {Show} from '@easy-show-downloader/common/dist/show';
import {displayShows} from './display-shows';
import {displayRss} from './display-rss';

let globalData: Data;

const refreshData = async () => {
  document.getElementById('shows-container')?.classList.add('hidden');
  document.getElementById('feeds-container')?.classList.add('hidden');
  document.querySelectorAll('.loading')
      .forEach((elt) => elt.classList.add('glow'));
  globalData = await getData();
  console.log(globalData);
  updateShowDisplay(globalData);
  updateFeedsDisplay(globalData);
  const mediaRootInput =
    document.getElementById('media-root-input') as HTMLInputElement;
  if (mediaRootInput) mediaRootInput.value = globalData.mediaRoot ?? '';
  document.getElementById('shows-container')?.classList.remove('hidden');
  document.getElementById('feeds-container')?.classList.remove('hidden');
  document.querySelectorAll('.loading')
      .forEach((elt) => elt.classList.remove('glow'));
};

const updateShowDisplay = (data: Data) => {
  const parent = document.getElementById('shows-container');
  if (parent === null) throw new Error('Can\'t get shows container!');
  displayShows(data, parent);
};

const updateFeedsDisplay = (data: Data) => {
  const parent = document.getElementById('feeds-container');
  if (parent === null) throw new Error('Can\'t get feeds container!');
  displayRss(data, parent);
};

window.onload = async () => {
  document.getElementById('add-show')?.addEventListener('click', function() {
    globalData.shows.push(new Show('', /.*/));
    updateShowDisplay(globalData);
  });
  document.getElementById('add-feed')?.addEventListener('click', function() {
    globalData.rssUrls.push('');
    updateFeedsDisplay(globalData);
  });
  const mediaRootInput =
    document.getElementById('media-root-input') as HTMLInputElement;
  if (mediaRootInput) {
    mediaRootInput.addEventListener('change', function() {
      globalData.mediaRoot = mediaRootInput.value;
    });
  }
  const saveButton = document.getElementById('save');
  if (saveButton !== null) {
    saveButton.addEventListener('click', async function() {
      document.querySelectorAll('button').forEach((elt) => elt.disabled = true);
      const oldText = saveButton.innerText;
      saveButton.innerHTML = 'Saving...'.padEnd(oldText.length, '\xa0');
      await postData(globalData);
      saveButton.innerHTML = oldText;
      document.querySelectorAll('button')
          .forEach((elt) => elt.disabled = false);
    });
  }
  const downloadButton = document.getElementById('download');
  if (downloadButton !== null) {
    downloadButton.addEventListener('click',
        async function() {
          document.querySelectorAll('button')
              .forEach((elt) => elt.disabled = true);
          const oldText = downloadButton.innerText;
          downloadButton.innerHTML =
          'Downloading...'.padEnd(oldText.length, '\xa0');
          await postDownload();
          downloadButton.innerHTML = oldText;
          document.querySelectorAll('button')
              .forEach((elt) => elt.disabled = false);
        });
  }
  await refreshData();
};
