"use strict";

/** @type {string[]} */
let shows;

const getShowsXHR = new XMLHttpRequest();
const postShowsXHR = new XMLHttpRequest();

window.onload = () => {
  getShowsXHR.addEventListener("load", ev => {
    if (getShowsXHR.status === 200) {
      shows = JSON.parse(getShowsXHR.responseText).shows;
      displayShows();
    } else {
      // TODO handle error
    }
  });

  postShowsXHR.addEventListener("load", ev => {
    if (postShowsXHR.status === 200) {
      // always update the local show list after sending something to the server
      sendGetShows();
      // TODO show that it was successfully added
    } else {
      // TODO handle error
    }
  });

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
 * displays the of show names in the document
 */
const displayShows = () => {
  let htmlString = "";
  let counter = 0;
  for (const show of shows) {
    htmlString += `<li class="show">
      ${show}
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
  const input = /** @type {HTMLInputElement} */ (document.getElementById(
    "new-show"
  ));
  // clean input
  if (input.value === "" || input.value.length >= 128) return false;
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
