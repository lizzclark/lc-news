const articleRouter = require('express').Router();
const {
  getArticles,
  getArticleById,
  addVote,
  deleteArticle,
} = require('../controllers/articles');
const commentRouter = require('./commentRouter');

articleRouter.get('/', getArticles);

articleRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(addVote)
  .delete(deleteArticle);

// this line doesn't appear to be working
articleRouter.get('/:article_id/comments', () => {
  console.log('got inside here');
});

module.exports = articleRouter;
