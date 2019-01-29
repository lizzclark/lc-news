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
    .then(topic => {
      res.status(201).send({ topic });
    })
    .catch(err => {
      next({
        status: 400,
        code: err.code,
        message: 'could not add this topic',
      });
    });
};

const getArticlesByTopic = function(req, res, next) {
  const topicSlug = req.params.topic;
  const { limit, sort_by, order, p } = req.query;
  // invoke model
  fetchArticlesByTopic(topicSlug, limit, sort_by, order, p).then(
    ([articles, countData]) => {
      if (articles.length === 0) {
        next({ status: 404, message: 'articles not found' });
      } else {
        const { total_count } = countData[0];
        res.status(200).send({ total_count, articles });
      }
    }
  );
};

const postArticleInTopic = function(req, res, next) {
  const { topic } = req.params;
  const { title, username, body } = req.body;
  const newArticle = { topic, title, username, body };
  addArticle(newArticle)
    .then(article => {
      res.status(201).send({ article });
    })
    .catch(err => {
      return next({
        status: 400,
        message: 'article not formatted correctly',
      });
    });
};

module.exports = {
  getTopics,
  postTopic,
  getArticlesByTopic,
  postArticleInTopic,
};
