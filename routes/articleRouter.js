const articleRouter = require('express').Router();
const { getArticles } = require('../controllers/articles');
const {
  getArticleById,
  patchVote,
  deleteArticle,
} = require('../controllers/articles');
const {
  getCommentsByArticle,
  postComment,
} = require('../controllers/comments');
const commentRouter = require('./commentRouter');

articleRouter.get('/', getArticles);

articleRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchVote)
  .delete(deleteArticle);

articleRouter.use('/:article_id/comments', commentRouter);

module.exports = articleRouter;
