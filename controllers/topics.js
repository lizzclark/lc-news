const { fetchTopics, addTopic } = require('../models/topics');

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
  console.log('getting articles by topic...');
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
