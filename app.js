const express = require("express");
const app = express();
const {
  getApi,
  getTopics,
  getArticlesById,
  getArticles,
  getComments,
} = require("./controllers/controllers");

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getComments);

app.all("*", (re, res, next) => {
  res.status(404).send({ msg: "not found" });
  next();
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  console.log("custom err");
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((req, res) => {
  res.status(500).send({ msg: "internal server error" });
});
module.exports = app;
