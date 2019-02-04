const articleRouter = require('express').Router();
const { getArticles } = require('../controllers/articles');
const {
  getArticleById,
  patchVote,
  deleteArticle,
} = require('../controllers/articles');
const { handle405 } = require('../errors');
const commentRouter = require('./commentRouter');

articleRouter.get('/', getArticles).all('/', handle405);

articleRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchVote)
  .delete(deleteArticle)
  .all(handle405);

articleRouter.use('/:article_id/comments', commentRouter);

module.exports = articleRouter;
