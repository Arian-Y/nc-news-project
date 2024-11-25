const express = require("express");
const app = express();
const { getApi, getTopics, getArticles } = require("./controllers/controllers");

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticles);

app.all("*", (re, res, next) => {
  res.status(404).send({ msg: "not found" });
  next();
});

app.use((req, res) => {
  res.status(500).send({ msg: "internal server error" });
});
module.exports = app;
