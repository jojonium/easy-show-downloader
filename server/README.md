# server

This module runs the API server and also serves the static front-end. The
following environment variables can be used to configure the server:

Name | Type | Default | Notes
-----|------|---------|-------
`HOST` | string | `'localhost'` | Server host to listen on
`PORT` | number | `3000` | Server port to listen on
`STATIC_DIR` | string | `'../client/public'` | Directory to serve static website content from
`LOG_STDOUT` | boolean | `true` | Whether to log to stdout
`LOG_FILE` | string | `undefined` | File to write logs to. Logging to a file is disabled if omitted
`DATA_FILE` | string | `'data.json'` | Path to the JSON file to store show data in
`CRON_SCHEDULE` | string | `'0 53 * * * *'` | Schedule to check for new torrents. See [node-cron](https://www.npmjs.com/package/cron) for schedule options
`TRANSMISSION_HOST` | string | `'localhost'` | Hostname of your Transmission instance
`TRANSMISSION_PORT` | number | `9091` | Port of your Transmission instance
`TRANSMISSION_USERNAME` | string | `''` | Username for authenticating with your Transmission instance
`TRANSMISSION_PASSWORD` | string | `''` | Password for authenticating with your Transmission instance
`TRANSMISSION_PROTOCOL` | string | `'http'` | Set to 'https' to use TLS when connecting to your Transmission instance
`TRANSMISSION_URL` | string | `'/transmission/rpc'` | URL path of your Transmission instance

## API reference

### GET `/api/health`

Returns `200` with the string `Healthy!` if the server is healthy and the data
file is readable and correctly formatted, `500` otherwise.

### GET `/api/data`

Returns `200` with the full JSON of the data file, or `500` on a server error.
For the format of the data file see `../common/src/data.ts`.

### POST `/api/data`

Allows uploading a new data file. The new data file must be in JSON format in
the body of the request, for the format of the data file see
`../common/src/data.ts`. Returns `200` on success, `400` with an error message
describing what's wrong on an invalid request, or `500` on a server error.

### POST `/api/download`

This request has no body, but instructs the server to download matching torrents
now (instead of waiting for the next time the cron job would fire). On success
returns `200` with a JSON body like `{"torrentsAdded": 3}`. Returns `500` on a
server error, along with a message explaining what failed.
