const { fetchTopics } = require('../models/topics');

const getTopics = function(req, res, next) {
  fetchTopics().then(topics => res.status(200).send({ topics }));
};

const addTopic = function(req, res, next) {
  console.log('adding topic...');
};

const getArticlesByTopic = function(req, res, next) {
  console.log('getting articles by topic...');
};

const postArticleInTopic = function(req, res, next) {
  console.log('posting article in this topic...');
};

module.exports = {
  getTopics,
  addTopic,
  getArticlesByTopic,
  postArticleInTopic,
};
