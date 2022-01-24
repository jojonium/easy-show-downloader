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
    deleteButton.addEventListener('click', function() {
      data.shows = data.shows.filter((s) => s !== show);
      displayShows(data, parent);
    });

    const showItem = document.createElement('div');
    showItem.classList.add('show-item');
    const titleElt = document.createElement('input');
    titleElt.setAttribute('type', 'text');
    titleElt.setAttribute('value', show.title);
    titleElt.classList.add('title');
    titleElt.setAttribute('placeholder', 'Title');
    titleElt.addEventListener('change', function() {
      show.title = titleElt.value;
    });
    showItem.append(titleElt);

    const regexElt = document.createElement('input');
    regexElt.setAttribute('type', 'text');
    regexElt.setAttribute('value', show.regex.source);
    regexElt.classList.add('regex');
    regexElt.setAttribute('placeholder', 'Regular Expression (optional)');
    regexElt.addEventListener('change', function() {
      if (regexElt.value === '') {
        show.regex = new RegExp(show.title);
      } else {
        show.regex = new RegExp(regexElt.value);
      }
    });
    showItem.append(regexElt);

    const folderElt = document.createElement('input');
    folderElt.setAttribute('type', 'text');
    folderElt.setAttribute('value', show.folder);
    folderElt.classList.add('folder');
    folderElt.setAttribute('placeholder', 'Folder (optional)');
    folderElt.addEventListener('change', function() {
      show.folder = folderElt.value;
    });
    showItem.append(folderElt);

    showItem.append(deleteButton);

    parent.appendChild(showItem);
  }
};
