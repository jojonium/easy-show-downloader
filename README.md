# Easy Show Downloader

A simple web application built on Node and TypeScript for automatically
downloading new episodes of TV shows.

# Running

This project uses yarn zero-installs, so after you clone the repo you can get
started with 

```
$ yarn run build
$ yarn run start
```

And you'll have the server up and running.

# Configuration

This project is configured through environment variables. The only file that
needs to persist on the disk is `data.json`, which contains information about
the shows you want to download and the RSS feeds to get them from. Here is a
list of the availableenvironment variables:

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
