import {Data} from '@easy-show-downloader/common/dist/data';

export const displayRss = (data: Data, parent: HTMLElement) => {
  parent.innerHTML = '';
  if (data.rssUrls.length === 0) {
    const node = document.createElement('p');
    node.innerText = 'No RSS feeds.';
    parent.appendChild(node);
    return;
  }

  for (let i = 0; i < data.rssUrls.length; ++i) {
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function () {
      data.rssUrls = data.rssUrls.filter((_, j) => j !== i);
      displayRss(data, parent);
    });

    const feedItem = document.createElement('div');
    feedItem.classList.add('feed-item');

    const urlElt = document.createElement('input');
    urlElt.setAttribute('type', 'text');
    urlElt.setAttribute('value', data.rssUrls[i] ?? '');
    urlElt.classList.add('url');
    urlElt.setAttribute('placeholder', 'Title');
    urlElt.addEventListener('change', function () {
      data.rssUrls[i] = this.value;
    });

    feedItem.append(urlElt, deleteButton);
    parent.append(feedItem);
  }
};
