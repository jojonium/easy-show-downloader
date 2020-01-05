import * as express from "express";
import { getShows } from "./endpoints/getShows";
import { postShows } from "./endpoints/postShows";

const PORT = 8080;

const app = express();

// static directory for non-API requests
app.use(express.static(__dirname + "/../static"));

// use built-in JSON body-parsing
app.use(express.json());

// endpoint for updating shows list
app.post("/api/shows", postShows);

// endpoint for getting the list of all shows
app.get("/api/shows", getShows);

// start server
app.listen(PORT, () => {
  // tslint:disable-next-line: no-console
  console.log(`now listening on port ${PORT}...`);
});
