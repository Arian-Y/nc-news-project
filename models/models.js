const { promises } = require("supertest/lib/test");
const db = require("../db/connection");

function fetchTopics() {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
}

function fetchArticlesById(articleId) {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else {
        return rows[0];
      }
    });
}

function fetchArticles() {
  const queryText = `SELECT
  articles.article_id,
  articles.title,
  articles.author,
  articles.topic,
  articles.created_at,
  articles.votes,
  articles.article_img_url,
   CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
FROM articles
LEFT JOIN comments ON comments.article_id = articles.article_id
GROUP BY articles.article_id
ORDER BY articles.created_at DESC;`;
  return db.query(queryText).then(({ rows }) => {
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

module.exports = {
  fetchTopics,
  fetchArticlesById,
  fetchArticles,
  fetchComments,
  printComments,
  getUsers,
  updateArticles,
  removeCommentById,
};
