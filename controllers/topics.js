const {
  fetchTopics,
  addTopic,
  fetchArticlesByTopic,
  addArticle,
} = require('../models/topics');

const getTopics = function(req, res, next) {
  fetchTopics().then(topics => res.status(200).send({ topics }));
};

const postTopic = function(req, res, next) {
  const newTopic = req.body;
  addTopic(newTopic)
    .then(([topic]) => {
      res.status(201).send({ topic });
    })
    .catch(err => {
      next({
        status: 400,
        message: 'could not add this topic',
      });
    });
};

const getArticlesByTopic = function(req, res, next) {
  fetchArticlesByTopic(req.query, req.params)
    .then(([articles, countData]) => {
      if (articles.length !== 0) {
        const { total_count } = countData[0];
        res.status(200).send({ total_count, articles });
      } else {
        return Promise.reject({ status: 404, message: 'articles not found' });
      }
    })
    .catch(next);
};

const postArticleInTopic = function(req, res, next) {
  const { topic } = req.params;
  const { title, username, body } = req.body;
  const newArticle = { topic, title, username, body };
  addArticle(newArticle)
    .then(([article]) => {
      res.status(201).send({ article });
    })
    .catch(err => {
      if (err.code === '23502') {
        return next({
          status: 400,
          message: 'article not formatted correctly',
        });
      }
      if (err.code === '23503') {
        return next({ status: 404, message: 'no such topic' });
      }
    });
};

module.exports = {
  getTopics,
  postTopic,
  getArticlesByTopic,
  postArticleInTopic,
};
