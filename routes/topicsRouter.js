const topicRouter = require('express').Router();
const {
  getTopics,
  postTopic,
  getArticlesByTopic,
  postArticleInTopic,
} = require('../controllers/topics');

topicRouter
  .route('/')
  .get(getTopics)
  .post(postTopic);

topicRouter
  .route('/:topic/articles')
  .get(getArticlesByTopic)
  .post(postArticleInTopic);

module.exports = topicRouter;
