const endpointsJSON = require("../endpoints.json");
const { fetchTopics, fetchArticles } = require("../models/models");

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

function getArticles(req, res) {
  const { article_id } = req.params;
  fetchArticles(article_id).then((articles) => {
    console.log(articles);
    res.status(200).send({ articles });
  });
}

module.exports = { getApi, getTopics, getArticles };
