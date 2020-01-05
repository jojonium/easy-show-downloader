import * as express from "express";

const PORT = 8080;

const app = express();

// index route handler
app.get("/", (req, res) => {
  res.send("Hello world!");
});

// start server
app.listen(PORT, () => {
  // tslint:disable-next-line: no-console
  console.log(`now listening on port ${PORT}...`);
});
