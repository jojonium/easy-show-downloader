# Easy Show Downloader

A simple web application built on Node and TypeScript for automatically
downloading new episodes of TV shows.

This project is not very robust, flexible, or feature complete, because I made
it primarily for myself and my own personal use case. That said, pull requests
are welcome if you want to add features.

It's also not particularly well-written, efficient, or pretty, because I wrote
it in approximately two days.

## Running development server

Edit `config.json`:

```
{
  /* List of RSS URLs to search for torrents, e.g. HorribleSubs RSS feed */
  "rssURLs": [], 

  /* Root directory, containing a sub-folder for each show */
  "showDirectory": "/mnt/media/Television",

  "transmissionOptions": {
    "host": "localhost",
    "port": 9091,
    "username": "username",
    "password": "password",
    "ssl": false,
    "url": "/transmission/rpc"
  }
 }
```

Then just run the Node project:

```
$ npm install
$ npm start:dev
```

Navigate to `http://localhost:8080` to see it in action. You can use the web
interface to add shows and manually trigger a check for new episodes. The server
will also check for new episodes automatically each hour.

## API documentation

Bodies of POST methods should be JSONs. Response bodies are JSONs containing a
"status" field with the HTTP status code and a "message" field, as well as
optionally other fields.

### POST `/api/shows`

Updates the list of shows, replacing it with one sent in the request. Required
fields: "shows", which is an array of strings, each being a show name.

Returns 200 if successfully updated, 400 if the request was invalid, or 500 if
an internal server error occurred.

### GET `/api/shows`

Returns a list of shows.

Returns 200 along with a "shows" field containing an array of show names if
successful, or 500 if an internal server error occurred.

### POST `/api/download`

Downloads all new episodes from the RSS feeds.

Returns 200 if successful, or 500 if an internal server error occurred.
