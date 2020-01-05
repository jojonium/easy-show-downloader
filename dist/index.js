"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const PORT = 8080;
const app = express();
// index route handler
app.get("/", (req, res) => {
    res.send("Goodbye world!");
});
// start server
app.listen(PORT, () => {
    // tslint:disable-next-line: no-console
    console.log(`now listening on port ${PORT}...`);
});
//# sourceMappingURL=index.js.map