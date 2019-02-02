process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');
const connection = require('../db/connection');

const request = supertest(app);

describe('NC news', () => {
  beforeEach(() => {
    return connection.migrate
      .rollback()
      .then(() => connection.migrate.latest())
      .then(() => connection.seed.run());
  });

  after(() => connection.destroy());

  describe.only('/', () => {
    it('gives a 404 error on GET /', () => {
      return request.get('/').expect(404);
    });
    it('gives a 404 error for invalid paths', () => {
      return request.get('/bad').expect(404);
    });
  });

  describe('/api', () => {
    it('GET / responds with a JSON object of all the endpoints', () => {
      return request
        .get('/api')
        .expect(200)
        .then(({ body }) => {
          expect(body.endpoints).contains.keys(
            'GET /api/topics',
            'POST /api/articles/:article_id/comments',
            'GET /api/users/:username/articles'
          );
        });
    });
    it('PATCH / 405 invalid method', () => {
      return request.patch('/api').expect(405);
    });
  });

  describe('/api/topics', () => {
    describe('/', () => {
      it('GET /topics 200 & responds with an array of topics', () => {
        return request
          .get('/api/topics')
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics[0]).contains.keys('slug', 'description');
          });
      });
      it('POST 201 & responds with the topic you added', () => {
        return request
          .post('/api/topics')
          .send({ slug: 'frogs', description: 'our green friends' })
          .expect(201)
          .then(({ body: { topic } }) => {
            expect(topic).contains.keys('slug', 'description');
          });
      });
      it('POST 400 Bad Request - invalid topic data', () => {
        return request
          .post('/api/topics')
          .send({ slug: 'slugs', frogs: 'are great' })
          .expect(400);
      });
      it('POST 400 Bad Request - duplicate topic', () => {
        return request
          .post('/api/topics')
          .send({ slug: 'mitch', description: 'man with cable knit jumper' })
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
      it('GET /api/topics/:topic/articles 404 not found - nonexistent topic', () => {
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
            const articleYear = +articles[0].created_at.slice(0, 4);
            const article2Year = +articles[1].created_at.slice(0, 4);
            expect(articleYear).to.be.above(article2Year);
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
            const articleDate = +articles[0].created_at.slice(0, 4);
            const article2Date = +articles[1].created_at.slice(0, 4);
            expect(articleDate).to.be.below(article2Date);
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
            expect(articles[0].article_id).to.equal(9);
          });
      });
    });
    describe('GET /api/topics/:topic/articles WEIRD QUERIES', () => {
      it('?limit greater than number of articles - just brings back all articles', () => {
        return request
          .get('/api/topics/mitch/articles?limit=500')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).to.equal(11);
          });
      });
      it('?limit wrong data type - ignore the query, default to limit 10', () => {
        return request
          .get('/api/topics/mitch/articles?limit=blah')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).to.equal(10);
          });
      });
      it('?sort_by - if it isnt a valid column name, default to created_at as normal', () => {
        return request
          .get('/api/topics/mitch/articles?sort_by=potatocakes')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].created_at.slice(0, 4)).to.equal('2018');
            expect(articles[9].created_at.slice(0, 4)).to.equal('1978');
          });
      });
      it('?order - can only be asc or desc, defaults to desc if given anything else', () => {
        return request
          .get('/api/topics/mitch/articles?order=cat')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].created_at.slice(0, 4)).to.equal('2018');
            expect(articles[9].created_at.slice(0, 4)).to.equal('1978');
          });
      });
      it('404 not found ?p - if asked for a nonexistent page', () => {
        return request.get('/api/topics/mitch/articles?p=101').expect(404);
      });
      it("?cats=fluffy - ignores queries that don't exist", () => {
        return request
          .get('/api/topics/mitch/articles?cats=fluffy')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].article_id).to.equal(1);
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
            expect(article.title).to.equal('I like CATS');
            expect(article.article_id).to.equal(13);
          });
      });
      it('POST 400 Bad Request - article in wrong format', () => {
        return request
          .post('/api/topics/cats/articles')
          .send({ cats: true, dogs: false })
          .expect(400);
      });
      it('POST 404 not found -post article to nonexistent topic', () => {
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
  });

  describe('/api/articles', () => {
    describe('GET /', () => {
      it('GET / 200 responds with an array of articles', () => {
        return request
          .get('/api/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0]).to.have.all.keys(
              'article_id',
              'title',
              'body',
              'votes',
              'created_at',
              'topic',
              'author',
              'comment_count'
            );
            expect(articles[0].comment_count).to.equal('13');
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
            const article1Year = +articles[0].created_at.slice(0, 4);
            const article2Year = +articles[1].created_at.slice(0, 4);
            expect(article1Year).to.be.above(article2Year);
          });
      });
      it('GET / 200 can be queried ?sort_by to sort by any column (DEFAULT desc)', () => {
        return request
          .get('/api/articles?sort_by=votes')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].votes).to.equal(100);
          });
      });
      it('GET / 200 can be queried ?order to sort ascending', () => {
        return request
          .get('/api/articles?order=asc')
          .expect(200)
          .then(({ body: { articles } }) => {
            const article1Year = +articles[0].created_at.slice(0, 4);
            const article2Year = +articles[1].created_at.slice(0, 4);
            expect(article1Year).to.be.below(article2Year);
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
    describe('GET /api/articles WEIRD QUERIES', () => {
      it('?limit greater than number of articles - just brings back all articles', () => {
        return request
          .get('/api/articles?limit=500')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).to.equal(12);
          });
      });
      it('?limit wrong data type - ignore the query, default to limit 10', () => {
        return request
          .get('/api/articles?limit=blah')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).to.equal(10);
          });
      });
      it('?sort_by - if it isnt a valid column name, default to created_at as normal', () => {
        return request
          .get('/api/articles?sort_by=pasteisdenata')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].created_at.slice(0, 4)).to.equal('2018');
            expect(articles[9].created_at.slice(0, 4)).to.equal('1982');
          });
      });
      it('?order can be only asc or desc - default to desc if given anything else', () => {
        return request
          .get('/api/articles?order=pig')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].created_at.slice(0, 4)).to.equal('2018');
            expect(articles[9].created_at.slice(0, 4)).to.equal('1982');
          });
      });
      it('404 not found if ?p asks for a nonexistent page', () => {
        return request.get('/api/articles?limit=1&p=22').expect(404);
      });
      it('?dogs=friendly - nonexistent queries ignored', () => {
        return request
          .get('/api/articles?dogs=friendly')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].article_id).to.equal(1);
          });
      });
    });
    describe('GET /articles/:article_id', () => {
      it('GET 200 responds with a single article object', () => {
        return request
          .get('/api/articles/5')
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article.article_id).to.equal(5);
            expect(article.author).to.equal('rogersop');
            expect(article.comment_count).to.equal('2');
          });
      });
      it('GET 404 not found - nonexistent article_id', () => {
        return request.get('/api/articles/99').expect(404);
      });
      it('GET 400 Bad Request - invalid article_id', () => {
        return request.get('/api/articles/my-article').expect(400);
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
      it('PATCH 404 not found - vote on nonexistent article', () => {
        return request
          .patch('/api/articles/999')
          .send({ inc_votes: 12 })
          .expect(404);
      });
      it('PATCH 200 no body - responds with unmodified article', () => {
        return request
          .patch('/api/articles/11')
          .send()
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article.votes).to.equal(0);
          });
      });
      it('PATCH 400 Bad Request - invalid body, wrong data type', () => {
        return request
          .patch('/api/articles/11')
          .send({ inc_votes: 'bananas' })
          .expect(400);
      });
      it('DELETE 204 no content deletes the article specified', () => {
        return request.delete('/api/articles/4').expect(204);
      });
      it('DELETE 404 not found - nonexistent article', () => {
        return request.delete('/api/articles/999').expect(404);
      });
    });
  });

  describe('/api/articles/:article_id/comments', () => {
    describe('GET /', () => {
      it('GET 200 responds with an array of comments for the given article_id', () => {
        return request
          .get('/api/articles/9/comments')
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.be.an('array');
            expect(comments[0]).to.have.all.keys(
              'comment_id',
              'votes',
              'created_at',
              'body',
              'author'
            );
            expect(comments[0].author).to.equal('butter_bridge');
          });
      });
      it('GET 404 not found - nonexistent article_id or article with no comments', () => {
        return request.get('/api/articles/111/comments').expect(404);
      });
      it('GET 200 response is limited to 10 comments DEFAULT CASE', () => {
        return request
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments.length).to.equal(10);
          });
      });
      it('GET 200 can be queried ?limit to set a variable limit', () => {
        return request
          .get('/api/articles/1/comments?limit=6')
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments.length).to.equal(6);
          });
      });
      it('GET 200 response sorted by date desc DEFAULT CASE', () => {
        return request
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({ body: { comments } }) => {
            const comment1Date = comments[0].created_at;
            const comment5Date = comments[4].created_at;
            expect(comment1Date > comment5Date);
          });
      });
      it('GET 200 can be queried ?sort_by to set a sort criterion', () => {
        return request
          .get('/api/articles/1/comments?sort_by=comment_id')
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments[0].body).to.equal(
              'This morning, I showered for nine minutes.'
            );
          });
      });
      it('GET 200 can be queried ?sort_ascending with a boolean to change sort order', () => {
        return request
          .get('/api/articles/1/comments?sort_ascending=true')
          .expect(200)
          .then(({ body: { comments } }) => {
            const comment1Year = +comments[0].created_at.slice(0, 4);
            const comment10Year = +comments[9].created_at.slice(0, 4);
            expect(comment1Year).to.be.below(comment10Year);
          });
      });
      it('GET 200 can be queried ?p to use 10-item pagination DEFAULT CASE', () => {
        return request
          .get('/api/articles/1/comments?p=2')
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments[0].comment_id).to.equal(12);
          });
      });
      it('GET 200 can use ?limit and ?p to set any page length', () => {
        return request
          .get('/api/articles/1/comments?limit=3&p=2')
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments[0].comment_id).to.equal(5);
          });
      });
    });
    describe('GET / WEIRD QUERIES', () => {
      it('?limit greater than number of comments - just brings back all comments', () => {
        return request
          .get('/api/articles/1/comments?limit=25')
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments.length).to.equal(13);
          });
      });
      it('?limit wrong data type - ignore the query, default to limit 10', () => {
        return request
          .get('/api/articles/1/comments?limit=blah')
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments.length).to.equal(10);
          });
      });
      it('?sort_by - if it isnt a valid column, default to created_at as normal', () => {
        return request
          .get('/api/articles/1/comments?sort_by=author_age')
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments[0].created_at.slice(0, 4)).to.equal('2016');
            expect(comments[9].created_at.slice(0, 4)).to.equal('2007');
          });
      });
      it('?sort_ascending - can only be true or false, defaults to false', () => {
        return request
          .get('/api/articles/1/comments?sort_ascending=bunnies')
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments[0].created_at.slice(0, 4)).to.equal('2016');
            expect(comments[9].created_at.slice(0, 4)).to.equal('2007');
          });
      });
      it('404 not found if ?p asks for a nonexistent page', () => {
        return request.get('/api/articles/1/comments?p=22').expect(404);
      });
    });

    describe('POST /', () => {
      it('POST 201 responds with the posted comment', () => {
        return request
          .post('/api/articles/3/comments')
          .send({ username: 'butter_bridge', body: 'pugs are good' })
          .expect(201)
          .then(({ body: { comment } }) => {
            expect(comment.body).to.equal('pugs are good');
            expect(comment.comment_id).to.equal(19);
          });
      });
      it('POST 400 - invalid comment data', () => {
        return request
          .post('/api/articles/3/comments')
          .send({ pugs: 'butter_bridge', pigs: 'pugs are good' })
          .expect(400);
      });
      it('POST 404 - nonexistent article', () => {
        return request
          .post('/api/articles/333/comments')
          .send({ username: 'butter_bridge', body: 'pugs are good' })
          .expect(404);
      });
      // it('POST 400 bad request - /articles/bad/comments/17 (invalid article_id)', () => {
      //   return request
      //     .post('/api/articles/bad/comments/17')
      //     .send({
      //       body:
      //         "my mind's telling me no, but my body - my body is telling me yes",
      //       username: 'butter_bridge',
      //     })
      //     .expect(400);
      // });
      // it('POST 400 bad request - /articles/1/comments/bad (invalid comment_id)', () => {
      //   return request
      //     .post('/api/articles/1/comments/bad')
      //     .send({
      //       body: 'i like to break the rules',
      //       username: 'butter_bridge',
      //     })
      //     .expect(400);
      // });
    });
    describe('PATCH /:comment_id', () => {
      it('PATCH 200 updates votes and responds with the updated comment', () => {
        return request
          .patch('/api/articles/1/comments/7')
          .send({ inc_votes: 14 })
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment.votes).to.equal(14);
          });
      });
      it('PATCH 200 no body - responds with unmodified comment', () => {
        return request
          .patch('/api/articles/9/comments/17')
          .send()
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment.votes).to.equal(20);
          });
      });
      it('PATCH 400 bad request - invalid request body, wrong data type', () => {
        return request
          .patch('/api/articles/9/comments/17')
          .send({ inc_votes: 'lots and lots' })
          .expect(400);
      });
      it('PATCH 400 bad request - /articles/bad/comments/17 (invalid article_id)', () => {
        return request
          .patch('/api/articles/bad/comments/17')
          .send({ inc_votes: 5 })
          .expect(400);
      });
      it('PATCH 400 bad request - /articles/1/comments/bad (invalid comment_id)', () => {
        return request
          .patch('/api/articles/1/comments/bad')
          .send({ inc_votes: 5 })
          .expect(400);
      });
      it('PATCH 404 not found - nonexistent comment', () => {
        return request
          .patch('/api/articles/1/comments/100')
          .send({ inc_votes: 1 })
          .expect(404);
      });
      it('PATCH 404 not found - existent comment, nonexistent article', () => {
        return request
          .patch('/api/articles/99/comments/7')
          .send({ inc_votes: 1 })
          .expect(404);
      });
    });
    describe('DELETE /:comment_id', () => {
      it('DELETE 204 no content deletes the comment', () => {
        return request.delete('/api/articles/1/comments/8').expect(204);
      });
      it('DELETE 404 not found - nonexistent comment', () => {
        return request.delete('/api/articles/1/comments/444').expect(404);
      });
      it('DELETE 404 not found - existent comment, nonexistent article', () => {
        return request.delete('/api/articles/999/comments/7').expect(404);
      });
    });
  });

  describe('/api/users', () => {
    describe('/', () => {
      it('GET / 200 returns an array of users', () => {
        return request
          .get('/api/users')
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users).to.be.an('array');
            expect(users[0]).to.have.all.keys('username', 'avatar_url', 'name');
          });
      });
      it('POST 201 returns new user object', () => {
        return request
          .post('/api/users')
          .send({
            name: 'bilbo',
            username: 'fuzzysocks101',
            avatar_url: 'www.avatars.com/55',
          })
          .expect(201)
          .then(({ body: { user } }) => {
            expect(user.name).to.equal('bilbo');
            expect(user.username).to.equal('fuzzysocks101');
            expect(user.avatar_url).to.equal('www.avatars.com/55');
          });
      });
      it('POST 400 Bad Request - invalid user data', () => {
        return request
          .post('/api/users')
          .send({ size: 'big', nose: 'red' })
          .expect(400);
      });
      it('POST 400 Bad Request - duplicate user data', () => {
        return request
          .post('/api/users')
          .send({
            name: 'jonny',
            username: 'butter_bridge',
            avatar_url:
              'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
          })
          .expect(400);
      });
    });
    describe('GET /users/:username', () => {
      it('GET / 200 responds with a user object', () => {
        return request
          .get('/api/users/butter_bridge')
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).contains.keys('username', 'name', 'avatar_url');
            expect(user.username).to.equal('butter_bridge');
          });
      });
      it('GET / 404 not found - nonexistent user', () => {
        return request.get('/api/users/toastedpancake44').expect(404);
      });
    });
    describe('GET /users/:username/articles', () => {
      it('GET / 200 responds with all the articles for that user', () => {
        return request
          .get('/api/users/butter_bridge/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.have.length(3);
            expect(articles[0]).contains.keys(
              'title',
              'article_id',
              'votes',
              'created_at',
              'topic'
            );
          });
      });
      it('GET / 200 responds with a total_count property', () => {
        return request
          .get('/api/users/butter_bridge/articles')
          .expect(200)
          .then(({ body: { total_count } }) => {
            expect(total_count).to.equal('3');
          });
      });
      it('GET / 200 gives articles with an author property', () => {
        return request
          .get('/api/users/butter_bridge/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].author).to.equal('butter_bridge');
          });
      });
      it('GET / 200 gives articles with a comment_count', () => {
        return request
          .get('/api/users/butter_bridge/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].comment_count).to.equal('13');
          });
      });
      it('GET 404 Not Found - nonexistent user', () => {
        return request.get('/api/users/butter_bench/articles').expect(404);
      });
      it('GET / 200 limits responses to 10 DEFAULT CASE', () => {
        return request
          .get('/api/users/butter_bridge/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).to.be.below(11);
          });
      });
      it('GET / 200 can be queried ?limit', () => {
        return request
          .get('/api/users/butter_bridge/articles?limit=2')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.have.length(2);
          });
      });
      it('GET ?limit=5000 just returns all the articles', () => {
        return request
          .get('/api/users/icellusedkars/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.have.length(6);
          });
      });
      it('GET ?limit=blah wrong data type - just returns all the articles', () => {
        return request
          .get('/api/users/icellusedkars/articles?limit=sausage')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.have.length(6);
          });
      });
      it('GET / 200 sorts by created_at desc DEFAULT CASE', () => {
        return request
          .get('/api/users/butter_bridge/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].created_at.slice(0, 4)).to.equal('2018');
            expect(articles[2].created_at.slice(0, 4)).to.equal('1974');
          });
      });
      it('GET / 200 can be queried ?sort_by', () => {
        return request
          .get('/api/users/butter_bridge/articles?sort_by=title')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].title).to.equal(
              "They're not exactly dogs, are they?"
            );
            expect(articles[2].title).to.equal(
              'Living in the shadow of a great man'
            );
          });
      });
      it('GET ?sort_by=cats_owned nonexistent column - sorts by default column of created_at', () => {
        return request
          .get('/api/users/icellusedkars/articles?sort_by=cats_owned')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].created_at.slice(0, 4)).to.equal('2014');
            expect(articles[5].created_at.slice(0, 4)).to.equal('1978');
          });
      });
      it('GET / 200 can be queried ?order=asc to sort ascending', () => {
        return request
          .get('/api/users/butter_bridge/articles?order=asc')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].created_at.slice(0, 4)).to.equal('1974');
            expect(articles[2].created_at.slice(0, 4)).to.equal('2018');
          });
      });
      it('GET ?order can only be asc or desc - anything else defaults to desc', () => {
        return request
          .get('/api/users/icellusedkars/articles?order=bat')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].created_at.slice(0, 4)).to.equal('2014');
            expect(articles[5].created_at.slice(0, 4)).to.equal('1978');
          });
      });
      it('GET / 200 can be queried ?p to see pages', () => {
        return request
          .get('/api/users/icellusedkars/articles?limit=3&p=2')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].article_id).to.equal(7);
          });
      });
      it("GET 404 Not Found - page that doesn't exist", () => {
        return request.get('/api/users/icellusedkars/articles?p=3').expect(404);
      });
    });
  });
});
