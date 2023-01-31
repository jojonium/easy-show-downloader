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

    const folderElt = document.createElement('input');
    folderElt.setAttribute('type', 'text');
    folderElt.setAttribute('value', show.folder);
    folderElt.classList.add('folder');
    folderElt.setAttribute('placeholder', 'Folder');
    folderElt.addEventListener('change', function() {
      show.folder = folderElt.value;
      const slash = folderElt.value.indexOf('/');
      if (slash === -1) show.title = folderElt.value;
      else show.title = folderElt.value.substring(0, slash);
    });
    showItem.append(folderElt);

    const regexElt = document.createElement('input');
    regexElt.setAttribute('type', 'text');
    regexElt.setAttribute('value', show.regex.source);
    regexElt.classList.add('regex');
    regexElt.setAttribute('placeholder', 'Regular Expression');
    regexElt.addEventListener('change', function() {
      show.regex = new RegExp(regexElt.value);
    });
    showItem.append(regexElt);


    showItem.append(deleteButton);

    parent.appendChild(showItem);
  }
};
