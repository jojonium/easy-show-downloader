import {Data} from '@easy-show-downloader/common/dist/data';

export const displayShows = (data: Data, parent: HTMLElement) => {
  parent.innerHTML = '';
  if (data.shows.length === 0) {
    const node = document.createElement('p');
    node.innerText = 'No shows.';
    parent.appendChild(node);
    return;
  }

  for (const show of data.shows) {
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function () {
      data.shows = data.shows.filter((s) => s !== show);
      displayShows(data, parent);
    });

    const showItem = document.createElement('div');
    showItem.classList.add('show-item');
    const titleElt = document.createElement('input');
    titleElt.setAttribute('type', 'text');
    titleElt.setAttribute('value', show.title);
    titleElt.setAttribute('placeholder', 'Title');
    titleElt.addEventListener('change', function () {
      show.title = this.value;
    });
    showItem.append(titleElt);

    const regexElt = document.createElement('input');
    regexElt.setAttribute('type', 'text');
    regexElt.setAttribute('value', show.regex.source);
    regexElt.setAttribute('placeholder', 'Regular Expression (optional)');
    regexElt.addEventListener('change', function () {
      if (this.value === '') {
        show.regex = new RegExp(show.title);
      } else {
        show.regex = new RegExp(this.value);
      }
    });
    showItem.append(regexElt);

    const folderElt = document.createElement('input');
    folderElt.setAttribute('type', 'text');
    folderElt.setAttribute('value', show.folder);
    folderElt.setAttribute('placeholder', 'Folder (optional)');
    folderElt.addEventListener('change', function () {
      show.folder = this.value;
    });
    showItem.append(folderElt);

    const feedElt = document.createElement('input');
    feedElt.setAttribute('type', 'text');
    feedElt.setAttribute('value', show.feedUrl ?? '');
    feedElt.setAttribute('placeholder', 'Preferred RSS URL (optional)');
    feedElt.addEventListener('change', function () {
      show.feedUrl = this.value || undefined;
    });
    showItem.append(feedElt);

    showItem.append(deleteButton);

    parent.appendChild(showItem);
  }
};
