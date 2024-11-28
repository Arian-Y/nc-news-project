const endpointsJSON = require("../endpoints.json");
const {
  fetchTopics,
  fetchArticlesById,
  fetchArticles,
  fetchComments,
  printComments,
  getUsers,
  updateArticles,
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

function getComments(req, res, next) {
  const { article_id } = req.params;
  fetchComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
}

function postComments(req, res, next) {
  const { article_id } = req.params;
  const { userName, body } = req.body;
  const commentPromise = [
    getUsers(userName),
    fetchArticlesById(article_id),
    printComments(body, userName, article_id),
  ];
  Promise.all(commentPromise)
    .then((promiseResult) => {
      res.status(201).send({ comment: promiseResult[2] });
    })
    .catch(next);
}

function patchArticlesById(req, res, next) {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  const articlePromise = [
    fetchArticlesById(article_id),
    updateArticles(article_id, inc_votes),
  ];
  Promise.all(articlePromise)
    .then((promiseResult) => {
      res.status(200).send(promiseResult[1]);
    })
    .catch(next);
}
module.exports = {
  getApi,
  getTopics,
  getArticlesById,
  getArticles,
  getComments,
  postComments,
  patchArticlesById,
};
