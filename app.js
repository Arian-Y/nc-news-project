const express = require("express");
const app = express();
const cors = require("cors");
const {
  getApi,
  getTopics,
  getArticlesById,
  getArticles,
  getComments,
  postComments,
  patchArticlesById,
  deleteCommentById,
  getAllUsers,
} = require("./controllers/controllers");

app.use(express.json());

app.use(cors());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getComments);

app.post("/api/articles/:article_id/comments", postComments);

app.patch("/api/articles/:article_id", patchArticlesById);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/users", getAllUsers);

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "not found" });
  next();
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502" || err.code === "23503") {
    res.status(400).send({ msg: "Bad request" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((req, res) => {
  res.status(500).send({ msg: "internal server error" });
});
module.exports = app;
