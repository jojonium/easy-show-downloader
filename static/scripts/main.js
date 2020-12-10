"use strict";

/** @type {string[]} */
let shows;

const getShowsXHR = new XMLHttpRequest();
const postShowsXHR = new XMLHttpRequest();
const postDownloadXHR = new XMLHttpRequest();

window.onload = () => {
  getShowsXHR.addEventListener("load", ev => {
    if (getShowsXHR.status === 200) {
      log("Successfully retrieved server's show list");
      shows = JSON.parse(getShowsXHR.responseText).shows;
      displayShows();
    } else {
      log("Error: " + JSON.parse(getShowsXHR.responseText).message, 2);
    }
  });

  postShowsXHR.addEventListener("load", ev => {
    if (postShowsXHR.status === 200) {
      log("Successfully updated server's show list");
      // always update the local show list after sending something to the server
      sendGetShows();
    } else {
      log("Error: " + JSON.parse(postShowsXHR.responseText).message, 2);
    }
  });

  postDownloadXHR.addEventListener("load", ev => {
    // re-enable download button
    /** @type {HTMLInputElement} */
    (document.getElementById("post-download")).disabled = false;
    if (postDownloadXHR.status === 200) {
      log(JSON.parse(postDownloadXHR.responseText).message);
    } else {
      log("Error: " + JSON.parse(postDownloadXHR.responseText).message, 2);
    }
  })

  sendGetShows();
};

const sendGetShows = () => {
  getShowsXHR.open("GET", "/api/shows");
  getShowsXHR.send();
};

/**
 * 
 * @param {string[]} showArray 
 */
const sendPostShows = showArray => {
  postShowsXHR.open("POST", "/api/shows");
  postShowsXHR.setRequestHeader("Content-Type", "application/json");
  postShowsXHR.send(JSON.stringify({ shows: showArray }));
};

/**
 * Escapes a string so it can appear in html
 */
const htmlClean = (str) => 
    String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');


/**
 * displays the of show names in the document
 */
const displayShows = () => {
  let htmlString = "";
  let counter = 0;
  for (const show of shows) {
    htmlString += `<li class="show">
      ${htmlClean(show)}
      <span
        class="delete-show" 
        title="Remove"
        onclick="removeShow(${counter})"
      >&#x2715;</span>
    </li>`;
    counter++;
  }
  document.getElementById("shows-list").innerHTML = htmlString;
};

/**
 * Tells the server to download all new episodes
 */
const postDownload = () => {
  // disable until we get a response so the user doesn't click a bunch of times
  // in a row
  /** @type {HTMLInputElement} */
  (document.getElementById("post-download")).disabled = true;
   
  log("Requesting server to download new episodes...");
  postDownloadXHR.open("POST", "/api/download");
  postDownloadXHR.send();
}

/**
 * Removes a show from the list, updating the server
 * @param {number} id 0-based index of show to remove
 */
const removeShow = id => {
  shows.splice(id, 1);
  sendPostShows(shows);
};

/**
 * adds a show to the server's list if it doesn't already exist
 * @param {HTMLFormElement} formElement the HTML form to submit
 * @return {false}
 */
const addShow = formElement => {
  const input =
    /** @type {HTMLInputElement} */ (document.getElementById("new-show"));
  // clean input
  if (input.value === "") return false;
  input.value = input.value.trim();
  for (const show of shows) {
    if (show === input.value) {
      // value already exists
      return false;
    }
  }
  shows.push(input.value);
  sendPostShows(shows);
  input.value = "";
  return false;
};

/**
 * Displays a string on the document for the user to see
 * @param {string} str string to write to the log
 * @param {number} [badness] 0 for normal, 1 for warning, 2 for error
 */
const log = (str, badness = 0) => {
  const line = document.createElement("li");
  const log = document.getElementById("log");
  line.innerText = str;
  if (badness === 1) {
    line.style.color = "#bfbf94";
  } else if (badness === 2) {
    line.style.color = "#c0392b";
  }
  log.appendChild(line);
  log.scrollTop = log.scrollHeight;
}
