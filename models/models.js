const { promises } = require("supertest/lib/test");
const db = require("../db/connection");

function fetchTopics() {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
}

function fetchArticlesById(articleId) {
  return db
    .query(
      `SELECT articles.article_id,
       articles.title,
        articles.author,
         articles.topic,
          articles created_at,
          articles.body,
           articles.votes,
            articles.article_img_url,
             CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1
             GROUP BY articles.article_id;`,
      [articleId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else {
        return rows[0];
      }
    });
}

function fetchArticles(sortBy = "created_at", order = "DESC", topic) {
  let queriedInfo = [];
  const acceptableSortBy = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
  ];
  const acceptableOrder = ["ASC", "DESC"];

  if (!acceptableOrder.includes(order) || !acceptableSortBy.includes(sortBy)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let queryText = `SELECT
  articles.article_id, articles.title, articles.author, articles.topic, articles created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id `;

  if (topic) {
    queryText += `WHERE topic = $1 `;
    queriedInfo.push(topic);
  }
  if (sortBy) {
    queryText += `GROUP BY articles.article_id ORDER BY articles.${sortBy} ${order}`;
  }
  return db.query(queryText, queriedInfo).then(({ rows }) => {
    return rows;
  });
}

function fetchComments(article_id) {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1
      ORDER BY created_at DESC;`,
      [article_id]
    )
    .then((body) => {
      if (body.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      } else {
        return body.rows;
      }
    });
}

function printComments(body, userName, article_id) {
  return db
    .query(
      `INSERT INTO comments(
      body,
      author, article_id) VALUES(
        $1,$2,$3)
        RETURNING * `,
      [body, userName, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

function getUsers(userName) {
  return db
    .query(`Select * FROM users WHERE username = $1;`, [userName])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else {
        return rows;
      }
    });
}

function updateArticles(article_id, inc_votes) {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else {
        return rows[0];
      }
    });
}

function removeCommentById(comment_id) {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else {
        return rows;
      }
    });
}

function fetchUsers() {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
}

function selectValidTopic(topic) {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else {
        return rows;
      }
    });
}

module.exports = {
  fetchTopics,
  fetchArticlesById,
  fetchArticles,
  fetchComments,
  printComments,
  getUsers,
  updateArticles,
  removeCommentById,
  fetchUsers,
  selectValidTopic,
};
