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
