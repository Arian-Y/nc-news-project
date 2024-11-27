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
      return rows[0];
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
        console.log(body.rows, "<-- rows in reject model");
        return Promise.reject({ status: 404, msg: "Not found" });
      } else {
        return body.rows;
      }
    });
}

module.exports = {
  fetchTopics,
  fetchArticlesById,
  fetchArticles,
  fetchComments,
};
