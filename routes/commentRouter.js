const commentRouter = require('express').Router({ mergeParams: true });
const { getCommentsByArticle, addComment } = require('../controllers/comments');

commentRouter
  .route('/')
  .get(getCommentsByArticle)
  .post(addComment);

// commentRouter
//   .route('/:article_id/comments/:comment_id')
//   .patch()
//   .delete();

module.exports = commentRouter;
