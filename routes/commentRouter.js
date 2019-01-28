const commentRouter = require('express').Router();
const { getComments, addComment } = require('../controllers/comments');
const {
  getArticleById,
  addVote,
  deleteArticle,
} = require('../controllers/articles');

commentRouter
  .route('/')
  .get(getArticleById)
  .patch(addVote)
  .delete(deleteArticle);

commentRouter
  .route('/comments')
  .get(getComments)
  .post(addComment);

module.exports = commentRouter;
