process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');
const connection = require('../db/connection');

const request = supertest(app);

describe('NC news', () => {
  beforeEach(() => {
    // this function gets called before every test
    return connection.migrate
      .rollback()
      .then(() => {
        return connection.migrate.latest();
      })
      .then(() => {
        return connection.seed.run();
      });
  });

  after(() => {
    connection.destroy();
  });

  describe('/api/topics', () => {
    it('GET /topics 200 & responds with an array of topics', () => {
      return request
        .get('/api/topics')
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics[0]).contains.keys('slug', 'description');
        });
    });
    it('POST /topics 201 & responds with the topic you added', () => {
      return request
        .post('/api/topics')
        .send({ slug: 'frogs', description: 'our green friends' })
        .expect(201)
        .then(({ body: { topic } }) => {
          expect(topic[0]).contains.keys('slug', 'description');
        });
    });
    it('POST /topics 400 Bad Request - client tried to add invalid topic data', () => {
      return request
        .post('/api/topics')
        .send({ slug: 'slugs', frogs: 'are great' })
        .expect(400);
    });
  });
  describe.only('/api/topics/:topic/articles', () => {
    it('GET /api/topics/:topic/articles 200 responds with articles for that topic', () => {
      return request
        .get('/api/topics/cats/articles')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles[0]).to.have.all.keys(
            'title',
            'votes',
            'author',
            'created_at',
            'article_id',
            'comment_count',
            'topic'
          );
        });
    });
    it('GET /api/topics/:topic/articles 404 not found - client tried to get articles for nonexistent topic', () => {
      return request.get('/api/topics/dogs/articles').expect(404);
    });
    it('GET /api/topics/:topic/articles 200 responds with a total_count property giving the total number of articles', () => {
      return request
        .get('/api/topics/cats/articles')
        .expect(200)
        .then(({ body: { total_count } }) => {
          expect(total_count).to.equal('1');
        });
    });
    it('GET /api/topics/:topic/articles 200 responds with articles - each has a comment_count property', () => {
      return request
        .get('/api/topics/mitch/articles')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles[0].comment_count).to.equal('13');
        });
    });
    it('GET /api/topics/:topic/articles 200 limits to 10 results DEFAULT CASE', () => {
      return request
        .get('/api/topics/mitch/articles')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).to.be.below(11);
        });
    });
    it('GET /api/topics/:topic/articles 200 can be queried with a limit', () => {
      return request
        .get('/api/topics/mitch/articles?limit=2')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).to.equal(2);
        });
    });
    it('GET /api/topics/:topic/articles 200 sorts by date desc DEFAULT CASE', () => {
      return request
        .get('/api/topics/mitch/articles')
        .expect(200)
        .then(({ body: { articles } }) => {
          const articleDate = articles[0].created_at;
          const article2Date = articles[1].created_at;
          expect(articleDate > article2Date).to.be.true;
        });
    });
    it('GET /api/topics/:topic/articles 200 can be queried ?sort_by to sort by any column', () => {
      return request
        .get('/api/topics/mitch/articles?sort_by=title')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles[0].title[0]).to.equal('A');
        });
    });
  });
});

// it('GET / 404 client requests non-existent article ID') - so like "/articles/1000000"
// knex responds with empty array
// if (!article) return Promise.reject({status: 404, msg: "no such article"})
// this sends the error object (that we just passed in) down to the catch block

// it('GET / 40 (Bad Request) client requests invalid article ID') - so like "/articles/piglets"
// knex responds with an error

// 400 - make an errorCodes400 object to reference when you send the 400 -
// because knex sends back certain codes in its errors
