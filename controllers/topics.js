const {
  fetchTopics,
  addTopic,
  fetchArticlesByTopic,
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
  const { limit, sort_by } = req.query;
  fetchArticlesByTopic(topicSlug, limit, sort_by).then(
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
  console.log('posting article in this topic...');
};

module.exports = {
  getTopics,
  postTopic,
  getArticlesByTopic,
  postArticleInTopic,
};
