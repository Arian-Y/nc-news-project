# Northcoders News API

This project is a backend API for a mini news article platform, built using **JavaScript**, **ExpressJS**, and **PostgreSQL**. The API allows users to:

- View articles.

- Add comments on articles.

- Vote on articles.

- Delete comments.

-Sort articles by various criteria such as topic, date, or comment count.

A complete list of available endpoints is documented in the **endpoints.json** file.

## Hosted API Link

https://nc-news-project-5i4v.onrender.com

## Setting Up

### <ins>Clone The Repository</ins>

To get started, clone the repository by running the following command in your terminal:

**git clone** https://github.com/imys1/imys-be-nc-news.git

### <ins>Install dependencies</ins>

Install the required dependencies with:

**npm install**

The dependencies include:

- dotenv

- express

- supertest

- pg/format

- jest/sorted/extended

- husky

### <ins> Environment Setup </ins>

1. Testing Environment:

   - Create a file named **.env.test**.
   - Inside the file, set up the testing database with:

     **PGDATABASE=nc_news_test**

2. Development Environment:

   - Create a file named **.env.development**.
   - Inside the file, set up the development database with:

     **PGDATABASE=nc_news**

### <ins>Database Seeding</ins>

Prepare the databases by running:

- **npm run setup-dbs**
- **npm run seed**

### <ins>Running Tests</ins>

Use **npm run test** to run the test suite

### <ins>Requirements</ins>

To run this project, ensure you have the following installed:

- Node.js: Version 19.0.0 or later.
- PostgreSQL: Version 12.12 or later.

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
