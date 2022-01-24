import {getData, postData, postDownload} from './api-helpers';
import {Data} from '@easy-show-downloader/common/dist/data';
import {Show} from '@easy-show-downloader/common/dist/show';
import {displayShows} from './display-shows';
import {displayRss} from './display-rss';

let data: Data;

const refreshData = async () => {
  document.getElementById('shows-container')?.classList.add('hidden');
  document.getElementById('feeds-container')?.classList.add('hidden');
  document.querySelectorAll('.loading')
      .forEach((elt) => elt.classList.add('glow'));
  data = await getData();
  console.log(data);
  updateShowDisplay(data);
  updateFeedsDisplay(data);
  const mediaRootInput =
    document.getElementById('media-root-input') as HTMLInputElement;
  if (mediaRootInput) mediaRootInput.value = data.mediaRoot ?? '';
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
    data.shows.push(new Show('', new RegExp('')));
    updateShowDisplay(data);
  });
  document.getElementById('add-feed')?.addEventListener('click', function() {
    data.rssUrls.push('');
    updateFeedsDisplay(data);
  });
  const mediaRootInput =
    document.getElementById('media-root-input') as HTMLInputElement;
  if (mediaRootInput) {
    mediaRootInput.addEventListener('change', function() {
      data.mediaRoot = mediaRootInput.value;
    });
  }
  const saveButton = document.getElementById('save');
  if (saveButton !== null) {
    saveButton.addEventListener('click', async function() {
      document.querySelectorAll('button').forEach((elt) => elt.disabled = true);
      const oldText = saveButton.innerText;
      saveButton.innerHTML = 'Saving...'.padEnd(oldText.length, '\xa0');
      await postData(data);
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
