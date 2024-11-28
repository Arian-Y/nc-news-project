const endpointsJSON = require("../endpoints.json");
const app = require("../app.js");
const data = require("../db/data/test-data/index.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const topics = require("../db/data/test-data/topics.js");
require("jest-sorted");

/* Set up your test imports here */

/* Set up your beforeEach & afterAll functions here */
beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJSON);
      });
  });

  test("404: not found", () => {
    return request(app)
      .get("/notURL")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
});

describe("GET /api/topics", () => {
  test("200 : responds with all the topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toHaveLength(data.topicData.length);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: responds with the correct article when passed an article id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.article_id).toBe(1);
        expect(articles).toMatchObject({
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("200: with an array of aricleswith the correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("200: Responds with an array of article objects sorted by created_at in descending order ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSorted("created_at", {
          decending: true,
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an object that returns the comments of a specific article", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(2);
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 5,
          });
        });
      });
  });

  test("200: with an object sorted by article_id in descending orders", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSorted("created_at", {
          decending: true,
        });
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent article_id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("GET:400 sends an appropriate status and error message when given an invalid article_id", () => {
    return request(app)
      .get("/api/articles/not-an-article/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("200: recieves an object with a username and body", () => {
    const messageToSend = {
      userName: "icellusedkars",
      body: "jonny's body",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(messageToSend)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: 0,
          created_at: expect.any(String),
          author: messageToSend.userName,
          body: messageToSend.body,
          article_id: 1,
        });
      });
  });

  test("404: return not found when send a user that does not exist", () => {
    const messageToSend = {
      userName: "wizard",
      body: "im a wizard",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(messageToSend)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });

  test("400: returns not found when you pass no userName", () => {
    const messageToSend = {
      userName: "icellusedkars",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(messageToSend)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("404: returns not found when passed a non existant user_id", () => {
    const messageToSend = {
      userName: "icellusedkars",
      body: "jonny's body",
    };
    return request(app)
      .post("/api/articles/100/comments")
      .send(messageToSend)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: returns an updated comments object with the corect number of votes", () => {
    const infoForUpdate = {
      inc_votes: 5,
    };
    return request(app)
      .patch("/api/articles/2")
      .send(infoForUpdate)
      .expect(200)
      .then(({ body }) => {
        console.log(body);
        expect(body).toMatchObject({
          article_id: 2,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 5,
          article_img_url: expect.any(String),
        });
      });
  });

  test("404: return not found when passed a non existant article id", () => {
    const infoForUpdate = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/400")
      .send(infoForUpdate)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });

  test("400: returns not found when you pass no vote", () => {
    const infoForUpdate = {};
    return request(app)
      .patch("/api/articles/1")
      .send(infoForUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("400: returns not found when you passed NAN ", () => {
    const infoForUpdate = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/HAHA")
      .send(infoForUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: returns an empty body when passed the comment_id", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });

  test("400: returns not found when you passed NAN ", () => {
    return request(app)
      .delete("/api/comments/HAHAH")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("404: return not found when passed a non existant article id", () => {
    return request(app)
      .delete("/api/comments/600")

      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
});

describe.only("GET /api/users", () => {
  test("200: responds with all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        body.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
