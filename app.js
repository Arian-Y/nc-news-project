const express = require("express");
const app = express();
const { getApi, getTopics } = require("./controllers/controllers");

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.all("*", (re, res) => {
  res.status(404).send({ msg: "not found" });
});

module.exports = app;
