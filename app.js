const express = require("express");
const app = express();
const getApi = require("./controllers/controllers");

app.get("/api", getApi);

module.exports = app;
