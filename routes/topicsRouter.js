const topicRouter = require('express').Router();
const {
  getTopics,
  postTopic,
  getArticlesByTopic,
  postArticleInTopic,
} = require('../controllers/topics');
const { handle405 } = require('../errors');

topicRouter
  .route('/')
  .get(getTopics)
  .post(postTopic)
  .all(handle405);

topicRouter
  .route('/:topic/articles')
  .get(getArticlesByTopic)
  .post(postArticleInTopic)
  .all(handle405);

module.exports = topicRouter;
