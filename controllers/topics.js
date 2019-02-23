const {
  fetchTopics,
  addTopic,
  fetchArticlesByTopic,
  addArticle
} = require('../models/topics');

const getTopics = function(req, res, next) {
  fetchTopics()
    .then(topics => res.status(200).send({ topics }))
    .catch(next);
};

const postTopic = function(req, res, next) {
  addTopic(req.body)
    .then(([topic]) => {
      res.status(201).send({ topic });
    })
    .catch(err => {
      next({
        status: 400,
        message: 'could not add this topic'
      });
    });
};

const getArticlesByTopic = function(req, res, next) {
  fetchArticlesByTopic(req.params, req.query)
    .then(([topic, articles, countData]) => {
      // all good, we have articles
      if (articles.length !== 0) {
        const { total_count } = countData[0];
        return res.status(200).send({ total_count, articles });
      }
      // topic exists, but no articles for it
      if (topic[0]) {
        return res.status(200).send({ total_count: 0, articles });
      }
      // topic exists, there are articles, but pagination went too far back
      if (countData[0]) {
        const { total_count } = countData[0];
        return res.status(200).send({ total_count, articles: [] });
      }
      // else
      return Promise.reject({ status: 404, message: 'articles not found' });
    })
    .catch(next);
};

const postArticleInTopic = function(req, res, next) {
  addArticle(req.params, req.body)
    .then(([article]) => {
      res.status(201).send({ article });
    })
    .catch(err => {
      if (err.code === '23502') {
        return next({
          status: 400,
          message: 'article not formatted correctly'
        });
      }
      if (err.code === '23503') {
        return next({ status: 404, message: 'no such topic' });
      }
      return next(err);
    });
};

module.exports = {
  getTopics,
  postTopic,
  getArticlesByTopic,
  postArticleInTopic
};
