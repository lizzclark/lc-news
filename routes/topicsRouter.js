const topicRouter = require('express').Router();
const {
  getTopics,
  addTopic,
  getArticlesByTopic,
  postArticleInTopic,
} = require('../controllers/topics');

topicRouter
  .route('/')
  .get(getTopics)
  .post(addTopic);

topicRouter
  .route('/:topic/articles')
  .get(getArticlesByTopic)
  .post(postArticleInTopic);

module.exports = topicRouter;
