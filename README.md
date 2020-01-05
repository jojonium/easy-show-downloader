# Easy Show Downloader

A simple web application built on Node and TypeScript for automatically
downloading new episodes of TV shows.

## Running development server

```
$ npm install
$ npm start
```

## API documentation

Bodies of POST methods should be JSONs. Response bodies are JSONs containing a
"status" field with the HTTP status code and a "message" field, as well as
optionally other fields.

### POST `/api/shows`

Updates the list of shows, replacing it with one sent in the request. Required
fields: "shows", which is an array of strings, each being a show name

Returns 200 if successfully updated, 400 if the request was invalid, or 500 if
an internal server error occurred

### GET `/api/shows`

Returns a list of shows

Returns 200 along with a "shows" field containing an array of show names if
successful, or 500 if an internal server error occurred
