# Easy Show Downloader

A simple web application built on Node and TypeScript for automatically
downloading new episodes of TV shows.

The original version was written in about 2 days. I am currently working on
rewriting to be more flexible and feature complete!

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
$ npm run start:dev
```

Navigate to `http://localhost:8080` to see it in action. You can use the web
interface to add shows and manually trigger a check for new episodes. The server
will also check for new episodes automatically each hour.

