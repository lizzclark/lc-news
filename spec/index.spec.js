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
  describe('GET /api/topics/:topic/articles', () => {
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
    it('GET /api/topics/:topic/articles 200 can be queried ?sort_by to sort by any column (DEFAULT descending)', () => {
      return request
        .get('/api/topics/mitch/articles?sort_by=title')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles[0].title[0]).to.equal('Z');
        });
    });
    it('GET /api/topics/:topic/articles 200 can be queried ?order to sort ascending', () => {
      return request
        .get('/api/topics/mitch/articles?order=asc')
        .expect(200)
        .then(({ body: { articles } }) => {
          const articleDate = articles[0].created_at;
          const article2Date = articles[1].created_at;
          expect(articleDate < article2Date).to.be.true;
        });
    });
    it('GET /api/topics/:topic/articles 200 can be queried ?p to make 10-item pages DEFAULT CASE', () => {
      return request
        .get('/api/topics/mitch/articles?p=2')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles[0].article_id).to.equal(12);
        });
    });
    it('GET / 200 can use ?limit and ?p to create various lengths of page', () => {
      return request
        .get('/api/topics/mitch/articles?limit=7&p=2')
        .expect(200)
        .then(({ body: { articles } }) => {
          console.log(articles);
          expect(articles[0].article_id).to.equal(9);
        });
    });
  });
  describe('POST /api/topics/:topic/articles', () => {
    it('POST 201 responds with posted article', () => {
      return request
        .post('/api/topics/cats/articles')
        .send({
          title: 'I like CATS',
          body: 'They are so cute and fluffy',
          username: 'butter_bridge',
        })
        .expect(201)
        .then(({ body: { article } }) => {
          expect(article[0].title).to.equal('I like CATS');
        });
    });
    it('POST 400 Bad Request - client tried to post an article in wrong format', () => {
      return request
        .post('/api/topics/cats/articles')
        .send({ cats: true, dogs: false })
        .expect(400);
    });
    it('POST 404 not found - client tried to post an article to nonexistent topic', () => {
      return request
        .post('/api/topics/doggos/articles')
        .send({
          title: 'Dogs',
          body: 'They should have their own topic',
          username: 'butter_bridge',
        })
        .expect(404);
    });
  });
  describe('/api/articles', () => {
    describe('GET /', () => {
      it('GET / 200 responds with an array of articles', () => {
        return request
          .get('/api/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0]).contains.keys(
              'article_id',
              'title',
              'body',
              'votes',
              'created_at',
              'topic'
            );
          });
      });
      it('GET / 200 responds with a total_count property = total number of articles', () => {
        return request
          .get('/api/articles')
          .expect(200)
          .then(({ body: { total_count } }) => {
            expect(total_count).to.equal('12');
          });
      });
      it("GET / 200 responds with articles with author key = author's username", () => {
        return request
          .get('/api/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0]).contains.keys('author');
          });
      });
      it('GET / 200 responds with articles with comment_count property', () => {
        return request
          .get('/api/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0]).contains.keys('comment_count');
            expect(articles[2].comment_count).to.equal('13');
          });
      });
      it('GET / 200 limits to 10 responses DEFAULT CASE', () => {
        return request
          .get('/api/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).to.equal(10);
          });
      });
      it('GET / 200 can be queried ?limit to limit responses', () => {
        return request
          .get('/api/articles?limit=4')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).to.equal(4);
          });
      });
      it('GET / 200 sorts responses by created_at desc DEFAULT CASE', () => {
        return request
          .get('/api/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            const article1Date = articles[0].created_at;
            const article2Date = articles[1].created_at;
            expect(article1Date > article2Date).to.be.true;
          });
      });
      it('GET / 200 can be queried ?sort_by to sort by any column (DEFAULT desc)', () => {
        return request
          .get('/api/articles?sort_by=title')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].title[0]).to.equal('Z');
          });
      });
      it('GET / 200 can be queried ?order to sort ascending', () => {
        return request
          .get('/api/articles?order=asc')
          .expect(200)
          .then(({ body: { articles } }) => {
            const article1Date = articles[0].created_at;
            const article2Date = articles[1].created_at;
            expect(article1Date < article2Date).to.be.true;
          });
      });
      it('GET / 200 can be queried ?p to create 10-item pages DEFAULT CASE', () => {
        return request
          .get('/api/articles?p=2')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].article_id).to.equal(11);
          });
      });
      it('GET / 200 can use ?limit and ?p to create various lengths of page', () => {
        return request
          .get('/api/articles?limit=5&p=2')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].article_id).to.equal(6);
          });
      });
    });
    describe.only('GET /articles/:article_id', () => {
      it('GET 200 responds with a single article object', () => {
        return request
          .get('/api/articles/3')
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article.article_id).to.equal(3);
          });
      });
      it('GET 200 responds with article that has an author key', () => {
        return request
          .get('/api/articles/3')
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article.author).to.equal('icellusedkars');
          });
      });
      it('GET 200 responds with article that has a comment_count', () => {
        return request
          .get('/api/articles/1')
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article.comment_count).to.equal('13');
          });
      });
      it('GET 404 not found - client requested nonexistent article_id', () => {
        return request.get('/api/articles/99').expect(404);
      });
      it('PATCH 200 updates votes for article and responds with updated article', () => {
        return request
          .patch('/api/articles/11')
          .send({ inc_votes: 2 })
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article.votes).to.equal(2);
          });
      });
      it('PATCH 200 update votes works for downvotes too', () => {
        return request
          .patch('/api/articles/11')
          .send({ inc_votes: -2 })
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article.votes).to.equal(-2);
          });
      });
      it('PATCH 404 not found - client tried to vote on nonexistent article', () => {
        return request
          .patch('/api/articles/999')
          .send({ inc_votes: 12 })
          .expect(404);
      });
      it('DELETE 204 no content deletes the article specified', () => {
        return request.delete('/api/articles/4').expect(204);
      });
      // it('DELETE 404 not found - client tried to vote on nonexistent article', () => {
      //   return request
      //     .delete('/api/articles/999')
      //     .expect(404);
      // });
    });
  });
});

// MEMO TO ME - what if user puts in a nonexistent query? how to handle things like ?limit=blah or ?limit=90000 or ?blah=blah or ?blah=200....

// it('GET / 404 client requests non-existent article ID') - so like "/articles/1000000"
// knex responds with empty array
// if (!article) return Promise.reject({status: 404, msg: "no such article"})
// this sends the error object (that we just passed in) down to the catch block

// it('GET / 40 (Bad Request) client requests invalid article ID') - so like "/articles/piglets"
// knex responds with an error

// 400 - make an errorCodes400 object to reference when you send the 400 -
// because knex sends back certain codes in its errors