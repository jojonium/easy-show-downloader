import { CronJob } from "cron";
import * as express from "express";
import { downloadTorrents } from "./downloadTorrents";
import { getShows } from "./endpoints/getShows";
import { postDownload } from "./endpoints/postDownload";
import { postShows } from "./endpoints/postShows";

const PORT = 8080;

const app = express();

// static directory for non-API requests
app.use(
  express.static(__dirname + "/../static",
  { index: ["index.html"], extensions: ["html"] })
);

// use built-in JSON body-parsing
app.use(express.json());

// endpoint for updating shows list
app.post("/api/shows", postShows);

// endpoint for getting the list of all shows
app.get("/api/shows", getShows);

// endpoint to download new episodes
app.post("/api/download", postDownload);

// set up job to download new torrents each hour
const job = new CronJob("0 53 * * * *", downloadTorrents, undefined, true);

// start server
app.listen(PORT, () => {
  // tslint:disable-next-line: no-console
  console.log(`now listening on port ${PORT}...`);
});
