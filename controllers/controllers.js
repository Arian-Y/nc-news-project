const endpointsJSON = require("../endpoints.json");

function getApi(req, res) {
  console.log(endpointsJSON, " <==== endpoints");
  res.status(200).send({ endpoints: endpointsJSON });
}

module.exports = getApi;
