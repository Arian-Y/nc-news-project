const endpointsJSON = require("../endpoints.json");
const {
  fetchTopics,
  fetchArticlesById,
  fetchArticles,
} = require("../models/models");

function getApi(req, res) {
  res.status(200).send({ endpoints: endpointsJSON });
}

function getTopics(req, res, next) {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
}

function getArticlesById(req, res, next) {
  const { article_id } = req.params;
  fetchArticlesById(article_id)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
}

function getArticles(req, res, next) {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
}
module.exports = { getApi, getTopics, getArticlesById, getArticles };
