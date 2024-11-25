const endpointsJSON = require("../endpoints.json");
const { fetchTopics } = require("../models/models");

function getApi(req, res) {
  res.status(200).send({ endpoints: endpointsJSON });
}

function getTopics(req, res) {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(() => {});
}

module.exports = { getApi, getTopics };
