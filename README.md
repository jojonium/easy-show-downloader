# Easy Show Downloader

A simple web application built on Node and TypeScript for automatically
downloading new episodes of TV shows.

I made this for myself because existing solutions tended to be outdated, overly
complicated, or full of too many features that I would never use. Easy Show
Downloader is designed first and foremost to be simple and easy: it only
supports Transmission as a torrent client, its web interface is fast and
minimal, and it only supports scraping torrent magnet links from RSS feeds.

## Running

After you clone the repo you can get started with:

```
$ yarn run install
$ yarn run build
$ yarn run start
```

And you'll have the server up and running.

Alternatively you can try it in a container:

```
$ docker pull ghcr.io/jojonium/easy-show-downloader:latest
```

## Development

This will start a live-reloading dev version of the client on port 5173, and the
back-end on port 3000.

```
$ yarn run client:dev
```

## Configuration

This project is configured through environment variables. The only file that
needs to persist on the disk is `data.json`, which contains information about
the shows you want to download and the RSS feeds to get them from. Here is a
list of the availableenvironment variables:

Name | Type | Default | Notes
-----|------|---------|-------
`NODE_HOST` | string | `'localhost'` | Server host to listen on
`NODE_PORT` | number | `3000` | Server port to listen on
`STATIC_DIR` | string | `'../client/build'` | Directory to serve static website content from
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
